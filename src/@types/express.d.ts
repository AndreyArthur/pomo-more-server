declare namespace Express {
  export interface Request {
    user: {
      id: string;
    }

    experience: {
      points: number;
      user_id: string;
      password: string;
    }
  }
}
