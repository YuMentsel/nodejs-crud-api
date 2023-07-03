import { IncomingMessage, ServerResponse } from 'node:http';
import cluster from 'node:cluster';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  sendResponse,
  sendErrorResponse,
} from '../handlers';
import { isBalancer } from '../utils';
import { User } from '../types/interfaces';
import { ErrorMessages, Methods, StatusCodes } from '../types/enums';

export const customServer = async (req: IncomingMessage, res: ServerResponse, data: User[]) => {
  if (isBalancer() && cluster.isWorker) {
    console.log(`${req.method}. Worker ${process.pid} handles request`);
  }

  const { method, url } = req;
  console.log('Method:', method, 'Url:', url);

  if (!url) return;

  switch (method) {
    case Methods.GET:
      const users = await getUsers(url, res, data, Methods.GET);
      if (users) sendResponse(res, users);
      break;
    case Methods.POST:
      const user = await createUser(url, req, res, data);
      if (user) sendResponse(res, user, StatusCodes.Created);
      break;
    case Methods.PUT:
      const selectedUser = (await getUsers(url, res, data)) as User;
      if (!selectedUser) return;
      const foundUser = data.find((user) => user.id === selectedUser.id);
      foundUser
        ? await updateUser(foundUser, req, res, data)
        : sendErrorResponse(res, StatusCodes.NotFound, ErrorMessages.NotFound);
      break;
    case Methods.DELETE:
      const chosenUser = (await getUsers(url, res, data)) as User;
      if (!chosenUser) return;
      const deletedUser = data.find((user) => user.id === chosenUser.id);
      deletedUser
        ? await deleteUser(deletedUser, res, data)
        : sendErrorResponse(res, StatusCodes.NotFound, ErrorMessages.NotFound);
      break;
    default:
      sendErrorResponse(res, StatusCodes.NotFound, ErrorMessages.NoMetod);
  }
};
