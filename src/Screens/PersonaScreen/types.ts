import { GetPersonaDemographicInfoModel, GetPersonaSectionsModel, Personas } from '@/api/types';
import { AttachmentType, CroppedAreaType } from '@/types';

export type PersonaInfoType = Pick<
  Personas,
  | 'id'
  | 'name'
  | 'type'
  | 'color'
  | 'journeys'
  | 'workspaceId'
  | 'workspaceName'
  | 'personaGroupId'
  | 'personaGroupName'
> & {
  croppedArea?: CroppedAreaType | null;
  attachment?: AttachmentType | null;
};

export type PersonaDemographicInfoType = Pick<
  GetPersonaDemographicInfoModel,
  'id' | 'key' | 'personaId' | 'value' | 'type' | 'height' | 'isPinned' | 'isHidden' | 'isDefault'
> & {
  attachment?: Pick<AttachmentType, 'url' | 'key' | 'croppedArea'> | null;
};

export type PersonaFieldTypes = {
  personaFieldSections: PersonaDemographicInfoType[];
  demographicInfoFields: PersonaDemographicInfoType[];
};

export type PersonaImageContainedComponentType = {
  type: 'avatar' | 'personaField' | null;
  itemId: number | null;
  attachment: Pick<AttachmentType, 'url' | 'key' | 'croppedArea'> | null;
};

export type PersonSectionType = Omit<
  GetPersonaSectionsModel,
  'createdAt' | 'updatedAt' | 'personaId'
> & {
  content?: string | null;
};
