import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/models/User';
import AppError from '@shared/exceptions/AppError';

interface IRequest {
  user_id?: string;
}

export default class FindUsersService {
  private usersRepository: IUsersRepository;

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async execute({ user_id }: IRequest): Promise<User[]> {
    if (user_id) {
      const user = await this.usersRepository.findById(user_id);

      if (!user) {
        throw new AppError('User not exists');
      }

      return [user];
    }

    const users = await this.usersRepository.findAll();

    return users;
  }
}
