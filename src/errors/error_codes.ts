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
