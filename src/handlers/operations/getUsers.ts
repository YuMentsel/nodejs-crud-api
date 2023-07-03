import { ServerResponse } from 'node:http';
import { validate } from 'uuid';
import { sendErrorResponse } from '../sendErrorResponse';
import { BASE_URL } from '../../constants';
import { isBaseUrl } from '../../utils/validation';
import { User } from '../../types/interfaces';
import { ErrorMessages, StatusCodes, Methods } from '../../types/enums';

export const getUsers = async (
  url: string,
  res: ServerResponse,
  users: User[],
  metod?: Methods,
) => {
  if (isBaseUrl(url) && metod === Methods.GET) {
    return users;
  } else if (url?.startsWith(BASE_URL)) {
    const id = url.split('/')[3];
    if (validate(id)) {
      return (
        users.find((currentUser) => currentUser.id === id) ||
        sendErrorResponse(res, StatusCodes.NotFound, ErrorMessages.NotFound)
      );
    }
    return sendErrorResponse(res, StatusCodes.BadRequest, ErrorMessages.InvalidId);
  } else {
    return sendErrorResponse(res, StatusCodes.NotFound, ErrorMessages.IncorrectRoute);
  }
};
