import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import 'dotenv/config';

import getPomodoroMillisecondsTimes
  from '@modules/experience_tokens/utils/getPomodoroMillisecondsTimes';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/exceptions/AppError';
import IExperienceTokensRepository
  from '@modules/experience_tokens/repositories/IExperienceTokensRepository';

interface IRequest {
  user_id: string;
  timeInMinutes: number;
}

export default class CreateTokenService {
  private experienceTokensRepository: IExperienceTokensRepository;

  private usersRepository: IUsersRepository;

  constructor(
    experienceTokensRepository: IExperienceTokensRepository,
    usersRepository: IUsersRepository,
  ) {
    this.experienceTokensRepository = experienceTokensRepository;
    this.usersRepository = usersRepository;
  }

  public async execute({ user_id, timeInMinutes }: IRequest): Promise<string> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated users can change create a experience token', 401,
      );
    }

    const { workingTime } = getPomodoroMillisecondsTimes(
      timeInMinutes,
    );

    const tokenPassword = crypto.randomBytes(16).toString('hex').slice(0, 16);

    const userHasToken = await this.experienceTokensRepository.findByUserId(
      user_id,
    );

    if (userHasToken) {
      await this.experienceTokensRepository.update({
        user_id,
        next_password: tokenPassword,
      });
    } else {
      await this.experienceTokensRepository.create({
        user_id,
        next_password: tokenPassword,
      });
    }

    return jwt.sign({}, process.env.JWT_SECRET as string, {
      subject: JSON.stringify({
        invalidTime: Date.now() + workingTime,
        experiencePoints: timeInMinutes * 4,
        password: tokenPassword,
        user_id,
      }),
      expiresIn: timeInMinutes * 60,
    });
  }
}
