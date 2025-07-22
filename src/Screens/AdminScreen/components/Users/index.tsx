import { useGetUserSessionQuery } from '@/api/queries/generated/getUserSession.generated.ts';
import PaginatedSearchTable from '@/Components/Shared/PaginatedSearchTable';
import { ADMIN_USERS_LIMIT } from '@/Constants/pagination.ts';
import { USERS_TABLE_COLUMNS } from '@/Screens/AdminScreen/components/Users/constants.tsx';

const Users = () => {
  return (
    <PaginatedSearchTable
      queryHook={useGetUserSessionQuery}
      buildVariables={({ limit, offset, startDate, endDate, search }) => ({
        getUserSessionInput: { limit, offset, startDate, endDate, search },
      })}
      extractRows={data => data?.getUserSession?.session || []}
      extractCount={data => data?.getUserSession?.count || 0}
      columns={USERS_TABLE_COLUMNS}
      limit={ADMIN_USERS_LIMIT}
      label="users"
    />
  );
};

export default Users;
