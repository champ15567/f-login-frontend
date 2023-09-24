export interface ResData {
  status: string;
  message: string;
  token: string;
  profile: {
    username: string;
    email: string;
    role: string;
  };
}
