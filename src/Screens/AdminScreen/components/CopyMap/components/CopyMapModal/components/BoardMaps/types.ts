import { GetJourneysForCopyQuery } from '@/api/infinite-queries/generated/getJourniesForCopy.generated.ts';

export type JourneysForCopyType = GetJourneysForCopyQuery['getMaps']['maps'][number];
