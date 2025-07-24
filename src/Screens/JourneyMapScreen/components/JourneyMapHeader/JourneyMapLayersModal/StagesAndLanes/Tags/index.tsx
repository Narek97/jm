import { FC, memo, useEffect, useState, useCallback } from 'react';
import './style.scss';

import { WuCheckbox } from '@npm-questionpro/wick-ui-lib';

import { ActionEnum } from '@/api/types.ts';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
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
      <div className="select-all-wrapper">
        <WuCheckbox
          label="Tags"
          checked={isAllIdsSelected}
          onChange={() => handleSelectAllLanes()}
          name={'all-tags'}
          data-testid="all-tags"
        />
      </div>
      <div className="rows-content">
        {tags?.length ? (
          tags.map(tag => {
            const isChecked = currentCheckedTags.includes(tag.id);
            return (
              <WuCheckbox
                key={tag.id}
                label={tag.name}
                labelPosition="right"
                checked={isChecked}
                onChange={() => handleSelectLane(tag.id, !isChecked)}
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
