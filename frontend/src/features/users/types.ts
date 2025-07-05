export interface User {
  id: string;
  username: string;
  passwordHash: string;
}

export interface AuthenticateUserResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
  };
}
