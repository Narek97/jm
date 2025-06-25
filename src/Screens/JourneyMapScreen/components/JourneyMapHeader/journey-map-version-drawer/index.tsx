'use client';

import React, { FC, useCallback, useMemo, useRef, useState } from 'react';

import './style.scss';

import { Box, Modal } from '@mui/material';
import dayjs from 'dayjs';
import fromNow from 'dayjs/plugin/relativeTime';
import { useSetRecoilState } from 'recoil';

import CustomLoader from '@/components/molecules/custom-loader/custom-loader';
import ModalFooterButtons from '@/components/molecules/modal-footer-buttons';
import ModalHeader from '@/components/molecules/modal-header';
import EmptyDataInfoTemplate from '@/components/templates/empty-data-info-template';
import DeleteVersionModal from '@/containers/journey-map-container/journey-map-header/journey-map-version-drawer/delete-version-modal';
import VersionCard from '@/containers/journey-map-container/journey-map-header/journey-map-version-drawer/version-card';
import { useInfiniteGetMapVersionsQuery } from '@/gql/infinite-queries/generated/getMapVersions.generated';
import {
  ReplaceMapVersionMutation,
  useReplaceMapVersionMutation,
} from '@/gql/mutations/generated/replaceMapVersion.generated';
import CloseIcon from '@/public/base-icons/close.svg';
import { journeyMapState, journeyMapVersionState } from '@/store/atoms/journeyMap.atom';
import { JOURNEY_MAP_VERSION_LIMIT } from '@/utils/constants/pagination';
import { MapVersionType } from '@/utils/ts/types/journey-map/journey-map-types';

interface IVersionDrawer {
  mapID: number;
  onHandleClose: () => void;
}
dayjs.extend(fromNow);

const VersionDrawer: FC<IVersionDrawer> = ({ mapID, onHandleClose }) => {
  const childRef = useRef<HTMLUListElement>(null);

  const [selectedVersion, setSelectedVersion] = useState<MapVersionType | null>(null);
  const [selectDeletedVersionId, setSelectDeletedVersionId] = useState<number | null>(null);

  const setJourneyMapVersion = useSetRecoilState(journeyMapVersionState);
  const setJourneyMap = useSetRecoilState(journeyMapState);

  const { mutate: mutateReplaceMapVersion, isLoading: isLoadingReplaceMapVersion } =
    useReplaceMapVersionMutation<ReplaceMapVersionMutation, Error>();

  const {
    data: versions,
    isLoading: versionsIsLoading,
    isFetching: versionsIsFetchingNextPage,
    fetchNextPage: versionsFetchNextPage,
  } = useInfiniteGetMapVersionsQuery({
    getMapVersionsInput: {
      mapId: mapID,
      limit: JOURNEY_MAP_VERSION_LIMIT,
      offset: 0,
    },
  });

  const versionsData: Array<MapVersionType> = useMemo(() => {
    if (versions?.pages && versions?.pages[0] !== undefined) {
      return versions.pages.reduce<Array<MapVersionType>>(
        (acc, curr) => [...acc, ...curr.getMapVersions.mapVersions],
        [],
      );
    }
    return [];
  }, [versions?.pages]);

  const onHandleFetch = (e: React.UIEvent<HTMLElement>, childOffsetHeight: number) => {
    const target = e.currentTarget as HTMLDivElement | null;
    if (
      e.target &&
      childOffsetHeight &&
      target &&
      target.offsetHeight + target.scrollTop + 100 >= childOffsetHeight &&
      !versionsIsFetchingNextPage &&
      !versionsIsLoading &&
      versionsData.length < versions?.pages[0].getMapVersions.count!
    ) {
      versionsFetchNextPage({
        pageParam: {
          mapId: mapID,
          paginationInput: {
            limit: JOURNEY_MAP_VERSION_LIMIT,
            offset: versionsData.length,
          },
        },
      }).then();
    }
  };

  const onHandleSelectPreliminaryVersion = useCallback(
    (version: MapVersionType) => {
      setJourneyMapVersion(version);
      onHandleClose();
    },
    [onHandleClose, setJourneyMapVersion],
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
          setJourneyMap(prev => ({
            ...prev,
            title: response.replaceMapVersion.title?.trim() || 'Untitled',
            columns: response.replaceMapVersion.columns || [],
            rows: response.replaceMapVersion.rows as any,
          }));
          setSelectedVersion(null);
          onHandleClose();
        },
      },
    );
  }, [mutateReplaceMapVersion, onHandleClose, selectedVersion, setJourneyMap]);

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
            !isLoadingReplaceMapVersion && setSelectedVersion(null);
          }}>
          <div className={'version-modal'}>
            <ModalHeader title={'Version'} />
            <div className={'version-modal--content'}>
              <p>Are you sure you want to restore "{selectedVersion?.versionName}"</p>
            </div>
            <ModalFooterButtons
              handleFirstButtonClick={onHandleCloseConfirmRestore}
              handleSecondButtonClick={onHandleConfirmRestore}
              isLoading={isLoadingReplaceMapVersion}
              secondButtonName={'Yes'}
            />
          </div>
        </Modal>
      )}

      <ModalHeader title={'Version history'} />
      <button onClick={onHandleClose} aria-label={'close drawer'} className={'close-drawer'}>
        <CloseIcon fill={'#545E6B'} />
      </button>
      <div
        data-testid="versions-list"
        className={'version-history-drawer--body'}
        onScroll={e => {
          onHandleFetch(e, childRef.current?.offsetHeight || 0);
        }}>
        {versionsData.length ? (
          <ul data-testid="versions-list-ul" ref={childRef}>
            {versionsData.map(version => (
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
            {versionsIsLoading ? (
              <>
                <CustomLoader />
              </>
            ) : (
              <EmptyDataInfoTemplate icon={<Box />} message={'There are no versions yet'} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VersionDrawer;
