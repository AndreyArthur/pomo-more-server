import User from '@modules/users/models/User';

interface IUsersRepository {
  findByEmail(email: string): Promise<User | undefined>;
  findByUsername(username: string): Promise<User | undefined>;
  save(user: Pick<User, 'username' | 'password' | 'email'>): Promise<User>;
}

export default IUsersRepository;
