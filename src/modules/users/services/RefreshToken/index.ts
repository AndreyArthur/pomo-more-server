import jwt from 'jsonwebtoken';
import 'dotenv/config';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/models/User';
import AppError from '@shared/exceptions/AppError';

interface IRequest {
  user_id: string;
}

export default class RefreshTokenService {
  private usersRepository: IUsersRepository;

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async execute(
    { user_id }: IRequest,
  ): Promise<{ token: string, user: User }> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can refresh token');
    }

    return {
      user,
      token: jwt.sign({}, process.env.JWT_SECRET as string, {
        subject: user_id,
        expiresIn: '1d',
      }),
    };
  }
}
