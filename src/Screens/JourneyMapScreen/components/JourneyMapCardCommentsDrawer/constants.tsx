import { MenuOptionsType } from '@/types';

const COMMENT_ITEM_OPTIONS = ({
  onHandleDelete,
  onHandleEdit,
}: {
  onHandleEdit: (data?: any) => void;
  onHandleDelete: (data: any) => void;
  color?: string;
}): Array<MenuOptionsType> => {
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
  ];
};

export { COMMENT_ITEM_OPTIONS };
