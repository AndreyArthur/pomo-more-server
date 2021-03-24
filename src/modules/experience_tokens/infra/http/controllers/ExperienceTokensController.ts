import ExperienceTokensRepository
  from '@modules/experience_tokens/repositories/ExperienceTokensRepository,';
import CreateTokenService
  from '@modules/experience_tokens/services/CreateToken';
import UsersRepository from '@modules/users/repositories/UsersRepository';
import { Request, Response } from 'express';

export default class ExperienceTokensController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { time } = request.body;

    const usersRepository = new UsersRepository();
    const experienceTokensRepository = new ExperienceTokensRepository();

    const createToken = new CreateTokenService(
      experienceTokensRepository, usersRepository,
    );

    const token = await createToken.execute({
      timeInMinutes: Number(time),
      user_id: request.user.id,
    });

    return response.send({ token });
  }
}
