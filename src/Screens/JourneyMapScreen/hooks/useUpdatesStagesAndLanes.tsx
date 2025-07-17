import { JourneyMapColumnType } from '../types';

import { useLayerStore } from '@/store/layers.ts';
import { ActionsEnum } from '@/types/enum.ts';

export const useUpdatesStagesAndLanes = () => {
  const { stagesAndLanesForLayer, layers, setStagesAndLanesForLayer, setLayers } = useLayerStore();

  const updateStages = (data: any, action: ActionsEnum) => {
    if (!stagesAndLanesForLayer?.stages) return;

    switch (action) {
      case ActionsEnum.ADD_MERGE_ID: {
        setLayers(
          layers.map(layerItem => {
            return {
              ...layerItem,
              columnIds: [
                ...(layerItem.columnIds || []),
                ...(layerItem.columnIds?.includes(data.mergePointPrevColumnId)
                  ? data.mergeSecondPointArray?.map((itm: JourneyMapColumnType) => itm.id) || []
                  : []),
              ],
            };
          }),
        );
        const updatedStages = stagesAndLanesForLayer.stages.map(item => {
          if (item?.id === data?.id) {
            return {
              ...item,
              mergedIds: [
                ...(item.mergedIds || []),
                ...(item.mergedIds?.includes(data.mergePointPrevColumnId)
                  ? data.mergeSecondPointArray?.map((itm: JourneyMapColumnType) => itm.id) || []
                  : []),
              ],
            };
          }
          return item;
        });

        setStagesAndLanesForLayer({
          ...stagesAndLanesForLayer,
          stages: updatedStages,
        });
        break;
      }

      case ActionsEnum.DELETE_MERGE_ID: {
        const updatedStages = stagesAndLanesForLayer.stages.map(item => {
          return {
            ...item,
            mergedIds: item?.mergedIds?.includes(data.newColumnId)
              ? data?.startColumnId
                ? item.mergedIds.filter(
                    itm => itm !== data.startColumnId && itm !== data.newColumnId,
                  )
                : item.mergedIds.filter(itmData => itmData !== data.newColumnId)
              : item.mergedIds,
          };
        });

        setStagesAndLanesForLayer({
          ...stagesAndLanesForLayer,
          stages: updatedStages,
        });
        break;
      }

      case ActionsEnum.CREATE: {
        const updatedStages = [...stagesAndLanesForLayer.stages];
        updatedStages.splice(data?.index - 1, 0, {
          label: data?.label,
          id: data?.id,
          mergedIds: [],
        });

        setStagesAndLanesForLayer({
          ...stagesAndLanesForLayer,
          stages: updatedStages,
        });
        break;
      }

      case ActionsEnum.UPDATE: {
        const { id, ...rest } = data;
        const updatedStages = stagesAndLanesForLayer.stages.map(stage =>
          stage.id === id ? { ...stage, ...rest } : stage,
        );

        setStagesAndLanesForLayer({
          ...stagesAndLanesForLayer,
          stages: updatedStages,
        });
        break;
      }

      case ActionsEnum.DELETE: {
        const { id } = data;
        const updatedStages = stagesAndLanesForLayer.stages.filter(stage => stage.id !== id);

        setStagesAndLanesForLayer({
          ...stagesAndLanesForLayer,
          stages: updatedStages,
        });
        break;
      }
      default:
        throw new Error(`Unhandled action type: ${action}`);
    }
  };

  const updateLanes = (data: any, action: ActionsEnum) => {
    if (!stagesAndLanesForLayer?.lanes) return;

    switch (action) {
      case ActionsEnum.CREATE: {
        const updatedLanes = [...stagesAndLanesForLayer.lanes];
        updatedLanes.splice(data?.index - 1, 0, { label: data?.label, id: data?.id }); // Insert `data` at the specified `index`

        setStagesAndLanesForLayer({
          ...stagesAndLanesForLayer,
          lanes: updatedLanes,
        });
        break;
      }

      case ActionsEnum.UPDATE: {
        const { id, ...rest } = data;
        const updatedLanes = stagesAndLanesForLayer.lanes.map(lane =>
          lane.id === id ? { ...lane, ...rest } : lane,
        );

        setStagesAndLanesForLayer({
          ...stagesAndLanesForLayer,
          lanes: updatedLanes,
        });
        break;
      }

      case ActionsEnum.DELETE: {
        const { id } = data;
        const updatedLanes = stagesAndLanesForLayer.lanes.filter(lane => lane.id !== id);

        setStagesAndLanesForLayer({
          ...stagesAndLanesForLayer,
          lanes: updatedLanes,
        });
        break;
      }
      default:
        throw new Error(`Unhandled action type: ${action}`);
    }
  };

  return { updateStages, updateLanes };
};
