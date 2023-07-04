import { Server } from 'node:http';
import cluster from 'node:cluster';
import { cpus } from 'node:os';
import { User } from '../types/interfaces';

export const balancer = (PORT: number, server: Server, users: User[]) => {
  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
    cpus().forEach((_, i) => {
      cluster.fork({ workerPort: PORT + i });
    });
    cluster.on('exit', () => {
      cluster.fork();
    });
  } else {
    const workerPort = process.env.workerPort;
    server.listen(workerPort, () =>
      console.log(`Worker ${process.pid} is running on port ${workerPort}`),
    );
  }
};
