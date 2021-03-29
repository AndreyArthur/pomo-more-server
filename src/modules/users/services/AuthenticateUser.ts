import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/models/User';
import AppError from '@shared/exceptions/AppError';

interface IRequest {
  email: string;
  password: string;
}

export default class AuthenticateUserService {
  private usersRepository: IUsersRepository;

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async execute(
    { email, password }: IRequest,
  ): Promise<{ user: User, token: string }> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Invalid email/password combination', 401);
    }

    const matchedPassword = await bcrypt.compare(
      password, user.password as string,
    );

    if (!matchedPassword) {
      throw new AppError('Invalid email/password combination', 401);
    }

    return {
      user,
      token: jwt.sign({}, process.env.JWT_SECRET as string, {
        subject: user.id,
        expiresIn: '1d',
      }),
    };
  }
}
