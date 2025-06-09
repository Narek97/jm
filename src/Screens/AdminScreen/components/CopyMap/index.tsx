import { ChangeEvent, lazy, Suspense, useMemo, useState } from 'react';

import { GetOrgsQuery, useGetOrgsQuery } from '@/api/queries/generated/getOrgs.generated.ts';
import CustomError from '@/Components/Shared/CustomError';
import CustomInput from '@/Components/Shared/CustomInput';
import CustomLoader from '@/Components/Shared/CustomLoader';
import CustomTable from '@/Components/Shared/CustomTable';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import { querySlateTime } from '@/constants';
import { debounced400 } from '@/hooks/useDebounce.ts';
import { ORGS_TABLE_COLUMNS } from '@/Screens/AdminScreen/components/CopyMap/constants.tsx';
import { useCopyMapStore } from '@/store/copyMap.ts';
import { CopyMapLevelEnum } from '@/types/enum.ts';

const CopyMapModal = lazy(() => import('./components/CopyMapModal'));

const CopyMap = () => {
  const [orgId, setOrgId] = useState<number | null>(null);
  const [searchedText, setSearchedText] = useState('');

  const { reset } = useCopyMapStore();

  const {
    data: dataOrgs,
    isLoading: isLoadingOrgs,
    error: errorOrgs,
  } = useGetOrgsQuery<GetOrgsQuery, Error>(
    {
      getOrgsInput: {
        search: searchedText,
      },
    },
    {
      staleTime: querySlateTime,
    },
  );

  const onHandleSearchOrgs = (e: ChangeEvent<HTMLInputElement>) => {
    debounced400(() => {
      setSearchedText(e.target.value);
    });
  };

  const rows = useMemo(() => {
    return dataOrgs?.getOrgs?.map(itm => ({ ...itm, id: itm.orgId }));
  }, [dataOrgs?.getOrgs]);

  const columns = useMemo(() => {
    return ORGS_TABLE_COLUMNS(searchedText);
  }, [searchedText]);

  if (errorOrgs) {
    return <CustomError error={errorOrgs?.message} />;
  }

  return (
    <div className={'copy-map'}>
      {orgId && (
        <Suspense fallback={''}>
          <CopyMapModal
            orgId={orgId}
            isOpen={true}
            level={CopyMapLevelEnum.ORG}
            handleClose={() => {
              setOrgId(null);
              reset();
            }}
          />
        </Suspense>
      )}

      <div className="copy-map--search">
        <div className="copy-map--search--input">
          <CustomInput placeholder={'Search for an map'} onChange={onHandleSearchOrgs} />
        </div>
      </div>

      {isLoadingOrgs ? (
        <CustomLoader />
      ) : !isLoadingOrgs && !rows?.length ? (
        <EmptyDataInfo message="Map not found" />
      ) : (
        <CustomTable
          isTableHead={true}
          rows={rows || []}
          columns={columns}
          onClickRow={data => {
            setOrgId(data?.orgId);
          }}
        />
      )}
    </div>
  );
};

export default CopyMap;
