import { ChangeEvent, FC, useCallback, useMemo, useState } from 'react';

import OrgItem from './OrgItem';

import { GetOrgsQuery, useGetOrgsQuery } from '@/api/queries/generated/getOrgs.generated.ts';
import BaseWuInput from '@/Components/Shared/BaseWuInput';
import BaseWuLoader from '@/Components/Shared/BaseWuLoader';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import { querySlateTime } from '@/Constants';
import ErrorBoundary from '@/Features/ErrorBoundary';
import { debounced400 } from '@/Hooks/useDebounce';
import { useCopyMapStore } from '@/Store/copyMap.ts';
import { CopyMapLevelTemplateEnum } from '@/types/enum';

const Orgs: FC = () => {
  const [searchedText, setSearchedText] = useState('');

  const { setCopyMapState } = useCopyMapStore();

  const {
    data: dataOrgs,
    isLoading: isLoadingOrgs,
    error: errorOrgs,
  } = useGetOrgsQuery<GetOrgsQuery, Error>(
    { getOrgsInput: { search: searchedText } },
    {
      staleTime: querySlateTime,
    },
  );

  const onHandleSearchOrgs = (e: ChangeEvent<HTMLInputElement>) => {
    debounced400(() => {
      setSearchedText(e.target.value);
    });
  };

  const orgItemCLick = useCallback(
    (orgId: number) => {
      setCopyMapState({
        template: CopyMapLevelTemplateEnum.WORKSPACES,
        orgId,
      });
    },
    [setCopyMapState],
  );

  const orgs = useMemo(() => dataOrgs?.getOrgs || [], [dataOrgs?.getOrgs]);

  return (
    <>
      <div className="w-full flex justify-end px-[2.125rem] mt-4 " data-testid="admin-orgs">
        <div className="w-[16.25rem] !mr-[1.6rem]">
          <BaseWuInput
            isIconInput={true}
            placeholder={'Search for an organization'}
            onChange={onHandleSearchOrgs}
          />
        </div>
      </div>
      {errorOrgs ? (
        <div>
          <div className={'px-5 pt-5 pb-15 text-[color:var(--base-error-color)]'}>
            {errorOrgs?.message}
          </div>
        </div>
      ) : (
        <>
          <div className={'p-2 h-[23.125rem]'}>
            <div className={'h-full overflow-x-auto'}>
              {isLoadingOrgs && !orgs?.length ? (
                <BaseWuLoader />
              ) : (
                <>
                  {orgs?.length ? (
                    <ul className={'p-4'}>
                      {orgs?.map(org => (
                        <ErrorBoundary key={org?.orgId}>
                          <OrgItem search={searchedText} org={org} handleClick={orgItemCLick} />
                        </ErrorBoundary>
                      ))}
                    </ul>
                  ) : (
                    <EmptyDataInfo message={'There are no organizations yet'} />
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Orgs;
