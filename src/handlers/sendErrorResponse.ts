import { ServerResponse } from 'node:http';

export const sendErrorResponse = (res: ServerResponse, status: number, message: string): void => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message }));
};
