interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  created_at: Date;
  updated_at: Date;
}

export default User;