require('./load-env');

const { spawn } = require('child_process');
const path = require('path');

const workerType = process.argv[2] || 'techLead';
const bin = require.resolve('ts-node-dev/lib/bin');
const child = spawn(
  process.execPath,
  [bin, '--respawn', '--transpile-only', 'src/worker.ts'],
  {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, WORKER_TYPE: workerType },
  }
);

child.on('exit', (code) => process.exit(code ?? 0));
