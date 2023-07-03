import { ServerResponse } from 'node:http';
import { BASE_URL } from '../constants';
import { sendErrorResponse } from '../handlers';
import { UserRequest } from '../types/interfaces';
import { StatusCodes, ErrorMessages } from '../types/enums';

export const isBaseUrl = (url: string) => url === BASE_URL || url === BASE_URL + '/';

export const JSONValidator = (
  body: string,
  resolve: (value: {} | PromiseLike<{}>) => void,
  res: ServerResponse,
) => {
  try {
    resolve(body ? JSON.parse(body) : {});
  } catch {
    sendErrorResponse(res, StatusCodes.BadRequest, ErrorMessages.InvalidJSON);
  }
};

const isValidType = ({ username, age, hobbies }: Partial<UserRequest>) =>
  typeof username === 'string' &&
  typeof age === 'number' &&
  Array.isArray(hobbies) &&
  hobbies.every((hobbie) => typeof hobbie === 'string');

export const isBodyValid = (
  body: Partial<UserRequest>,
  res: ServerResponse,
): body is UserRequest => {
  if (Object.keys(body).length !== 3 || !isValidType(body)) {
    sendErrorResponse(res, StatusCodes.BadRequest, ErrorMessages.InvalidBody);
    return false;
  }
  return true;
};
