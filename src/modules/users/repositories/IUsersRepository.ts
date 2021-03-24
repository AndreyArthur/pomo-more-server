import User from '@modules/users/models/User';

interface IUsersRepository {
  findByEmail(email: string): Promise<User | undefined>;
  findByUsername(username: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
  save(user: Pick<User, 'username' | 'password' | 'email'>): Promise<User>;
  updateExperience(
    user: Pick<User, 'id' | 'experience'>
  ): Promise<User | undefined>
}

export default IUsersRepository;
