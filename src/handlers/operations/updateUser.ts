import { ServerResponse, IncomingMessage } from 'node:http';
import { sendResponse } from '../sendResponse';
import { getRequestBody } from '../../utils';
import { isBodyValid } from '../../utils/validation';
import { User } from '../../types/interfaces';

export const updateUser = async (
  foundUser: User,
  req: IncomingMessage,
  res: ServerResponse,
  users: User[],
) => {
  const body = await getRequestBody(req, res);
  const { id } = foundUser;
  if (!isBodyValid(body, res)) return;
  const updatedUser = { ...body, id };
  users.splice(users.indexOf(foundUser), 1, updatedUser);
  sendResponse(res, updatedUser);
};
