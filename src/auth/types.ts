export type TokenPayload = {
  user: {
    id: number;
  };
};

export enum UserRoles {
  Admin = 'admin',
  User = 'user',
}
