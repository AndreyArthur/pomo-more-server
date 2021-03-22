import { Request, Response } from 'express';

import UsersRepository from '@modules/users/repositories/UsersRepository';
import AuthenticateUserService from '@modules/users/services/AuthenticateUser';
import RefreshTokenService from '@modules/users/services/RefreshToken';

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

  public async update(request: Request, response: Response): Promise<Response> {
    const usersRepository = new UsersRepository();

    const refreshToken = new RefreshTokenService(usersRepository);

    const { user, token } = await refreshToken.execute({
      user_id: request.user.id,
    });

    delete user.password;

    return response.send({ user, token });
  }
}
