import { FC, useEffect, useState, useCallback } from 'react';

import { WuCheckbox } from '@npm-questionpro/wick-ui-lib';

import { ActionEnum } from '@/api/types.ts';
import { LayerFormType } from '@/Screens/JourneyMapScreen/components/JourneyMapHeader/types.ts';
import { useLayerStore } from '@/Store/layers.ts';

interface ILanes {
  mode: ActionEnum;
  defaultCheckedTagIds: number[];
  setValue: (name: keyof LayerFormType, value: LayerFormType[keyof LayerFormType]) => void;
  updatesCurrentLayer: (data: { rowIds: number[] }) => void;
}

const Lanes: FC<ILanes> = ({ mode, updatesCurrentLayer, defaultCheckedTagIds, setValue }) => {
  const { stagesAndLanesForLayer } = useLayerStore();

  const [currentCheckedLanes, setCurrentCheckedLanes] = useState<number[]>(defaultCheckedTagIds);

  const isAllIdsSelected =
    currentCheckedLanes.length > 0 &&
    currentCheckedLanes.length === stagesAndLanesForLayer.lanes.length;

  const updateCheckedLanes = useCallback(
    (newCheckedLanes: number[]) => {
      setCurrentCheckedLanes(newCheckedLanes);
      setValue('rowIds', newCheckedLanes);
      if (mode === ActionEnum.Add) {
        updatesCurrentLayer({ rowIds: newCheckedLanes });
      }
    },
    [mode, setValue, updatesCurrentLayer],
  );

  const handleSelectLane = useCallback(
    (id: number, isSelected: boolean) => {
      const newCheckedLanes = isSelected
        ? [...currentCheckedLanes, id]
        : currentCheckedLanes.filter(itm => itm !== id);
      updateCheckedLanes(newCheckedLanes);
    },
    [currentCheckedLanes, updateCheckedLanes],
  );

  const handleSelectAllLanes = useCallback(() => {
    const newCheckedLanes = isAllIdsSelected
      ? []
      : stagesAndLanesForLayer.lanes.map(lane => lane.id);
    updateCheckedLanes(newCheckedLanes);
  }, [isAllIdsSelected, stagesAndLanesForLayer.lanes, updateCheckedLanes]);

  useEffect(() => {
    setCurrentCheckedLanes(defaultCheckedTagIds);
  }, [defaultCheckedTagIds]);

  return (
    <div data-testid={'lane-rows'} className={'rows'}>
      <div className="select-all-wrapper">
        <WuCheckbox
          label="Lanes"
          checked={isAllIdsSelected}
          onChange={() => handleSelectAllLanes()}
          name={'all-lanes'}
          data-testid={'all-lanes'}
        />
      </div>

      <div className="rows-content">
        {stagesAndLanesForLayer.lanes?.map(row => {
          const isChecked = currentCheckedLanes.includes(row.id);
          return (
            <WuCheckbox
              key={row.id}
              label={row.label}
              labelPosition="right"
              checked={isChecked}
              onChange={() => handleSelectLane(row.id, !isChecked)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Lanes;
