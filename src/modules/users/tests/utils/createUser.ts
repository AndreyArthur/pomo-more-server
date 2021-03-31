import User from '@modules/users/models/User';
import UsersRepository from '@modules/users/repositories/UsersRepository';
import CreateUserService from '@modules/users/services/CreateUser';
import generateRandomString from '@shared/utils/generateRandomString';

interface UserWithOriginalPassword extends User {
  originalPassword: string;
}

export default async function createUser(): Promise<UserWithOriginalPassword> {
  const usersRepository = new UsersRepository();

  const password = generateRandomString(8);

  const createUserService = new CreateUserService(usersRepository);

  const user = await createUserService.execute({
    username: generateRandomString(12),
    email: generateRandomString(16),
    password,
  });

  return { ...user, originalPassword: password };
}
