import IExperienceTokensRepository
  from '@modules/experience_tokens/repositories/IExperienceTokensRepository';
import ExperienceToken from '@modules/experience_tokens/models/ExperienceToken';
import knex from '@shared/infra/knex';

export default class ExperienceTokensRepository
implements IExperienceTokensRepository {
  public async create(
    { next_password, user_id }: ExperienceToken,
  ): Promise<ExperienceToken | undefined> {
    const experienceTokens = await knex.raw(`
      INSERT INTO experience_tokens (
        user_id,
        next_password
      ) VALUES (
        ?,
        ?
      ) RETURNING *
    `, [user_id, next_password || null]);

    const experienceToken = experienceTokens.rows[0];

    return experienceTokens ? experienceToken : undefined;
  }

  public async update(
    { user_id, next_password }: ExperienceToken,
  ): Promise<ExperienceToken | undefined> {
    const experienceTokens = await knex.raw(`
        UPDATE experience_tokens
        SET next_password = ?
        WHERE user_id = ?
        RETURNING *
      `, [next_password || null, user_id]);

    const experienceToken = experienceTokens.rows[0];

    return experienceTokens ? experienceToken : undefined;
  }

  public async findByUserId(
    user_id: string,
  ): Promise<ExperienceToken | undefined> {
    const experienceTokens = await knex.raw(
      'SELECT * FROM experience_tokens WHERE user_id = ?', [user_id],
    );

    const experienceToken = experienceTokens.rows[0];

    return experienceTokens ? experienceToken : undefined;
  }
}
