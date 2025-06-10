import { GetPersonasQuery } from '@/api/infinite-queries/generated/getPersonas.generated.ts';

export type PersonaType = GetPersonasQuery['getPersonas']['personas'][number];
