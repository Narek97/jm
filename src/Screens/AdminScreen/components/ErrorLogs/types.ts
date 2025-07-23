import { GetErrorLogsQuery } from '@/api/queries/generated/getErrorLogs.generated.ts';

type ErrorLog = GetErrorLogsQuery['getErrorLogs']['errorLogs'][number];

export type { ErrorLog };
