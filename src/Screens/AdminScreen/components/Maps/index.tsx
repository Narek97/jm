import { useGetJourneyMapsByDateQuery } from '@/api/queries/generated/getJourneyMapsByDate.generated.ts';
import { MAPS_LIMIT } from '@/Constants/pagination.ts';
import PaginatedSearchTable from '@/Features/PaginatedSearchTable';
import { MAPS_TABLE_COLUMNS } from '@/Screens/AdminScreen/components/Maps/constants.tsx';

const Maps = () => {
  return (
    <PaginatedSearchTable
      queryHook={useGetJourneyMapsByDateQuery}
      buildVariables={({ limit, offset, startDate, endDate, search }) => ({
        getJourneyMapsByDateInput: { limit, offset, startDate, endDate, search },
      })}
      extractRows={data => data?.getJourneyMapsByDate?.maps || []}
      extractCount={data => data?.getJourneyMapsByDate?.count || 0}
      columns={MAPS_TABLE_COLUMNS}
      limit={MAPS_LIMIT}
      label="maps"
    />
  );
};

export default Maps;
