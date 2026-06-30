import { appConfig } from '../config';
import { BackendUser } from '../types/backendUser.types';

export async function fetchUserById(userId: string): Promise<BackendUser | null> {
  const response = await fetch(
    `${appConfig.backend.url}/api/user/${encodeURIComponent(userId)}`
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Backend user API failed (${response.status}): ${text}`);
  }

  return response.json() as Promise<BackendUser>;
}
