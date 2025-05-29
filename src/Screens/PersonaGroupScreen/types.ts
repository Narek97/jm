import { Personas } from '@/api/types.ts';
import { AttachmentType, CroppedAreaType } from '@/types';

export type PersonaType = Pick<Personas, 'id' | 'name' | 'type' | 'color' | 'journeys'> & {
  croppedArea?: CroppedAreaType | null;
  attachment?: AttachmentType | null;
};
