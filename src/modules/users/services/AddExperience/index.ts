import IExperienceTokensRepository
  from '@modules/experience_tokens/repositories/IExperienceTokensRepository';
import User from '@modules/users/models/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/exceptions/AppError';
import ExperienceToken from '@modules/experience_tokens/models/ExperienceToken';

interface IRequest {
  user_id: string;
  points: number;
  password: string;
}

export default class AddExperienceService {
  private usersRepository: IUsersRepository;

  private experienceTokensRepository: IExperienceTokensRepository;

  constructor(
    usersRepository: IUsersRepository,
    experienceTokensRepository: IExperienceTokensRepository,
  ) {
    this.usersRepository = usersRepository;
    this.experienceTokensRepository = experienceTokensRepository;
  }

  public async execute({ user_id, points, password }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated users can receive experience', 401,
      );
    }

    const experienceToken = await this.experienceTokensRepository.findByUserId(
      user_id,
    ) as ExperienceToken;

    if (experienceToken.next_password !== password) {
      throw new AppError('Token not valid to this operation', 401);
    }

    await this.experienceTokensRepository.update({
      user_id,
    });

    const totalExperience = user.experience + points;

    const updatedUser = await this.usersRepository.updateExperience({
      experience: Math.round(totalExperience),
      id: user_id,
    }) as User;

    return updatedUser;
  }
}
