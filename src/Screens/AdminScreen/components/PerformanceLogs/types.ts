import { GetPerformanceLogsQuery } from '@/api/queries/generated/getPerformance.generated.ts';

export type PerformanceLogsType =
  GetPerformanceLogsQuery['getPerformanceLogs']['performanceLogs'][number];
