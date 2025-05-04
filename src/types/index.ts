import { User } from "@/api/types.ts";

export type UserType = User & {
  isHavePermission: boolean;
};
