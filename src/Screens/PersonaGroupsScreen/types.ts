import { GetPersonaGroupsWithPersonasQuery } from '@/api/queries/generated/getPersonaGroupsWithPersonas.generated.ts';

export type PersonaGroupType =
  GetPersonaGroupsWithPersonasQuery['getPersonaGroupsWithPersonas']['personaGroups'][number];
