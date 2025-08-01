import React, {
  FC,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import './style.scss';
import { useParams } from '@tanstack/react-router';
import { Control } from 'react-hook-form';

import Lanes from './Lanes';
import Stages from './Stages';
import Tags from './Tags';

import {
  GetBoardTagsQuery,
  useGetBoardTagsQuery,
} from '@/api/queries/generated/getBoardTags.generated.ts';
import {
  GetJourneyMapRowsAndColumnsQuery,
  useGetJourneyMapRowsAndColumnsQuery,
} from '@/api/queries/generated/getJourneyMapRowsAndColumns.generated';
import { ActionEnum } from '@/api/types.ts';
import BaseWuLoader from '@/Components/Shared/BaseWuLoader';
import { LayerFormType } from '@/Screens/JourneyMapScreen/components/JourneyMapHeader/types.ts';
import { LayerType } from '@/Screens/JourneyMapScreen/types.ts';
import { useLayerStore } from '@/Store/layers.ts';

interface IJourneyMapLayersModal {
  mode: ActionEnum;
  updatesCurrentLayer: ({
    columnIds,
    rowIds,
    tagIds,
  }: {
    columnIds?: number[];
    rowIds?: number[];
    tagIds?: number[];
  }) => void;
  control: Control<LayerFormType>;
  setValue: (name: keyof LayerFormType, value: LayerFormType[keyof LayerFormType]) => void;
  ref: React.Ref<HTMLDivElement>;
  selectedLayer: LayerType | null;
}

interface StagesComponent extends HTMLInputElement {
  getStagesData: () => any;
  getStepsData: () => any;
  resetStepsData: () => void;
  setLayerData: (data: LayerType) => void;
}

const StagesAndLanes: FC<IJourneyMapLayersModal & { ref: any }> = forwardRef(
  ({ mode, updatesCurrentLayer, setValue, selectedLayer }, ref) => {
    const { boardId, mapId } = useParams({
      from: '/_authenticated/_secondary-sidebar-layout/board/$boardId/journey-map/$mapId/',
    });

    const hasRun = useRef(false);

    const stagesRef = useRef<StagesComponent>(null);
    const stepsData = selectedLayer?.columnSelectedStepIds;
    const defaultSelectedStages = selectedLayer?.columnIds;

    const { stagesAndLanesForLayer, setStagesAndLanesForLayer } = useLayerStore();

    const [currentCheckedLanes, setCurrentCheckedLanes] = useState<number[]>([]);
    const [isReady, setIsReady] = useState<boolean>(false);

    const { data: dataRowsAndColumns, isLoading: isLoadingRowsAndColumns } =
      useGetJourneyMapRowsAndColumnsQuery<GetJourneyMapRowsAndColumnsQuery, Error>(
        {
          getJourneyMapRowsAndColumnsInput: {
            mapId: +mapId,
          },
        },
        {
          enabled: !!mapId,
          staleTime: 5 * 60 * 1000,
        },
      );
    const { isLoading: isLoadingBoardTags, data: dataGetBoardTags } = useGetBoardTagsQuery<
      GetBoardTagsQuery,
      Error
    >({
      getBoardTagsInput: {
        boardId: +boardId,
        search: '',
      },
    });

    useImperativeHandle(ref, () => ({
      getStepsData: () => (stagesRef.current ? stagesRef.current.getStepsData() : null),
      resetStepsData: () => (stagesRef.current ? stagesRef.current.resetStepsData() : null),
      getCurrentSelectedData: () => ({
        columnIds: stagesRef.current ? stagesRef.current.getStagesData() : [],
        rowIds: currentCheckedLanes,
      }),
      setLayerData: handleSetLayerData,
    }));

    const handleSetLayerData = useCallback(
      (data: LayerType) => {
        if (stagesRef.current?.setLayerData) {
          return stagesRef.current.setLayerData(data);
        }
      },
      [], // Correct dependency
    );

    useEffect(() => {
      if (dataRowsAndColumns) {
        const stagesList = dataRowsAndColumns.getJourneyMapRowsAndColumns.columns;
        const lanesList = dataRowsAndColumns.getJourneyMapRowsAndColumns.rows;
        setStagesAndLanesForLayer({
          lanes: lanesList?.slice(1),
          stages: stagesList,
          steps: null,
        });
      }
    }, [dataRowsAndColumns, setStagesAndLanesForLayer]);

    useEffect(() => {
      if (!hasRun.current && isReady && selectedLayer) {
        handleSetLayerData(selectedLayer);
        hasRun.current = true;
      }
    }, [selectedLayer, isReady, handleSetLayerData]);

    useEffect(() => {
      const defaultSelectedLanes = selectedLayer?.rowIds || [];
      setCurrentCheckedLanes(
        selectedLayer?.isBase && stagesAndLanesForLayer?.lanes
          ? stagesAndLanesForLayer?.lanes?.map(lane => lane.id)
          : defaultSelectedLanes,
      );
    }, [
      stagesAndLanesForLayer,
      dataGetBoardTags?.getBoardTags.tags.length,
      selectedLayer?.rowIds,
      selectedLayer?.isBase,
    ]);

    return (
      <div className={'journey-map--layers-modal--content--right-columns-rows'}>
        {isLoadingRowsAndColumns || isLoadingBoardTags ? (
          <BaseWuLoader />
        ) : (
          <>
            <Stages
              mapId={+mapId}
              ref={stagesRef}
              handleUpdateIsComponentRendered={() => {
                setIsReady(true);
              }}
              mode={mode}
              setValue={setValue}
              updatesCurrentLayer={updatesCurrentLayer}
              defaultSelectedStages={defaultSelectedStages || []}
              stepsData={stepsData || []}
            />
            <Lanes
              mode={mode}
              setValue={setValue}
              updatesCurrentLayer={updatesCurrentLayer}
              defaultCheckedTagIds={selectedLayer?.rowIds || []}
            />
            <Tags
              mode={mode}
              setValue={setValue}
              updatesCurrentLayer={updatesCurrentLayer}
              tags={dataGetBoardTags?.getBoardTags?.tags || []}
              defaultCheckedTagIds={selectedLayer?.tagIds || []}
            />
          </>
        )}
      </div>
    );
  },
);

export default StagesAndLanes;
