require('./load-env');

const workerType = process.argv[2] || 'techLead';
process.env.WORKER_TYPE = workerType;
require('../dist/worker');
