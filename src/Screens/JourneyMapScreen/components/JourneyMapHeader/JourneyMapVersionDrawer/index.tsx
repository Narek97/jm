import React, { FC, useCallback, useMemo, useRef, useState } from 'react';

import './style.scss';

import { Modal } from '@mui/material';
import dayjs from 'dayjs';
import fromNow from 'dayjs/plugin/relativeTime';

import { useInfiniteGetMapVersionsQuery } from '@/api/infinite-queries/generated/getMapVersions.generated.ts';
import {
  ReplaceMapVersionMutation,
  useReplaceMapVersionMutation,
} from '@/api/mutations/generated/replaceMapVersion.generated.ts';
import CustomModalFooterButtons from '@/Components/Shared/CustomModalFooterButtons';
import CustomModalHeader from '@/Components/Shared/CustomModalHeader';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import WuBaseLoader from '@/Components/Shared/WuBaseLoader';
import { JOURNEY_MAP_VERSION_LIMIT } from '@/constants/pagination';
import DeleteVersionModal from '@/Screens/JourneyMapScreen/components/JourneyMapHeader/JourneyMapVersionDrawer/DeleteVersionModal';
import VersionCard from '@/Screens/JourneyMapScreen/components/JourneyMapHeader/JourneyMapVersionDrawer/VersionCard';
import { MapVersionType } from '@/Screens/JourneyMapScreen/components/JourneyMapHeader/types.ts';
import { useJourneyMapStore } from '@/store/journeyMap.ts';

interface IVersionDrawer {
  mapID: number;
  onHandleClose: () => void;
}
dayjs.extend(fromNow);

const VersionDrawer: FC<IVersionDrawer> = ({ mapID, onHandleClose }) => {
  const { updateJourneyMapVersion, updateJourneyMap } = useJourneyMapStore();

  const [selectedVersion, setSelectedVersion] = useState<MapVersionType | null>(null);
  const [selectDeletedVersionId, setSelectDeletedVersionId] = useState<number | null>(null);

  const childRef = useRef<HTMLUListElement>(null);

  const { mutate: mutateReplaceMapVersion, isPending: isLoadingReplaceMapVersion } =
    useReplaceMapVersionMutation<Error, ReplaceMapVersionMutation>();

  const {
    data: versionsData,
    isFetching: versionsIsFetchingNextPage,
    hasNextPage: versionsHasNextPage,
    fetchNextPage: versionsFetchNextPage,
  } = useInfiniteGetMapVersionsQuery(
    {
      getMapVersionsInput: {
        mapId: mapID,
        limit: JOURNEY_MAP_VERSION_LIMIT,
        offset: 0,
      },
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage.getMapVersions.mapVersions || !lastPage.getMapVersions.mapVersions.length) {
          return undefined;
        }
        return {
          mapId: mapID,
          paginationInput: {
            limit: JOURNEY_MAP_VERSION_LIMIT,
            offset: allPages.length * JOURNEY_MAP_VERSION_LIMIT,
          },
        };
      },
      initialPageParam: 0,
    },
  );

  const renderedVersionsData = useMemo<Array<MapVersionType>>(() => {
    if (!versionsData?.pages) {
      return [];
    }

    return versionsData.pages.reduce((acc: Array<MapVersionType>, curr) => {
      if (curr?.getMapVersions.mapVersions) {
        return [...acc, ...(curr.getMapVersions.mapVersions as Array<MapVersionType>)];
      }
      return acc;
    }, []);
  }, [versionsData?.pages]);

  const onHandleFetch = (e: React.UIEvent<HTMLElement>, childOffsetHeight: number) => {
    const target = e.currentTarget as HTMLDivElement | null;
    if (
      target &&
      target.offsetHeight + target.scrollTop + 100 >= childOffsetHeight &&
      versionsHasNextPage
    ) {
      versionsFetchNextPage().then();
    }
  };

  const onHandleSelectPreliminaryVersion = useCallback(
    (version: MapVersionType) => {
      updateJourneyMapVersion(version);
      onHandleClose();
    },
    [onHandleClose, updateJourneyMapVersion],
  );

  const onHandleRestoreVersion = useCallback((version: MapVersionType) => {
    setSelectedVersion(version);
  }, []);

  const onHandleToggleDeleteVersion = useCallback((versionId: number | null) => {
    setSelectDeletedVersionId(versionId);
  }, []);

  const onHandleConfirmRestore = useCallback(() => {
    mutateReplaceMapVersion(
      {
        replaceMapVersionInput: {
          versionId: selectedVersion!.id,
        },
      },
      {
        onSuccess: response => {
          updateJourneyMap({
            title: response.replaceMapVersion.title?.trim() || 'Untitled',
            columns: response.replaceMapVersion.columns || [],
            rows: response.replaceMapVersion.rows as any,
          });
          setSelectedVersion(null);
          onHandleClose();
        },
      },
    );
  }, [mutateReplaceMapVersion, onHandleClose, selectedVersion, updateJourneyMap]);

  const onHandleCloseConfirmRestore = useCallback(() => {
    setSelectedVersion(null);
  }, []);

  return (
    <div className={'version-history-drawer'} data-testid="version-history-drawer">
      {selectDeletedVersionId && (
        <DeleteVersionModal
          isOpen={!!selectDeletedVersionId}
          versionId={selectDeletedVersionId}
          handleClose={onHandleToggleDeleteVersion}
        />
      )}
      {selectedVersion && (
        <Modal
          open={!!selectedVersion}
          onClose={() => {
            if (!isLoadingReplaceMapVersion) {
              updateJourneyMapVersion(null);
            }
          }}>
          <div className={'version-modal'}>
            <CustomModalHeader title={'Version'} />
            <div className={'version-modal--content'}>
              <p>Are you sure you want to restore "{selectedVersion?.versionName}"</p>
            </div>
            <CustomModalFooterButtons
              handleFirstButtonClick={onHandleCloseConfirmRestore}
              handleSecondButtonClick={onHandleConfirmRestore}
              isLoading={isLoadingReplaceMapVersion}
              secondButtonName={'Yes'}
            />
          </div>
        </Modal>
      )}

      <CustomModalHeader title={'Version history'} />
      <button onClick={onHandleClose} aria-label={'close drawer'} className={'close-drawer'}>
        <span className={'wm-close'} />
      </button>
      <div
        data-testid="versions-list"
        className={'version-history-drawer--body'}
        onScroll={e => {
          onHandleFetch(e, childRef.current?.offsetHeight || 0);
        }}>
        {renderedVersionsData.length ? (
          <ul data-testid="versions-list-ul" ref={childRef}>
            {renderedVersionsData.map(version => (
              <li key={version.id}>
                <VersionCard
                  version={version}
                  onHandleRestoreVersion={onHandleRestoreVersion}
                  onHandleDeleteVersion={onHandleToggleDeleteVersion}
                  onHandleSelectPreliminaryVersion={onHandleSelectPreliminaryVersion}
                />
              </li>
            ))}
          </ul>
        ) : (
          <>
            {versionsIsFetchingNextPage ? (
              <>
                <WuBaseLoader />
              </>
            ) : (
              <EmptyDataInfo message={'There are no versions yet'} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VersionDrawer;
