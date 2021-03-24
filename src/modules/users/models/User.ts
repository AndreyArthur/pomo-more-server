interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  experience: number;
  created_at: Date;
  updated_at: Date;
}

export default User;
