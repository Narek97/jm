import dayjs from 'dayjs';
import * as yup from 'yup';

import { CreateUserFormElementType } from '@/Screens/UsersScreen/types.ts';

const USER_TABLE_COLUMNS = [
  {
    accessorKey: 'name',
    header: 'User Name',
  },
  {
    accessorKey: 'emailAddress',
    header: 'Email',
  },
  {
    accessorKey: 'lastSeen',
    header: 'Last Seen',
  },
  {
    accessorKey: 'updatedAt',
    header: 'Time',
    cell: ({ cell }: { cell: any }) => {
      return <>{dayjs(cell.row.original.updatedAt)?.format('YYYY-MM-DD HH:mm:ss')}</>;
    },
  },
];

const CREATE_USER_FORM_ELEMENTS: Array<CreateUserFormElementType> = [
  {
    name: 'firstName',
    title: 'First Name',
    placeholder: 'First Name',
    type: 'sting',
  },
  {
    name: 'lastName',
    title: 'Last Name',
    placeholder: 'Last Name',
    type: 'sting',
  },
  { name: 'emailAddress', title: 'Email', placeholder: 'Email', type: 'sting' },
];

const CREATE_USER_VALIDATION_SCHEMA = yup
  .object()
  .shape({
    emailAddress: yup.string().email('Invalid email').required(`Email is required`).max(50),
    firstName: yup.string().required(`First name is required`).max(50),
    lastName: yup.string().required(`Last name is required`),
  })
  .required();

export { USER_TABLE_COLUMNS, CREATE_USER_FORM_ELEMENTS, CREATE_USER_VALIDATION_SCHEMA };
