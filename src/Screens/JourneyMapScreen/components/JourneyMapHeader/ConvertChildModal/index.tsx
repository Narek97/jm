import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import './style.scss';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';

import {
  CreateParentMapMutation,
  useCreateParentMapMutation,
} from '@/api/mutations/generated/createParentMap.generated.ts';
import {
  GetParentMapsByBoardIdQuery,
  useGetParentMapsByBoardIdQuery,
} from '@/api/queries/generated/getParentMapsByBoardId.generated.ts';
import { OrderByEnum } from '@/api/types';
import CustomError from '@/Components/Shared/CustomError';
import CustomModal from '@/Components/Shared/CustomModal';
import CustomModalFooterButtons from '@/Components/Shared/CustomModalFooterButtons';
import CustomModalHeader from '@/Components/Shared/CustomModalHeader';
import CustomTable from '@/Components/Shared/CustomTable';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import Pagination from '@/Components/Shared/Pagination';
import WuBaseLoader from '@/Components/Shared/WuBaseLoader';
import { querySlateTime } from '@/constants';
import { JOURNIES_LIMIT } from '@/constants/pagination.ts';
import { useSetQueryDataByKey } from '@/hooks/useQueryKey.ts';
import { PARENT_JOURNEY_MAPS_TABLE_COLUMNS } from '@/Screens/JourneyMapScreen/components/JourneyMapHeader/constants.tsx';
import { useBreadcrumbStore } from '@/store/breadcrumb.ts';

interface IJourneyMapLayers {
  isOpenLayersModal: boolean;
  boardId: number;
  mapId: number;
  closeLayersModal: () => void;
}

const ConvertChildModal: FC<IJourneyMapLayers> = ({
  isOpenLayersModal,
  boardId,
  mapId,
  closeLayersModal,
}) => {
  const { showToast } = useWuShowToast();

  const { breadcrumbs } = useBreadcrumbStore();

  const setMapDetailsData = useSetQueryDataByKey('GetMapDetails', {
    key: 'mapId',
    value: +mapId,
  });

  const [journeysCount, setJourneysCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedParentJourney, setSelectedParentJourney] = useState<{
    id: number;
    title: string;
  } | null>(null);

  const [order, setOrder] = useState<{
    key: string;
    orderBY: OrderByEnum;
  }>({
    key: 'updatedAt',
    orderBY: OrderByEnum.Desc,
  });

  const getParentMapsByBoardIdInputData = {
    boardId: +boardId,
    offset: (currentPage - 1) * JOURNIES_LIMIT,
    limit: JOURNIES_LIMIT,
    order,
  };

  const {
    isLoading: isLoadingGetJourneys,
    isFetching: isFetchingGetJourneys,
    error: errorGetJourneys,
    data: dataGetJourneys,
  } = useGetParentMapsByBoardIdQuery<GetParentMapsByBoardIdQuery, Error>(
    {
      getParentMapByBoardIdInput: getParentMapsByBoardIdInputData,
    },
    {
      staleTime: querySlateTime,
    },
  );
  const { mutate: createParentMap } = useCreateParentMapMutation<Error, CreateParentMapMutation>({
    onError: error => {
      showToast({
        variant: 'error',
        message: error?.message,
      });
    },
  });

  const journeysDataCount = journeysCount
    ? journeysCount
    : dataGetJourneys?.getParentMapsByBoardId.count || 0;

  const onHandleSortTableByField = useCallback(
    (type: OrderByEnum, _: string, id: 'name' | 'createdAt' | 'user') => {
      setOrder({
        key: id,
        orderBY: type,
      });
    },
    [],
  );

  const convertToChildMap = useCallback(() => {
    if (mapId && selectedParentJourney) {
      createParentMap(
        {
          createParentMapInput: { childId: +mapId, parentId: selectedParentJourney.id },
        },
        {
          onSuccess: () => {
            const { id, title } = selectedParentJourney;
            setMapDetailsData((oldData: any) => {
              if (oldData) {
                return {
                  getMapDetails: {
                    ...oldData.getMapDetails,
                    isChildMap: true,
                    parentMap: {
                      id,
                      title,
                    },
                  },
                };
              }
            });
            closeLayersModal();
          },
        },
      );
    }
  }, [closeLayersModal, createParentMap, mapId, selectedParentJourney, setMapDetailsData]);

  const journeysData = useMemo(() => {
    return dataGetJourneys?.getParentMapsByBoardId?.maps.filter(itm => itm?.id !== +mapId) || [];
  }, [dataGetJourneys?.getParentMapsByBoardId?.maps, mapId]);

  const onHandleChangePage = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const onHandleClickRow = useCallback(({ id, title }: { id: number; title: string }) => {
    setSelectedParentJourney({ id, title });
  }, []);

  const columns = useMemo(() => {
    return PARENT_JOURNEY_MAPS_TABLE_COLUMNS({});
  }, []);

  useEffect(() => {
    if (dataGetJourneys) {
      setJourneysCount(dataGetJourneys.getParentMapsByBoardId.count || 0);
    }
  }, [dataGetJourneys]);

  if (errorGetJourneys) {
    return <CustomError error={errorGetJourneys?.message} />;
  }

  return (
    <CustomModal
      isOpen={isOpenLayersModal}
      modalSize={'lg'}
      className={'convert-child-modal'}
      handleClose={closeLayersModal}
      canCloseWithOutsideClick={true}>
      <CustomModalHeader title={'Convert to child map'} />
      <div className={'convert-child-modal--content'}>
        <div className={'convert-child-modal--content--moving-info'}>
          <div className={'convert-child-modal--content--moving-info-title'}>Moving map from</div>
          <div className={'convert-child-modal--content--moving-info-breadcrumb'}>
            {breadcrumbs?.map((b, index) => (
              <div
                key={index}
                className={`${index === breadcrumbs?.length - 1 ? 'convert-child-modal--content--moving-info-breadcrumb--item active-breadcrumb' : 'convert-child-modal--content--moving-info-breadcrumb--item'} `}>
                {b.name}
                {index !== breadcrumbs?.length - 1 && (
                  <span className={'breadcrumb-divider'}>/</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className={'convert-child-modal--content--select-map-text'}>Select parent map</div>
        {journeysDataCount > JOURNIES_LIMIT && (
          <Pagination
            perPage={JOURNIES_LIMIT}
            currentPage={currentPage}
            allCount={journeysDataCount}
            changePage={onHandleChangePage}
          />
        )}

        {(isLoadingGetJourneys || isFetchingGetJourneys) && !journeysData.length ? (
          <WuBaseLoader />
        ) : journeysData?.length ? (
          <div
            style={{
              height: journeysCount > JOURNIES_LIMIT ? 'calc(100% - 9rem)' : 'calc(100% - 9.5rem)',
            }}>
            <CustomTable
              columns={columns}
              onClickRow={onHandleClickRow}
              rows={journeysData || []}
              processingItemId={selectedParentJourney?.id}
              sortAscDescByField={onHandleSortTableByField}
            />
          </div>
        ) : (
          <EmptyDataInfo message={'There are no maps yet'} />
        )}
      </div>
      <CustomModalFooterButtons
        handleSecondButtonClick={convertToChildMap}
        isLoading={false}
        isDisableSecondButton={!selectedParentJourney}
        secondButtonName={'Apply'}
      />
    </CustomModal>
  );
};

export default ConvertChildModal;
