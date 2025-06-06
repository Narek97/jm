import { ChangeEvent, FC, useCallback, useState } from 'react';

import './style.scss';

import { Box } from '@mui/material';

import OrgItem from './OrgItem';

import { GetOrgsQuery, useGetOrgsQuery } from '@/api/queries/generated/getOrgs.generated.ts';
import CustomInput from '@/Components/Shared/CustomInput';
import CustomLoader from '@/Components/Shared/CustomLoader';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import { querySlateTime } from '@/constants';
import ErrorBoundary from '@/Features/ErrorBoundary';
import { debounced400 } from '@/hooks/useDebounce';
import { useCopyMapStore } from '@/store/copyMap.ts';
import { CopyMapLevelTemplateEnum } from '@/types/enum';

const Orgs: FC = () => {
  const [searchedText, setSearchedText] = useState('');

  const { setCopyMapState } = useCopyMapStore();

  const {
    isLoading: isLoadingOrgs,
    error: errorOrgs,
    data: dataOrgs,
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

  const orgs = dataOrgs?.getOrgs || [];

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
                  <CustomLoader />
                </div>
              ) : (
                <>
                  {orgs?.length ? (
                    <ul className={'orgs-list--content-orgs'}>
                      {orgs?.map(itm => (
                        <ErrorBoundary key={itm?.orgId}>
                          <OrgItem
                            search={searchedText}
                            org={{ orgId: itm.orgId, name: itm.name || '' }}
                            handleClick={orgItemCLick}
                          />
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
