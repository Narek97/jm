import { GetPersonaByIdQuery } from '@/api/queries/generated/getPersonaById.generated.ts';
import { GetPersonaDemographicInfosQuery } from '@/api/queries/generated/getPersonaDemographicInfos.generated.ts';
import { GetPersonaSectionsQuery } from '@/api/queries/generated/getPersonaSections.generated.ts';
import { AttachmentType } from '@/types';

export type PersonaInfoType = GetPersonaByIdQuery['getPersonaById'];

export type DemographicInfosType = GetPersonaDemographicInfosQuery['getPersonaDemographicInfos'];

export type DemographicInfoFieldsType =
  GetPersonaDemographicInfosQuery['getPersonaDemographicInfos']['demographicInfoFields'][number];

export type PersonaFieldSectionsType =
  GetPersonaDemographicInfosQuery['getPersonaDemographicInfos']['personaFieldSections'][number];

export type PersonaImageContainedComponentType = {
  type: 'avatar' | 'personaField' | null;
  itemId: number | null;
  attachment: Pick<AttachmentType, 'url' | 'key' | 'croppedArea'> | null;
};

export type PersonaSectionType = GetPersonaSectionsQuery['getPersonaSections'][number];
