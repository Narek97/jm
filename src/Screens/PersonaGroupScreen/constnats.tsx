import * as yup from 'yup';

import { AiCardsEnum } from '@/api/types.ts';
import { PersonaType } from '@/Screens/PersonaGroupScreen/types.ts';
import { MenuOptionsType } from '@/types';

const PERSONA_OPTIONS = ({
  onHandleEdit,
  onHandleCopy,
  onHandleDelete,
}: {
  onHandleEdit: () => void;
  onHandleCopy: () => void;
  onHandleDelete: (data: PersonaType) => void;
}): Array<MenuOptionsType> => {
  return [
    {
      icon: <span className={'wm-edit'} />,
      name: 'Edit',
      onClick: onHandleEdit,
    },
    {
      icon: <span className={'wm-content-copy'} />,
      name: 'Copy',
      onClick: onHandleCopy,
    },
    {
      icon: <span className={'wm-delete'} />,
      name: 'Delete',
      onClick: onHandleDelete,
    },
  ];
};

const PERSONA_AI_VALIDATION_SCHEMA = yup
  .object()
  .shape({
    personaInfo: yup
      .string()
      .required('Persona content is required')
      .max(300, 'Content should be at most 300 characters long')
      .min(10, 'Content should be at least 10 characters long'),
    templateCards: yup
      .array()
      .of(yup.mixed<AiCardsEnum>().oneOf(Object.values(AiCardsEnum)).defined())
      .required(),
    needDemographicData: yup.boolean().required(),
  })
  .required();

const AI_CARD_OPTIONS = [
  {
    key: AiCardsEnum.ProfilePicture,
    title: 'Profile Picture',
    description: 'An image or avatar to humanize a persona',
  },
  {
    key: AiCardsEnum.NameWithTagLine,
    title: 'Name with Tag line',
    description: 'Name of persona with a tag line',
  },
  {
    key: AiCardsEnum.Background,
    title: 'Background',
    description: 'Brief story about their background, work and lifestyle',
  },
  {
    key: AiCardsEnum.Needs,
    title: 'Needs',
    description: 'Requirements of the persona',
  },
  {
    key: AiCardsEnum.Expectations,
    title: 'Expectations',
    description: 'Expectations from your product',
  },
  {
    key: AiCardsEnum.Frustrations,
    title: 'Frustrations',
    description: 'Pain points of the persona',
  },
  {
    key: AiCardsEnum.Goals,
    title: 'Goals',
    description: 'Primary objective of the persona',
  },
  {
    key: AiCardsEnum.Challenges,
    title: 'Challenges',
    description: 'Exciting challenges',
  },
  {
    key: AiCardsEnum.Motivations,
    title: 'Motivations',
    description: 'What drives the persona to take the actions',
  },
];

export { PERSONA_OPTIONS, PERSONA_AI_VALIDATION_SCHEMA, AI_CARD_OPTIONS };
