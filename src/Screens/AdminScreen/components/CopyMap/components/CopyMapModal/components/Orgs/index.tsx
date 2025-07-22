import { ChangeEvent, FC, useCallback, useMemo, useState } from 'react';

import './style.scss';

import OrgItem from './OrgItem';

import { GetOrgsQuery, useGetOrgsQuery } from '@/api/queries/generated/getOrgs.generated.ts';
import CustomInput from '@/Components/Shared/CustomInput';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import WuBaseLoader from '@/Components/Shared/WuBaseLoader';
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
      <div className="org-users--search" data-testid="admin-orgs">
        <div className="org-users--search-input">
          <CustomInput placeholder={'Search for an organization'} onChange={onHandleSearchOrgs} />
        </div>
      </div>
      {errorOrgs ? (
        <div className={'orgs-error'}>
          <div className={'orgs-error--text'}>{errorOrgs?.message}</div>
        </div>
      ) : (
        <>
          <div className={'orgs-list'}>
            <div className={'orgs-list--content'}>
              {isLoadingOrgs && !orgs?.length ? (
                <div className={'orgs-list-loading-section'}>
                  <WuBaseLoader />
                </div>
              ) : (
                <>
                  {orgs?.length ? (
                    <ul className={'orgs-list--content-orgs'}>
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
