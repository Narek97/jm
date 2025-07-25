import { FC } from 'react';

import './style.scss';

import { useJourneyMapStore } from '@/Store/journeyMap.ts';

interface ICreateNewRowButton {
  index: number;
}

const CreateNewRowButton: FC<ICreateNewRowButton> = ({ index }) => {
  const { updateCreateNewRow } = useJourneyMapStore();

  return (
    <div
      className={`create-new-row`}
      style={{
        zIndex: index === 0 ? 20 : 21,
      }}>
      <button
        data-testid={'open-actions-drawer'}
        aria-label={'Add'}
        className={`create-new-row--button`}
        onClick={() => updateCreateNewRow(true, index)}>
        <span
          className={'wm-add'}
          style={{
            color: '#1B87E6',
          }}
        />
      </button>
    </div>
  );
};

export default CreateNewRowButton;
