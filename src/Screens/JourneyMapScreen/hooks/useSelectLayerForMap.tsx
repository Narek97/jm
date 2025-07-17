import { useCallback } from 'react';

import { LayerType } from '@/Screens/JourneyMapScreen/types.ts';
import { useJourneyMapStore } from '@/store/journeyMap.ts';
import { useLayerStore } from '@/store/layers.ts';

export const useSelectLayerForMap = () => {
  const { currentLayer, setCurrentLayer } = useLayerStore();
  const { updateJourneyMapRowsCount, updateJourneyMap, journeyMap } = useJourneyMapStore();

  const areArraysEqual = (array1: number[], array2: number[]) => {
    if (!Array.isArray(array1) || !Array.isArray(array2) || array1.length !== array2.length) {
      return false;
    }
    return array1.every((value, index) => value === array2[index]);
  };

  const selectLayerForJourneyMap = useCallback(
    (item: LayerType, isBase: boolean) => {
      let columnIdsEqual = false;
      let rowIdsEqual = false;
      columnIdsEqual = areArraysEqual(currentLayer.columnIds || [], item.columnIds || []);
      rowIdsEqual = areArraysEqual(currentLayer.rowIds || [], item.rowIds || []);
      setCurrentLayer({ ...item, isBase });
      updateJourneyMapRowsCount(0);
      updateJourneyMap({
        rows: isBase || (columnIdsEqual && rowIdsEqual) ? journeyMap.rows : [],
      });
    },
    [
      currentLayer.columnIds,
      currentLayer.rowIds,
      journeyMap.rows,
      setCurrentLayer,
      updateJourneyMap,
      updateJourneyMapRowsCount,
    ],
  );

  return { selectLayerForJourneyMap };
};
