export type SignUpInput = {
  name: string;
  email: string;
  password: string;
};

export type SignInInput = {
  email: string;
  password: string;
};

export type UpdateUserProfileInput = {
  id: string;
  name?: string;
  email?: string;
};
