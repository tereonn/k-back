export type TokenPayload = {
  user: {
    id: number;
    roles: UserRoles[];
  };
};

export enum UserRoles {
  Admin = 'admin',
  User = 'user',
}
