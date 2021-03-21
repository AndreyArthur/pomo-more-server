import { Request, Response } from 'express';

import UsersRepository from '@modules/users/repositories/UsersRepository';
import AuthenticateUserService from '@modules/users/services/AuthenticateUser';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const usersRepository = new UsersRepository();

    const authenticateUser = new AuthenticateUserService(usersRepository);

    const { user, token } = await authenticateUser.execute({
      email,
      password,
    });

    delete user.password;

    return response.send({ user, token });
  }
}
