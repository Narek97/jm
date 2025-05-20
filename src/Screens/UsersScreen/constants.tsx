import dayjs from "dayjs";
import * as yup from "yup";

import { CreateUserElementType } from "@/Screens/UsersScreen/types.ts";
import { TableColumnType } from "@/types";

const USER_TABLE_COLUMNS: Array<TableColumnType> = [
  {
    id: "name",
    label: "User Name",
  },
  {
    id: "emailAddress",
    label: "Email",
  },
  {
    id: "lastSeen",
    label: "Last Seen",
  },
  {
    id: "updatedAt",
    label: "Time",
    renderFunction: (row) => {
      return <>{dayjs(row.updatedAt)?.format("YYYY-MM-DD HH:mm:ss")}</>;
    },
  },
];

const CREATE_USER_FORM_ELEMENTS: Array<CreateUserElementType> = [
  {
    name: "firstName",
    title: "First Name",
    placeholder: "First Name",
    type: "sting",
  },
  {
    name: "lastName",
    title: "Last Name",
    placeholder: "Last Name",
    type: "sting",
  },
  { name: "emailAddress", title: "Email", placeholder: "Email", type: "sting" },
];

const CREATE_USER_VALIDATION_SCHEMA = yup
  .object()
  .shape({
    emailAddress: yup
      .string()
      .email("Invalid email")
      .required(`Email is required`)
      .max(50),
    firstName: yup.string().required(`First name is required`).max(50),
    lastName: yup.string().required(`Last name is required`),
  })
  .required();

export {
  USER_TABLE_COLUMNS,
  CREATE_USER_FORM_ELEMENTS,
  CREATE_USER_VALIDATION_SCHEMA,
};
