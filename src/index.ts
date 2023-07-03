import { IncomingMessage, ServerResponse, createServer } from 'node:http';
import cluster from 'cluster';
import { customServer } from './server';
import { BASE_URL } from './constants';
import { balancer } from './balancer';
import { isBalancer } from './utils';
import { User } from './types/interfaces';
import 'dotenv/config';

const PORT: number = Number(
  cluster.isPrimary ? +(process.env.PORT || 4000) : process.env.workerPort,
);

const data: User[] = [];

const server = createServer((req: IncomingMessage, res: ServerResponse) =>
  customServer(req, res, data),
);

isBalancer()
  ? balancer(PORT, server, data)
  : server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}. Go to http://localhost:${PORT}${BASE_URL}`);
    });

process.on('SIGINT', () => {
  server.close(() => process.exit());
});
