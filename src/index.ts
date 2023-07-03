import { createServer } from 'node:http';
import { customServer } from './server';
import { BASE_URL } from './constants';
import 'dotenv/config';

const PORT: number = +(process.env.PORT || 4000);

const server = createServer(customServer());

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}. Go to http://localhost:${PORT}${BASE_URL}`);
});

process.on('SIGINT', () => {
  server.close(() => process.exit());
});
