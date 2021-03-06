export type ErrData = {
  code: number;
  text: string;
};

export const UserExists: ErrData = { text: 'User already exists', code: 1 };
export const BadPostData: ErrData = { text: 'Incorrect post data', code: 2 };
export const BadLoginOrPass: ErrData = {
  text: 'Incorrect login or pass',
  code: 3,
};
export const BadAuthSchema: ErrData = {
  text: 'Authorization schema must be "Bearer"',
  code: 4,
};
export const BadJwt: ErrData = {
  text: 'Invalid token',
  code: 4,
};
export const TooManyUsersInTeam: ErrData = {
  text: 'Team can contain max 3 users',
  code: 5,
};
export const TeamNameAlreadyUsed: ErrData = {
  text: 'Team name already used',
  code: 6,
};
export const UpdObjectNotFound: ErrData = {
  text: 'The object you can try to update not found',
  code: 7,
};
export const NotPermitted: ErrData = {
  text: 'You do not have permission to do this',
  code: 8,
};
export const CantAddUser: ErrData = {
  text: 'User already in',
  code: 9,
};
export const UserNotInTeam: ErrData = {
  text: 'User not in the team',
  code: 10,
};
