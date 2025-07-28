import { CommentType } from '@/Screens/JourneyMapScreen/components/JourneyMapCardComments/types.ts';
import { MenuOptionsType } from '@/types';

const COMMENT_ITEM_OPTIONS = ({
  onHandleDelete,
  onHandleEdit,
}: {
  onHandleEdit: (comment?: CommentType) => void;
  onHandleDelete: (comment?: CommentType) => void;
  color?: string;
}): Array<MenuOptionsType<CommentType>> => {
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
