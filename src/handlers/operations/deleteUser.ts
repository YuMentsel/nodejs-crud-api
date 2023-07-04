import { ServerResponse } from 'node:http';
import { sendResponse } from '../sendResponse';
import { User } from '../../types/interfaces';

export const deleteUser = async (deletedUser: User, res: ServerResponse, users: User[]) => {
  users.splice(users.indexOf(deletedUser), 1);
  sendResponse(res, deletedUser);
};
