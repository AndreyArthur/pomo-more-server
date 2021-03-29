import jwt from 'jsonwebtoken';
import 'dotenv/config';

export default function decodeExperienceToken(
  token: string,
): { user_id: string, points: number, password: string, invalidTime: number } {
  const { sub } = jwt.verify(
    token, process.env.JWT_SECRET as string,
  ) as { sub: string };

  const subject = JSON.parse(sub);

  return {
    user_id: subject.user_id,
    points: subject.experiencePoints,
    password: subject.password,
    invalidTime: subject.invalidTime,
  };
}
