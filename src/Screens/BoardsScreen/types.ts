import { GetMyBoardsQuery } from '@/api/infinite-queries/generated/getBoards.generated.ts';

export type BoardType = GetMyBoardsQuery['getMyBoards']['boards'][number];
