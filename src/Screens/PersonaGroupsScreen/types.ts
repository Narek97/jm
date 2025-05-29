import { PersonaGroup, Personas } from '@/api/types.ts';
import { AttachmentType, CroppedAreaType } from '@/types';

export type PersonaGroupType = Pick<PersonaGroup, 'id' | 'name'> & {
  persona: Array<
    Pick<Personas, 'id' | 'name' | 'type' | 'personaGroupId' | 'color'> & {
      croppedArea?: CroppedAreaType | null;
      attachment?: AttachmentType | null;
    }
  >;
};
