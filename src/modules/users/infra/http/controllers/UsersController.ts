import { Request, Response } from 'express';

import UsersRepository from '@modules/users/repositories/UsersRepository';
import CreateUserService from '@modules/users/services/CreateUser';
import FindUsersService from '@modules/users/services/FindUsers';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { username, email, password } = request.body;

    const usersRepository = new UsersRepository();

    const createUser = new CreateUserService(usersRepository);

    const user = await createUser.execute({
      email,
      password,
      username,
    });

    delete user.password;

    return response.send(user);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.query;

    const usersRepository = new UsersRepository();

    const findUsers = new FindUsersService(usersRepository);

    const users = await findUsers.execute({
      user_id: user_id ? user_id as string : undefined,
    });

    const usersWithoutPassword = users.map((user) => ({
      ...user,
      password: undefined,
    }));

    return response.send(usersWithoutPassword);
  }
}
