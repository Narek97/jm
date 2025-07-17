import { GetOrganizationUsersQuery } from '@/api/queries/generated/getOrganizationUsers.generated.ts';

type CreateUserFormType = {
  firstName: string;
  lastName: string;
  emailAddress: string;
};

type CreateUserFormElementType = {
  name: 'firstName' | 'lastName' | 'emailAddress';
  title: string;
  placeholder: string;
  type: string;
};

type OrganizationUserType = GetOrganizationUsersQuery['getOrganizationUsers']['users'][number];

export type { CreateUserFormType, CreateUserFormElementType, OrganizationUserType };
