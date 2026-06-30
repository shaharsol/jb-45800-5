import { RepositoryFile, RepositorySnapshot } from '../types/repository.types';
import { githubApiFetch } from './githubApi';

interface GitHubGitRef {
  object: { sha: string };
}

interface GitHubGitCommit {
  tree: { sha: string };
}

interface GitHubTreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree' | 'commit';
  sha: string;
  size?: number;
}

interface GitHubRecursiveTree {
  tree: GitHubTreeItem[];
  truncated: boolean;
}

interface GitHubBlob {
  content: string;
  encoding: 'base64' | 'utf-8';
}

const IGNORED_PATH_PREFIXES = [
  'node_modules/',
  '.git/',
  'dist/',
  'build/',
  'coverage/',
  '.next/',
  'vendor/',
];

const IGNORED_EXTENSIONS = [
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.ico',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.mp4',
  '.zip',
  '.pdf',
];

const MAX_FILE_BYTES = 100_000;
const MAX_FILES = 200;
const BLOB_FETCH_CONCURRENCY = 10;

function shouldIncludePath(path: string, size?: number): boolean {
  if (IGNORED_PATH_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    return false;
  }

  const lowerPath = path.toLowerCase();
  if (IGNORED_EXTENSIONS.some((ext) => lowerPath.endsWith(ext))) {
    return false;
  }

  if (size !== undefined && size > MAX_FILE_BYTES) {
    return false;
  }

  return true;
}

function decodeBlobContent(blob: GitHubBlob): string | null {
  if (blob.encoding === 'utf-8') {
    return blob.content;
  }

  const decoded = Buffer.from(blob.content, 'base64').toString('utf8');
  if (decoded.includes('\u0000')) {
    return null;
  }

  return decoded;
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  let index = 0;

  async function worker(): Promise<void> {
    while (index < items.length) {
      const currentIndex = index;
      index += 1;
      results[currentIndex] = await mapper(items[currentIndex]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}

export async function fetchRepositorySnapshot(
  accessToken: string,
  owner: string,
  repo: string,
  ref: string
): Promise<RepositorySnapshot> {
  const branchRef = await githubApiFetch<GitHubGitRef>(
    `/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(ref)}`,
    accessToken
  );

  const commit = await githubApiFetch<GitHubGitCommit>(
    `/repos/${owner}/${repo}/git/commits/${branchRef.object.sha}`,
    accessToken
  );

  const tree = await githubApiFetch<GitHubRecursiveTree>(
    `/repos/${owner}/${repo}/git/trees/${commit.tree.sha}?recursive=1`,
    accessToken
  );

  const blobItems = tree.tree
    .filter((item) => item.type === 'blob' && shouldIncludePath(item.path, item.size))
    .sort((a, b) => a.path.localeCompare(b.path));

  const selectedItems = blobItems.slice(0, MAX_FILES);
  const skippedCount = blobItems.length - selectedItems.length;

  const files = (
    await mapWithConcurrency(selectedItems, BLOB_FETCH_CONCURRENCY, async (item) => {
      const blob = await githubApiFetch<GitHubBlob>(
        `/repos/${owner}/${repo}/git/blobs/${item.sha}`,
        accessToken
      );
      const content = decodeBlobContent(blob);
      if (content === null) {
        return null;
      }
      return { path: item.path, content };
    })
  ).filter((file): file is RepositoryFile => file !== null);

  return {
    files,
    truncated: tree.truncated || skippedCount > 0,
    skippedCount,
  };
}
