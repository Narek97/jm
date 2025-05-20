import "./style.scss";
import { useCallback, useMemo, useState } from "react";

import { Box } from "@mui/material";
import dayjs from "dayjs";

import CreateUpdateUser from "./components/CreateUpdateUser";

import { useGetOrganizationUsersQuery } from "@/api/infinite-queries/generated/getOrganizationUsers.generated";
import {
  CreateUserMutation,
  useCreateUserMutation,
} from "@/api/mutations/generated/createUser.generated";
import { GetOrganizationUsersQuery } from "@/api/queries/generated/getOrganizationUsers.generated.ts";
import { CreateUserInput } from "@/api/types.ts";
import CustomError from "@/Components/Shared/CustomError";
import CustomInput from "@/Components/Shared/CustomInput";
import CustomLoader from "@/Components/Shared/CustomLoader";
import CustomTable from "@/Components/Shared/CustomTable";
import EmptyDataInfo from "@/Components/Shared/EmptyDataInfo";
import Pagination from "@/Components/Shared/Pagination";
import { USERS_LIMIT } from "@/constants/pagination.ts";
import { useSetQueryDataByKey } from "@/hooks/useQueryKey.ts";
import {
  CREATE_USER_FORM_ELEMENTS,
  CREATE_USER_VALIDATION_SCHEMA,
  USER_TABLE_COLUMNS,
} from "@/Screens/UsersScreen/constants.tsx";
import { ObjectKeysType } from "@/types";

const UsersScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchUserText, setSearchUserText] = useState<string>("");
  const [isCreateUser, setIsCreateUser] = useState<boolean>(false);
  const [isOpenCreateUser, setIsOpenCreateUser] = useState<boolean>(false);

  const setOrganizationUsers = useSetQueryDataByKey("GetOrganizationUsers");

  const { mutate: mutateCreateUser, isPending: isLoadingCreateUser } =
    useCreateUserMutation<CreateUserMutation, Error>({
      onSuccess: () => {
        onToggleCreateUser();
      },
    });

  // todo USERS_LIMIT should be dynamic
  const { data, isPending, isError, error } = useGetOrganizationUsersQuery<
    GetOrganizationUsersQuery,
    Error
  >({
    paginationInput: {
      page: 1,
      perPage: USERS_LIMIT,
    },
  });

  const usersData = useMemo(() => {
    const searchTerm = searchUserText.trim().toLowerCase();

    return (
      data?.getOrganizationUsers?.users
        ?.filter((user) => {
          if (!searchTerm) return true;
          return (
            user?.firstName?.toLowerCase().includes(searchTerm) ||
            user?.emailAddress?.toLowerCase().includes(searchTerm)
          );
        })
        ?.map((user) => ({
          ...user,
          name: `${user?.firstName} ${user?.lastName ?? ""}`.trim(),
          lastSeen:
            user?.updatedAt && user?.updatedAt !== user?.createdAt
              ? dayjs(user?.updatedAt).format("DD/MM/YYYY")
              : "Never logged in",
        })) ?? []
    );
  }, [data?.getOrganizationUsers?.users, searchUserText]);

  const onToggleCreateUser = useCallback(() => {
    setIsCreateUser((prev) => !prev);
  }, []);

  const onHandleChangePage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const onUserSearch = useCallback((value: string) => {
    setSearchUserText(value);
    setCurrentPage(1);
  }, []);

  const onHandleCreateUser = useCallback(
    (data: ObjectKeysType, reset: () => void) => {
      mutateCreateUser(
        {
          createUserInput: data as CreateUserInput,
        },
        {
          onSuccess: (response) => {
            const { firstName, lastName, emailAddress } = data;
            const newUser = {
              firstName,
              lastName,
              emailAddress,
              ...response?.createUser,
            };
            setOrganizationUsers((prev: any) => {
              if (prev) {
                return {
                  getOrganizationUsers: {
                    count: prev.getOrganizationUsers.count + 1,
                    users: [newUser, ...prev.getOrganizationUsers.users],
                  },
                };
              }
            });
            setTimeout(() => {
              setIsOpenCreateUser(false);
              reset();
            }, 5000);
          },
        },
      );
    },
    [mutateCreateUser, setOrganizationUsers],
  );

  const onToggleCreateUpdate = useCallback(() => {
    onUserSearch("");
    onToggleCreateUser();
    setIsOpenCreateUser((prev) => !prev);
  }, [onToggleCreateUser, onUserSearch]);

  const columns = useMemo(() => {
    return USER_TABLE_COLUMNS;
  }, []);

  if (isError) {
    return <CustomError error={error?.message} />;
  }

  return (
    <div className={"org-users"}>
      <div className={"base-page-header"}>
        <h3 className={"base-title !text-heading-2"}>Users</h3>
      </div>
      <div className={"org-users--main"}>
        <div className={`org-users--search-block `}>
          <div
            className={`org-users--search-block-input ${
              isCreateUser ? "org-users--disable-search-block" : ""
            } `}
          >
            <CustomInput
              isIconInput={true}
              inputType={"secondary"}
              data-testid="user-search-field-test-id"
              placeholder={`search user...`}
              type={"text"}
              value={searchUserText}
              onChange={(e) => onUserSearch(e.target.value)}
              onKeyDown={(event) => {
                if (event.keyCode === 13) {
                  event.preventDefault();
                  (event.target as HTMLElement).blur();
                }
              }}
            />
          </div>
          <CreateUpdateUser
            formData={null}
            formElements={CREATE_USER_FORM_ELEMENTS}
            validationSchema={CREATE_USER_VALIDATION_SCHEMA}
            defaultValues={{ firstName: "", lastName: "", emailAddress: "" }}
            createButtonText={"New user"}
            inputPlaceholder={""}
            isDisabledInput={isLoadingCreateUser}
            isDisabledButton={isLoadingCreateUser}
            isLoading={isLoadingCreateUser}
            onToggleCreateUpdateFunction={onToggleCreateUpdate}
            isOpenCreateUpdateItem={isOpenCreateUser}
            onHandleCreateFunction={onHandleCreateUser}
            onHandleUpdateFunction={() => {}}
          />
        </div>
      </div>
      {isPending ? (
        <CustomLoader />
      ) : (
        <div className={"org-users--table-block"}>
          {usersData?.length ? (
            <CustomTable
              isTableHead={true}
              rows={usersData}
              columns={columns}
            />
          ) : (
            <EmptyDataInfo icon={<Box />} message={"No org-users Yet"} />
          )}
          {data?.getOrganizationUsers.count - 1 > USERS_LIMIT && (
            <Pagination
              currentPage={currentPage}
              perPage={USERS_LIMIT}
              allCount={data?.getOrganizationUsers.count - 1}
              changePage={onHandleChangePage}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default UsersScreen;
