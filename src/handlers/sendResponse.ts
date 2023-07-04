import { IncomingMessage, ServerResponse } from 'node:http';
import { User } from '../types/interfaces';
import { StatusCodes } from '../types/enums';

export const sendResponse = (
  res: ServerResponse<IncomingMessage>,
  data: User[] | User,
  status: StatusCodes = StatusCodes.OK,
) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};
