import React, { FC, useCallback, useMemo, useRef, useState } from 'react';

import './style.scss';

import dayjs from 'dayjs';
import fromNow from 'dayjs/plugin/relativeTime';

import { useInfiniteGetMapVersionsQuery } from '@/api/infinite-queries/generated/getMapVersions.generated.ts';
import {
  ReplaceMapVersionMutation,
  useReplaceMapVersionMutation,
} from '@/api/mutations/generated/replaceMapVersion.generated.ts';
import BaseWuModal from '@/Components/Shared/BaseWuModal';
import BaseWuModalHeader from '@/Components/Shared/BaseWuModalHeader';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import { ModalConfirmButton } from '@/Components/Shared/ModalConfirmButton';
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

const DISABLED_VERSIONS = [
  1223, 1218, 1214, 1207, 1203, 1187, 1186, 1174, 1119, 1114, 1110, 1108, 1100, 1102, 1089, 1077,
  1046, 1045, 1044, 1039, 1037, 1036, 1033, 1011, 1009, 1008, 1007, 1004, 1003, 998, 996, 995, 993,
  994, 992, 990, 986, 985, 984, 983, 982, 896, 891, 886, 876, 875, 866, 865, 863, 860, 858, 857,
  854, 850, 838, 839, 831, 819, 821, 809, 808, 806, 803, 800, 801, 796, 797, 795, 788, 789, 787,
  786, 776, 775, 774, 771, 773, 767, 748, 747, 703, 692, 682, 679, 678, 676, 675, 674, 673, 672,
  667, 635, 631, 628, 629, 630, 623, 621, 615, 612, 613, 611, 608, 609, 606, 607, 605, 599, 598,
  596, 597, 595, 594, 592, 591, 588, 587, 584, 580, 581, 578, 579, 577, 576, 575, 574, 571, 570,
  567, 560, 559, 557, 554, 555, 545, 546, 547, 543, 540, 534, 533, 529, 528, 526, 527, 521, 519,
  520, 515, 513, 511, 512, 499, 492, 488, 489, 487, 479, 477, 476, 474, 470, 465, 466, 464, 463,
  455, 456, 447, 445, 441, 439, 433, 434, 429, 421, 418, 414, 417, 412, 411, 408, 404, 387, 388,
  384, 376, 374, 375, 368, 366, 365, 363, 361, 356, 355, 343, 341, 304, 296, 285, 282, 248, 249,
  239, 224, 215, 217, 207, 206, 205, 192, 186, 181, 180, 178, 179, 166, 167, 161, 160, 152, 145,
  143, 139, 138, 137, 129, 130, 127, 125, 124, 123, 122, 120, 118, 109, 108, 107, 105, 106, 102,
  103, 99, 88, 86, 87, 84, 81, 79, 78, 74, 70, 64, 34, 32, 31, 21, 19, 17, 9, 2, 3,
];

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
        <BaseWuModal
          headerTitle={'Version'}
          isOpen={!!selectedVersion}
          canCloseWithOutsideClick={true}
          handleClose={() => {
            if (!isLoadingReplaceMapVersion) {
              updateJourneyMapVersion(null);
            }
            onHandleCloseConfirmRestore();
          }}
          ModalConfirmButton={
            <ModalConfirmButton
              disabled={isLoadingReplaceMapVersion}
              buttonName={'Yes'}
              onClick={onHandleConfirmRestore}
            />
          }>
          <div>
            <div className={'version-modal--content'}>
              <p>Are you sure you want to restore "{selectedVersion?.versionName}"</p>
            </div>
          </div>
        </BaseWuModal>
      )}

      <BaseWuModalHeader title={'Version history'} />
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
                  isDisabled={DISABLED_VERSIONS.includes(version.id)}
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
