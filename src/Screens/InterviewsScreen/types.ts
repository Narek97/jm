import { GetMyBoardsQuery } from '@/api/infinite-queries/generated/getBoards.generated.ts';
import { GetInterviewsByWorkspaceIdQuery } from '@/api/queries/generated/getInterviewsByWorkspaceIdQuery.generated.ts';

export type InterviewType =
  GetInterviewsByWorkspaceIdQuery['getInterviewsByWorkspaceId']['interviews'][number];

export type InterviewFormType = {
  name: string;
  aiJourneyModelId: number;
  text: string;
  boardId: number;
};

export type BoardsType = GetMyBoardsQuery['getMyBoards']['boards'][number];
