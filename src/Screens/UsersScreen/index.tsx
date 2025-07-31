import { useCallback, useMemo, useState } from 'react';

import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import dayjs from 'dayjs';

import CreateUpdateUser from './components/CreateUpdateUser';
import { CREATE_USER_FORM_ELEMENTS, USER_TABLE_COLUMNS } from './constants';
import { CreateUserFormType } from './types';

import {
  CreateUserMutation,
  useCreateUserMutation,
} from '@/api/mutations/generated/createUser.generated';
import {
  GetOrganizationUsersQuery,
  useGetOrganizationUsersQuery,
} from '@/api/queries/generated/getOrganizationUsers.generated.ts';
import BaseWuDataTable from '@/Components/Shared/BaseWuDataTable';
import BaseWuInput from '@/Components/Shared/BaseWuInput';
import BaseWuLoader from '@/Components/Shared/BaseWuLoader';
import CustomError from '@/Components/Shared/CustomError';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import Pagination from '@/Components/Shared/Pagination';
import { USERS_LIMIT } from '@/Constants/pagination.ts';
import { useSetQueryDataByKey } from '@/Hooks/useQueryKey.ts';

const UsersScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchUserText, setSearchUserText] = useState<string>('');
  const [isOpenCreateUser, setIsOpenCreateUser] = useState<boolean>(false);

  const { showToast } = useWuShowToast();

  const setOrganizationUsers = useSetQueryDataByKey('GetOrganizationUsers');

  const { mutate: mutateCreateUser, isPending: isLoadingCreateUser } = useCreateUserMutation<
    Error,
    CreateUserMutation
  >({
    onSuccess: () => {
      onToggleCreateUpdate();
    },
    onError: error => {
      showToast({
        variant: 'error',
        message: error?.message,
      });
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
        ?.filter(user => {
          if (!searchTerm) return true;
          return (
            user?.firstName?.toLowerCase().includes(searchTerm) ||
            user?.emailAddress?.toLowerCase().includes(searchTerm)
          );
        })
        ?.map(user => ({
          ...user,
          name: `${user?.firstName} ${user?.lastName ?? ''}`.trim(),
          lastSeen:
            user?.updatedAt && user?.updatedAt !== user?.createdAt
              ? dayjs(user?.updatedAt).format('DD/MM/YYYY')
              : 'Never logged in',
        })) ?? []
    );
  }, [data?.getOrganizationUsers?.users, searchUserText]);

  const onHandleChangePage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const onUserSearch = useCallback((value: string) => {
    setSearchUserText(value);
    setCurrentPage(1);
  }, []);

  const onHandleCreateUser = useCallback(
    (data: CreateUserFormType, reset: () => void) => {
      mutateCreateUser(
        {
          createUserInput: data,
        },
        {
          onSuccess: response => {
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
          onError: error => {
            showToast({
              variant: 'error',
              message: error?.message,
            });
          },
        },
      );
    },
    [mutateCreateUser, setOrganizationUsers, showToast],
  );

  const onToggleCreateUpdate = useCallback(() => {
    onUserSearch('');
    setIsOpenCreateUser(prev => !prev);
  }, [onUserSearch]);

  const columns = useMemo(() => {
    return USER_TABLE_COLUMNS;
  }, []);

  if (isError) {
    return <CustomError error={error?.message} />;
  }

  return (
    <div className={'h-full !pt-8 !px-16 !pb-[0]'}>
      <h3 className={'base-title !text-heading-2'}>Users</h3>

      <div className={`flex gap-4 py-4 md:pb-8 border-b border-[var(--light-gray)]`}>
        <div className={'min-w-[200px]'}>
          <BaseWuInput
            isIconInput={true}
            data-testid="user-search-field-test-id"
            placeholder={`search user...`}
            value={searchUserText}
            onChange={e => onUserSearch(e.target.value)}
            onKeyDown={event => {
              if (event.keyCode === 13) {
                event.preventDefault();
                (event.target as HTMLElement).blur();
              }
            }}
          />
        </div>
        <CreateUpdateUser
          formElements={CREATE_USER_FORM_ELEMENTS}
          defaultValues={{ firstName: '', lastName: '', emailAddress: '' }}
          createButtonText={'New user'}
          inputPlaceholder={''}
          isDisabledInput={isLoadingCreateUser}
          isDisabledButton={isLoadingCreateUser}
          isLoading={isLoadingCreateUser}
          onToggleCreateUpdateFunction={onToggleCreateUpdate}
          isOpenCreateUpdateItem={isOpenCreateUser}
          onHandleCreateFunction={onHandleCreateUser}
          onHandleUpdateFunction={() => {}}
        />

        <div className={'flex justify-end flex-1/2'}>
          {data?.getOrganizationUsers && data?.getOrganizationUsers.count - 1 > USERS_LIMIT && (
            <Pagination
              currentPage={currentPage}
              perPage={USERS_LIMIT}
              allCount={data?.getOrganizationUsers.count - 1}
              changePage={onHandleChangePage}
            />
          )}
        </div>
      </div>

      {isPending ? (
        <BaseWuLoader />
      ) : (
        <div className={'mt-[1.125rem]! h-[calc(100dvh-21rem)]'}>
          {usersData?.length ? (
            <BaseWuDataTable data={usersData} columns={columns} />
          ) : (
            <EmptyDataInfo message={'No org-users Yet'} />
          )}
        </div>
      )}
    </div>
  );
};

export default UsersScreen;
