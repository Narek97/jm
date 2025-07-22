import { FC, useEffect, useState, useCallback } from 'react';

import { FormControlLabel, Checkbox } from '@mui/material';

import { ActionEnum } from '@/api/types.ts';
import CustomCheckboxIcon from '@/Components/Shared/CustomCheckboxIcon';
import { UNSELECT_ICON } from '@/Screens/JourneyMapScreen/components/JourneyMapHeader/constants.tsx';
import { LayerFormType } from '@/Screens/JourneyMapScreen/components/JourneyMapHeader/types.ts';
import { useLayerStore } from '@/Store/layers.ts';

interface ILanes {
  mode: ActionEnum;
  defaultCheckedTagIds: number[];
  setValue: (name: keyof LayerFormType, value: LayerFormType[keyof LayerFormType]) => void;
  updatesCurrentLayer: (data: { rowIds: number[] }) => void;
}

const sxStyles = {
  fontSize: '12px',
  '&:hover svg rect': { stroke: '#1B87E6' },
  '&.Mui-checked:hover svg': { fill: '#1B3380' },
};

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
      <FormControlLabel
        className={'all-columns-option'}
        label={'Lanes'}
        sx={{
          color: '#545E6B',
          '& .MuiFormControlLabel-label': {
            fontSize: '12px',
            marginLeft: '16px',
            color: '#545E6B',
            fontWeight: '500',
          },
        }}
        control={
          <Checkbox
            name={'all-lanes'}
            data-testid={'all-lanes'}
            onChange={() => handleSelectAllLanes()}
            icon={
              currentCheckedLanes.length > 0 &&
              currentCheckedLanes.length < stagesAndLanesForLayer.lanes.length ? (
                UNSELECT_ICON
              ) : (
                <CustomCheckboxIcon />
              )
            }
            checked={isAllIdsSelected}
            sx={{
              color: '#545E6B',
              '& .MuiFormControlLabel-label': {
                fontSize: '12px',
                marginLeft: '16px',
                fontWeight: '500',
              },
            }}
          />
        }
      />

      <div className="rows-content">
        {stagesAndLanesForLayer.lanes?.map(row => {
          const isChecked = currentCheckedLanes.includes(row.id);
          return (
            <FormControlLabel
              key={row.id}
              name={row.label}
              label={row.label}
              onClick={e => {
                e.preventDefault();
                handleSelectLane(row.id, !isChecked);
              }}
              sx={{
                color: '#545E6B',
                '& .MuiFormControlLabel-label': { fontSize: '12px', marginLeft: '16px' },
              }}
              control={
                <Checkbox
                  data-testid={'row-item-' + row.id}
                  icon={<CustomCheckboxIcon />}
                  checked={isChecked}
                  sx={sxStyles}
                />
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export default Lanes;
