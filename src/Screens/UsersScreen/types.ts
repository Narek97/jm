export type CreateUserFormType = {
  firstName: string;
  lastName: string;
  emailAddress: string;
};

export type CreateUserFormElementType = {
  name: 'firstName' | 'lastName' | 'emailAddress';
  title: string;
  placeholder: string;
  type: string;
};
