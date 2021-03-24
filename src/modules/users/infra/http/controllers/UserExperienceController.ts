import { Request, Response } from 'express';

import UsersRepository from '@modules/users/repositories/UsersRepository';
import ExperienceTokensRepository
  from '@modules/experience_tokens/repositories/ExperienceTokensRepository,';
import AddExperienceService from '@modules/users/services/AddExperience';

export default class UserExperienceController {
  public async update(request: Request, response: Response): Promise<Response> {
    const usersRepository = new UsersRepository();
    const experienceTokensRepository = new ExperienceTokensRepository();

    const addExperience = new AddExperienceService(
      usersRepository, experienceTokensRepository,
    );

    const user = await addExperience.execute({
      password: request.experience.password,
      user_id: request.experience.user_id,
      points: request.experience.points,
    });

    return response.send(user);
  }
}
