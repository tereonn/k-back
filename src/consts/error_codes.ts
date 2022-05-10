export type ErrData = {
  code: number;
  text: string;
};

export const UserExists: ErrData = { text: 'User already exists', code: 1 };
export const BadPostData: ErrData = { text: 'Incorrect post data', code: 2 };
