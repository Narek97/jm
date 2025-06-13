import { GetJourneysQuery } from '@/api/queries/generated/getJourneys.generated.ts';

export type JourneyType = GetJourneysQuery['getMaps']['maps'][number] & {
  checked?: boolean;
};

export type JourneyChildType = GetJourneysQuery['getMaps']['maps'][number]['childMaps'][number];

export type JourneyMapNameChangeType = {
  newValue: string;
  mapId: number;
};
