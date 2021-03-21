import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import UsersRepository from '@modules/users/repositories/UsersRepository';
import CreateUserService from '@modules/users/services/CreateUser';

export default class UserController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { username, email, password } = request.body;

    const usersRepository = new UsersRepository();

    const createUser = new CreateUserService(usersRepository);

    const user = await createUser.execute({
      email,
      password: await bcrypt.hash(password, 10),
      username,
    });

    delete user.password;

    return response.send(user);
  }
}
