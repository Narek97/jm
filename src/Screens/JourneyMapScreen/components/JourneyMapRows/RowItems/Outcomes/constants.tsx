import { ChangeEvent } from 'react';

import { MenuOptionsType, NotesAndCommentsDrawerType } from '@/types';

const JOURNEY_MAP_OUTCOME_ITEM_OPTIONS = ({
  onHandleDelete,
  onHandleEdit,
  onHandleChangeBgColor,
  color,
}: {
  onHandleEdit: () => void;
  onHandleDelete: (data?: NotesAndCommentsDrawerType) => void;
  onHandleChangeBgColor: (e: ChangeEvent<HTMLInputElement>) => void;
  color?: string;
}): Array<MenuOptionsType<NotesAndCommentsDrawerType>> => {
  return [
    {
      icon: <span className={'wm-edit'} />,
      name: 'Edit',
      onClick: onHandleEdit,
    },
    {
      icon: <span className={'wm-delete'} />,
      name: 'Delete',
      onClick: onHandleDelete,
    },
    {
      icon: (
        <>
          <label
            htmlFor="outcome-color-picker"
            className={'custom-vertical-menu--menu-item-content-icon'}>
            <span className={'wm-colorize'} />
            <input
              data-testid={'color-picker'}
              type={'color'}
              value={color}
              id={'outcome-color-picker'}
              onChange={onHandleChangeBgColor}
              style={{
                width: 0,
                opacity: 0,
              }}
            />
          </label>
        </>
      ),
      isColorPicker: true,
      name: 'Background',
      label: (
        <label htmlFor="outcome-color-picker" style={{ height: '2rem', lineHeight: '2rem' }}>
          Background
        </label>
      ),
      onClick: () => {},
    },
  ];
};

export { JOURNEY_MAP_OUTCOME_ITEM_OPTIONS };
