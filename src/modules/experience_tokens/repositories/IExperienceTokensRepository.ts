import ExperienceToken from '../models/ExperienceToken';

interface IExperienceTokensRepository {
  create(
    experienceToken: ExperienceToken
  ): Promise<ExperienceToken | undefined>;
  findByUserId(user_id: string): Promise<ExperienceToken | undefined>;
  update(
    experienceToken: ExperienceToken
  ): Promise<ExperienceToken | undefined>;
}

export default IExperienceTokensRepository;
