import { FC, memo, useEffect, useState, useCallback } from 'react';
import './style.scss';

import { FormControlLabel, Checkbox } from '@mui/material';

import { ActionEnum } from '@/api/types.ts';
import CustomCheckboxIcon from '@/Components/Shared/CustomCheckboxIcon';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import { UNSELECT_ICON } from '@/Screens/JourneyMapScreen/components/JourneyMapHeader/constants.tsx';
import {
  BoardTagType,
  LayerFormType,
} from '@/Screens/JourneyMapScreen/components/JourneyMapHeader/types.ts';

interface IJourneyMapLayersModal {
  mode: ActionEnum;
  defaultCheckedTagIds: number[];
  tags: BoardTagType[];
  setValue: (name: keyof LayerFormType, value: LayerFormType[keyof LayerFormType]) => void;
  updatesCurrentLayer: (data: { tagIds: number[] }) => void;
}

const sxStyles = {
  fontSize: '12px',
  '&:hover svg rect': { stroke: '#1B87E6' },
  '&.Mui-checked:hover svg': { fill: '#1B3380' },
};

const Tags: FC<IJourneyMapLayersModal> = ({
  mode,
  tags,
  updatesCurrentLayer,
  defaultCheckedTagIds,
  setValue,
}) => {
  const [currentCheckedTags, setCurrentCheckedTags] = useState<number[]>(defaultCheckedTagIds);

  const isAllIdsSelected =
    currentCheckedTags.length > 0 && currentCheckedTags.length === tags.length;
  const updateCheckedTags = useCallback(
    (newCheckedTags: number[]) => {
      setCurrentCheckedTags(newCheckedTags);
      setValue('tagIds', newCheckedTags);
      if (mode === ActionEnum.Add) {
        updatesCurrentLayer({ tagIds: newCheckedTags });
      }
    },
    [mode, setValue, updatesCurrentLayer],
  );

  const handleSelectLane = useCallback(
    (id: number, isSelected: boolean) => {
      const newCheckedTags = isSelected
        ? [...currentCheckedTags, id]
        : currentCheckedTags.filter(itm => itm !== id);
      updateCheckedTags(newCheckedTags);
    },
    [currentCheckedTags, updateCheckedTags],
  );

  const handleSelectAllLanes = useCallback(() => {
    const newCheckedTags = isAllIdsSelected ? [] : tags.map(tag => tag.id);
    updateCheckedTags(newCheckedTags);
  }, [isAllIdsSelected, tags, updateCheckedTags]);

  useEffect(() => {
    setCurrentCheckedTags(defaultCheckedTagIds);
  }, [defaultCheckedTagIds]);

  return (
    <div data-testid="tags-rows" className={'rows'}>
      <FormControlLabel
        className="all-tags-option"
        label="Tags"
        sx={{
          color: '#545E6B',
          '& .MuiFormControlLabel-label': {
            fontSize: '12px',
            marginLeft: '16px',
            fontWeight: '500',
          },
        }}
        control={
          <Checkbox
            name={'all-tags'}
            data-testid="all-tags"
            onChange={() => handleSelectAllLanes()}
            icon={
              currentCheckedTags.length > 0 && currentCheckedTags.length < tags.length ? (
                UNSELECT_ICON
              ) : (
                <CustomCheckboxIcon />
              )
            }
            checked={isAllIdsSelected}
          />
        }
      />

      <div className="rows-content">
        {tags?.length ? (
          tags.map(tag => {
            const isChecked = currentCheckedTags.includes(tag.id);
            return (
              <FormControlLabel
                key={tag.id}
                label={tag.name}
                onClick={e => {
                  e.preventDefault();
                  handleSelectLane(tag.id, !isChecked);
                }}
                sx={{
                  color: '#545E6B',
                  '& .MuiFormControlLabel-label': { fontSize: '12px', marginLeft: '16px' },
                }}
                control={
                  <Checkbox icon={<CustomCheckboxIcon />} checked={isChecked} sx={sxStyles} />
                }
              />
            );
          })
        ) : (
          <EmptyDataInfo message={'There are no tags yet'} />
        )}
      </div>
    </div>
  );
};

export default memo(Tags);
