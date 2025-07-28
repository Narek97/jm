import * as yup from 'yup';

import { InterviewType } from '@/Screens/InterviewsScreen/types.ts';
import { MenuOptionsType } from '@/types';

const INTERVIEW_CARD_OPTIONS = ({
  onHandleNavigateToMap,
  onHandleView,
  onHandleDelete,
}: {
  onHandleNavigateToMap: () => void;
  onHandleView: (interview?: InterviewType) => void;
  onHandleDelete: (interview?: InterviewType) => void;
}): Array<MenuOptionsType<InterviewType>> => {
  return [
    {
      icon: <span className={'wm-share-windows'} />,
      name: 'Map',
      onClick: onHandleNavigateToMap,
    },
    {
      icon: <span className={'wm-eye-tracking'} />,
      name: 'View',
      onClick: onHandleView,
    },
    {
      icon: <span className={'wm-delete'} />,
      name: 'Delete',
      onClick: onHandleDelete,
    },
  ];
};

const CREATE_INTERVIEW_VALIDATION_SCHEMA = yup
  .object()
  .shape({
    name: yup.string().required('Name is required'),
    aiJourneyModelId: yup.number().required('Ai  model is required'),
    text: yup.string().required('Transcript is required'),
    boardId: yup.number().required('Board is required'),
  })
  .required();

export { INTERVIEW_CARD_OPTIONS, CREATE_INTERVIEW_VALIDATION_SCHEMA };
