import { FC } from 'react';

import './style.scss';
import { WuButton } from '@npm-questionpro/wick-ui-lib';

import { useJourneyMapStore } from '@/store/journeyMap.ts';

interface IAddRowBoxElementBtn {
  itemsLength: number;
  label: string;
  boxIndex: number;
  handleClick: () => void;
}

const AddRowBoxElementBtn: FC<IAddRowBoxElementBtn> = ({
  itemsLength,
  label,
  boxIndex,
  handleClick,
}) => {
  const { isDragging } = useJourneyMapStore();

  return (
    <div
      className={`${
        itemsLength ? 'add-row-box-element-button' : 'add-row-box-element-first-button'
      } ${isDragging ? 'journey-map--hidden-button' : ''}`}>
      <WuButton
        variant="secondary"
        data-testid={`add-new-box-item-btn-test-id`}
        id={(label || 'btn') + '-btn-' + boxIndex}
        onClick={handleClick}>
        <span className={'wm-add'} />
      </WuButton>
    </div>
  );
};

export default AddRowBoxElementBtn;
