import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { v4 as uuidv4 } from 'uuid';

import { useCreateJourneyMapRowMutation } from '@/api/mutations/generated/createJourneyMapRow.generated.ts';
import { MapRowTypeEnum } from '@/api/types.ts';
import { useUpdatesStagesAndLanes } from '@/Screens/JourneyMapScreen/hooks/useUpdatesStagesAndLanes.tsx';
import { BoxType, JourneyMapRowType, OutcomeGroupType } from '@/Screens/JourneyMapScreen/types.ts';
import { useJourneyMapStore } from '@/Store/journeyMap.ts';
import { useUndoRedoStore } from '@/Store/undoRedo.ts';
import { ObjectKeysType } from '@/types';
import { JourneyMapRowActionEnum } from '@/types/enum.ts';
import { ActionsEnum } from '@/types/enum.ts';

export const useAddNewRow = (onToggleDrawer: () => void) => {
  const { mapId } = useParams({
    from: '/_authenticated/_secondary-sidebar-layout/board/$boardId/journey-map/$mapId/',
  });

  const queryClient = useQueryClient();
  const { updateLanes } = useUpdatesStagesAndLanes();

  const {
    journeyMap,
    mapOutcomeGroups,
    journeyMapRowsCount,
    updateMapOutcomeGroups,
    updateJourneyMap,
    updateJourneyMapRowsCount,
  } = useJourneyMapStore();
  const { undoActions, updateUndoActions, updateRedoActions } = useUndoRedoStore();

  const onHandleUpdateJourneyMap = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['GetJourneyMapRows.infinite'],
    });
    onToggleDrawer();
  };

  const { mutate: createRow, isPending: isLoadingCreateRow } = useCreateJourneyMapRowMutation({
    onSuccess: async response => {
      const newRow: JourneyMapRowType = {
        boxes: response.createJourneyMapRow.boxesWithElements as BoxType[],
        id: response.createJourneyMapRow.row.id,
        isCollapsed: false,
        isLocked: false,
        isPersonaAverageDisabled: false,
        label: response.createJourneyMapRow.row.label,
        outcomeGroup: (response.createJourneyMapRow.row.outcomeGroup as OutcomeGroupType) || null,
        rowFunction: response.createJourneyMapRow.row.rowFunction,
        rowWithPersonas: [],
        size: 1,
      };

      updateRedoActions([]);
      updateUndoActions([
        ...undoActions,
        {
          id: uuidv4(),
          type: JourneyMapRowActionEnum.ROW,
          action: ActionsEnum.DELETE,
          data: {
            index: response.createJourneyMapRow.row.index,
            rowItem: newRow,
          },
        },
      ]);

      updateJourneyMapRowsCount(journeyMapRowsCount + 1);

      // todo check if this is working correctly
      const insertIndex = response.createJourneyMapRow.row.index - 1;
      const newRows = [
        ...journeyMap.rows.slice(0, insertIndex),
        newRow,
        ...journeyMap.rows.slice(insertIndex),
      ];
      updateJourneyMap({
        rows: newRows,
      });

      updateLanes(
        {
          id: response?.createJourneyMapRow?.row?.id,
          index: response?.createJourneyMapRow?.row?.index,
          label: response?.createJourneyMapRow?.row?.label,
        },
        ActionsEnum.CREATE,
      );
      onToggleDrawer();
    },
    onError: async () => {
      await onHandleUpdateJourneyMap();
    },
  });

  const getMapColumnNameByType = useCallback((type: string) => {
    switch (type) {
      case 'list_item': {
        return 'List item';
      }
      default:
        return type;
    }
  }, []);

  const createJourneyMapRow = useCallback(
    (rowIndex: number, type: MapRowTypeEnum, additionalFields?: ObjectKeysType) => {
      const name = getMapColumnNameByType(type?.toLowerCase());
      let label = name.charAt(0)?.toUpperCase() + name.slice(1)?.toLowerCase();
      if (type === MapRowTypeEnum.Outcomes) {
        label = (additionalFields?.label as string) || '';
        updateMapOutcomeGroups(
          mapOutcomeGroups?.filter(itm => {
            return +itm!.id !== additionalFields?.outcomeGroupId;
          }),
        );
      }
      createRow({
        createRowInput: {
          index: rowIndex,
          size: 1,
          mapId: +mapId,
          label,
          rowFunction: type as MapRowTypeEnum,
          ...additionalFields,
        },
      });
    },
    [createRow, getMapColumnNameByType, mapId, mapOutcomeGroups, updateMapOutcomeGroups],
  );

  return { createJourneyMapRow, isLoadingCreateRow };
};
