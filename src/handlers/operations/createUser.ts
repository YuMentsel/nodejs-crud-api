import { ServerResponse, IncomingMessage } from 'node:http';
import { v4 as uuid } from 'uuid';
import { sendErrorResponse } from '../sendErrorResponse';
import { getRequestBody } from '../../utils';
import { isBodyValid, isBaseUrl } from '../../utils/validation';
import { User } from '../../types/interfaces';
import { ErrorMessages, StatusCodes } from '../../types/enums';

export const createUser = async (
  url: string,
  req: IncomingMessage,
  res: ServerResponse,
  users: User[],
) => {
  if (!isBaseUrl(url)) {
    sendErrorResponse(res, StatusCodes.NotFound, ErrorMessages.IncorrectRoute);
    return;
  }
  const body = await getRequestBody(req, res);
  if (isBodyValid(body, res)) {
    const user = { ...body, id: uuid() };
    users.push(user);
    return user;
  }
};
