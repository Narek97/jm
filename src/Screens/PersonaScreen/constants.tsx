import { DemographicInfoTypeEnum } from '@/api/types';
import { PersonaDemographicInfoType } from '@/Screens/JourneyMapScreen/types.ts';
import { AttachmentType, MenuOptionsType } from '@/types';
import { PersonaGenderEnum, PersonaTypeEnum } from '@/types/enum';

const PERSONA_TYPE_MENU_ITEMS = [
  {
    id: 1,
    name: 'Customer',
    value: PersonaTypeEnum.Customer,
  },
  { id: 2, name: 'Employee', value: PersonaTypeEnum.Employee },
  { id: 3, name: 'Other', value: PersonaTypeEnum.Others },
];

const PERSONA_GENDER_MENU_ITEMS = [
  {
    id: 1,
    name: PersonaGenderEnum.MALE,
    value: PersonaGenderEnum.MALE,
  },
  { id: 2, name: PersonaGenderEnum.FEMALE, value: PersonaGenderEnum.FEMALE },
];

const DEMOGRAPHIC_INFO_POPOVER: Array<{
  id: number;
  name: string;
  type: DemographicInfoTypeEnum;
}> = [
  { id: 1, name: 'Text field', type: DemographicInfoTypeEnum.Text },
  { id: 2, name: 'Numeric field', type: DemographicInfoTypeEnum.Number },
];

const PERSONA_FIELD_SECTIONS_TYPES: {
  label: string;
  type: DemographicInfoTypeEnum;
}[] = [
  {
    label: 'Image',
    type: DemographicInfoTypeEnum.Image,
  },
  {
    label: 'Text',
    type: DemographicInfoTypeEnum.Content,
  },
];

const PERSONA_DEMOGRAPHIC_INFO_OPTIONS = ({
  onHandleEdit,
  onHandleDelete,
}: {
  onHandleEdit: (persona?: PersonaDemographicInfoType) => void;
  onHandleDelete: (persona?: PersonaDemographicInfoType) => void;
}): Array<MenuOptionsType<PersonaDemographicInfoType>> => {
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

const GALLERY_IMAGE_OPTIONS = ({
  onHandleRename,
  onHandleDelete,
}: {
  onHandleRename: () => void;
  onHandleDelete: (galleryItem?: AttachmentType) => void;
}): Array<MenuOptionsType<AttachmentType>> => {
  return [
    {
      icon: <span className={'wm-edit'} />,
      name: 'Rename',
      onClick: onHandleRename,
    },
    {
      icon: <span className={'wm-delete'} />,
      name: 'Delete',
      onClick: onHandleDelete,
    },
  ];
};

export {
  PERSONA_TYPE_MENU_ITEMS,
  PERSONA_GENDER_MENU_ITEMS,
  DEMOGRAPHIC_INFO_POPOVER,
  PERSONA_FIELD_SECTIONS_TYPES,
  PERSONA_DEMOGRAPHIC_INFO_OPTIONS,
  GALLERY_IMAGE_OPTIONS,
};
