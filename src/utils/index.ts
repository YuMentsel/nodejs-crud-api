import { IncomingMessage, ServerResponse } from 'node:http';
import { JSONValidator } from './validation';

export const getRequestBody = async (req: IncomingMessage, res: ServerResponse): Promise<{}> => {
  return new Promise((resolve, reject) => {
    const bodyChunks: Uint8Array[] = [];
    req
      .on('data', (chunk: Uint8Array) => {
        bodyChunks.push(chunk);
      })
      .on('end', () => {
        const body = Buffer.concat(bodyChunks).toString().trim();
        JSONValidator(body, resolve, res);
      })
      .on('error', () => {
        reject();
      });
  });
};

export const isBalancer = () => {
  const arg = process.argv.slice(2).find((el) => el.startsWith('--'));
  return arg === '--multi';
};
