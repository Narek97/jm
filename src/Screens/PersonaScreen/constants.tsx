import { DemographicInfoTypeEnum } from '@/api/types';
import { PersonaDemographicInfoType } from '@/Screens/PersonaScreen/types.ts';
import { DropdownSelectItemType, MenuOptionsType } from '@/types';
import { PersonaGenderEnum, PersonaTypeEnum } from '@/types/enum';

const PERSONA_TYPE_MENU_ITEMS: Array<DropdownSelectItemType> = [
  {
    id: 1,
    name: 'Customer',
    value: PersonaTypeEnum.Customer,
  },
  { id: 2, name: 'Employee', value: PersonaTypeEnum.Employee },
  { id: 3, name: 'Other', value: PersonaTypeEnum.Others },
];

const PERSONA_GENDER_MENU_ITEMS: Array<DropdownSelectItemType> = [
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

const PERSONA_GALLERY_IMAGE_OPTIONS = ({
  onHandleRename,
  onHandleDelete,
}: {
  onHandleRename: (galleryItem: PersonaDemographicInfoType) => void;
  onHandleDelete: (galleryItem: PersonaDemographicInfoType) => void;
}): Array<MenuOptionsType> => {
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

const PERSONA_DEMOGRAPHIC_INFO_OPTIONS = ({
  onHandleEdit,
  onHandleDelete,
}: {
  onHandleEdit: (data: PersonaDemographicInfoType) => void;
  onHandleDelete: (data: PersonaDemographicInfoType) => void;
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

export {
  PERSONA_TYPE_MENU_ITEMS,
  PERSONA_GENDER_MENU_ITEMS,
  DEMOGRAPHIC_INFO_POPOVER,
  PERSONA_FIELD_SECTIONS_TYPES,
  PERSONA_GALLERY_IMAGE_OPTIONS,
  PERSONA_DEMOGRAPHIC_INFO_OPTIONS,
};
