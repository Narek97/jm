import { GetOrgsQuery } from '@/api/queries/generated/getOrgs.generated.ts';

export type OrgType = GetOrgsQuery['getOrgs'][number];
