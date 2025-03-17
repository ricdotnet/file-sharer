export interface IUser {
  username: string;
  password: string;
  email: string;
}

export interface ICookie {
  value: string;
  owner: string;
  expires: Date;
  refresh_token: string;
}

export type TUserResult = IUser & { id: number };
export type TUserAuthenticatedTokenPayload = Omit<TUserResult, 'password'>;
export type TUserAuthenticated = Omit<IUser, 'password'> & { id: number, token: string };
