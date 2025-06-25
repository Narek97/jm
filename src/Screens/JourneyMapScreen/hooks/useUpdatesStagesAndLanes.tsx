import { ActionsEnum } from '@/types/enum.ts';

export const useUpdatesStagesAndLanes = () => {
  const updateStages = (data: any, action: ActionsEnum) => {
    // if (!stagesAndLanes?.stages) return;
    //
    // switch (action) {
    //   case ActionsEnum.ADD_MERGE_ID: {
    //     setLayers(prev => {
    //       return prev?.map(layerItem => {
    //         return {
    //           ...layerItem,
    //           columnIds: [
    //             ...(layerItem.columnIds || []),
    //             ...(layerItem.columnIds?.includes(data.mergePointPrevColumnId)
    //               ? data.mergeSecondPointArray?.map((itm: JourneyMapColumnType) => itm.id)
    //               : []),
    //           ],
    //         };
    //       });
    //     });
    //     const updatedStages = stagesAndLanes.stages.map(item => {
    //       if (item?.id === data?.id) {
    //         return {
    //           ...item,
    //           mergedIds: [
    //             ...(item.mergedIds || []),
    //             ...(item.mergedIds?.includes(data.mergePointPrevColumnId)
    //               ? data.mergeSecondPointArray?.map((itm: JourneyMapColumnType) => itm.id)
    //               : []),
    //           ],
    //         };
    //       }
    //       return item;
    //     });
    //
    //     setStagesAndLanesState({
    //       ...stagesAndLanes,
    //       stages: updatedStages,
    //     });
    //     break;
    //   }
    //
    //   case ActionsEnum.DELETE_MERGE_ID: {
    //     const updatedStages = stagesAndLanes.stages.map(item => {
    //       return {
    //         ...item,
    //         mergedIds: item?.mergedIds?.includes(data.newColumnId)
    //           ? data?.startColumnId
    //             ? item.mergedIds.filter(
    //                 itm => itm !== data.startColumnId && itm !== data.newColumnId,
    //               )
    //             : item.mergedIds.filter(itmData => itmData !== data.newColumnId)
    //           : item.mergedIds,
    //       };
    //     });
    //
    //     setStagesAndLanesState({
    //       ...stagesAndLanes,
    //       stages: updatedStages,
    //     });
    //     break;
    //   }
    //
    //   case ActionsEnum.CREATE: {
    //     const updatedStages = [...stagesAndLanes.stages];
    //     updatedStages.splice(data?.index - 1, 0, { label: data?.label, id: data?.id }); // Insert `data` at the specified `index`
    //
    //     setStagesAndLanesState({
    //       ...stagesAndLanes,
    //       stages: updatedStages,
    //     });
    //     break;
    //   }
    //
    //   case ActionsEnum.UPDATE: {
    //     const { id, ...rest } = data;
    //     const updatedStages: StageAndLaneItemType[] = stagesAndLanes.stages.map(stage =>
    //       stage.id === id ? { ...stage, ...rest } : stage,
    //     );
    //
    //     setStagesAndLanesState({
    //       ...stagesAndLanes,
    //       stages: updatedStages,
    //     });
    //     break;
    //   }
    //
    //   case ActionsEnum.DELETE: {
    //     const { id } = data;
    //     const updatedStages: StageAndLaneItemType[] = stagesAndLanes.stages.filter(
    //       stage => stage.id !== id,
    //     );
    //
    //     setStagesAndLanesState({
    //       ...stagesAndLanes,
    //       stages: updatedStages,
    //     });
    //     break;
    //   }
    //   default:
    //     throw new Error(`Unhandled action type: ${action}`);
    // }
  };

  const updateLanes = (data: any, action: ActionsEnum) => {
    // if (!stagesAndLanes?.lanes) return;
    //
    // switch (action) {
    //   case ActionsEnum.CREATE: {
    //     const updatedLanes = [...stagesAndLanes.lanes];
    //     updatedLanes.splice(data?.index - 1, 0, { label: data?.label, id: data?.id }); // Insert `data` at the specified `index`
    //
    //     setStagesAndLanesState({
    //       ...stagesAndLanes,
    //       lanes: updatedLanes,
    //     });
    //     break;
    //   }
    //
    //   case ActionsEnum.UPDATE: {
    //     const { id, ...rest } = data;
    //     const updatedLanes: StageAndLaneItemType[] = stagesAndLanes.lanes.map(lane =>
    //       lane.id === id ? { ...lane, ...rest } : lane,
    //     );
    //
    //     setStagesAndLanesState({
    //       ...stagesAndLanes,
    //       lanes: updatedLanes,
    //     });
    //     break;
    //   }
    //
    //   case ActionsEnum.DELETE: {
    //     const { id } = data;
    //     const updatedLanes: StageAndLaneItemType[] = stagesAndLanes.lanes.filter(
    //       lane => lane.id !== id,
    //     );
    //
    //     setStagesAndLanesState({
    //       ...stagesAndLanes,
    //       lanes: updatedLanes,
    //     });
    //     break;
    //   }
    //   default:
    //     throw new Error(`Unhandled action type: ${action}`);
    // }
  };

  return { updateStages, updateLanes };
};
