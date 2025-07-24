import { GetLinkMapsByBoardQuery } from '@/api/infinite-queries/generated/getLinkMapsByBoard.generated.ts';
import { BoxType } from '@/Screens/JourneyMapScreen/types.ts';

type LinkType = BoxType['links'][number];

type LinkFormType = {
  type: string;
  linkedMapId: number | null;
  url: string | null;
  title: string | null;
};

export type LinkMapsByBoardType = GetLinkMapsByBoardQuery['getLinkMapsByBoard']['maps'][number];

export type { LinkType, LinkFormType };
