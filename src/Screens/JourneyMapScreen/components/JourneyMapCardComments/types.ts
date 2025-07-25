import { GetItemCommentsQuery } from '@/api/infinite-queries/generated/getComments.generated.ts';

export type CommentType = GetItemCommentsQuery['getItemComments']['comments'][number];
