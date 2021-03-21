import bcrypt from 'bcryptjs';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/models/User';
import AppError from '@shared/exceptions/AppError';

interface IRequest {
  username: string;
  email: string;
  password: string;
}

export default class CreateUserService {
  private usersRepository: IUsersRepository;

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async execute({ username, email, password }: IRequest): Promise<User> {
    const usernameExists = await this.usersRepository.findByUsername(username);

    if (usernameExists) {
      throw new AppError('Username is already in use');
    }

    const accountExists = await this.usersRepository.findByEmail(email);

    if (accountExists) {
      throw new AppError('Account already exists');
    }

    const user = await this.usersRepository.save({
      email,
      username,
      password: await bcrypt.hash(password, 10),
    });

    return user;
  }
}
