import { useCallback, useMemo, useState } from 'react';
import './style.scss';

import { useWuShowToast, WuInput, WuPopover } from '@npm-questionpro/wick-ui-lib';
import dayjs from 'dayjs';

import CustomDatePicker from '@/Components/Shared/CustomDatePicker';
import CustomError from '@/Components/Shared/CustomError';
import CustomTable from '@/Components/Shared/CustomTable';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import Pagination from '@/Components/Shared/Pagination';
import WuBaseLoader from '@/Components/Shared/WuBaseLoader';
import { querySlateTime } from '@/Constants';
import { debounced400 } from '@/Hooks/useDebounce.ts';

interface IPaginatedSearchTableProps<T> {
  queryHook: (
    variables: any,
    options: any,
  ) => {
    data: any;
    isLoading: boolean;
    isRefetching: boolean;
    error?: any;
  };
  buildVariables: (params: {
    limit: number;
    offset: number;
    startDate: Date;
    endDate: Date;
    search: string;
  }) => any;
  extractRows: (data: any) => T[];
  extractCount: (data: any) => number;
  columns: any;
  limit: number;
  label: string;
}

const initialStartDate = new Date(new Date().setDate(new Date().getDate() - 6));

const PaginatedSearchTable = <T,>({
  queryHook,
  buildVariables,
  extractRows,
  extractCount,
  columns,
  limit,
  label,
}: IPaginatedSearchTableProps<T>) => {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(new Date());

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState<string>('');
  const offset = (currentPage - 1) * limit;

  const { showToast } = useWuShowToast();

  const { data, isLoading, isRefetching, error } = queryHook(
    buildVariables({
      limit,
      offset,
      startDate,
      endDate,
      search,
    }),
    {
      staleTime: querySlateTime * 10,
      keepPreviousData: true,
      onError: (error: any) =>
        showToast({
          variant: 'error',
          message: error.message,
        }),
    },
  );

  const count = useMemo(() => extractCount(data), [data, extractCount]);
  const rows = useMemo(() => extractRows(data), [data, extractRows]);

  const onHandleChangePage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  if (error) return <CustomError error={error.message} />;

  return (
    <div className="paginated-search-table">
      <div className="paginated-search-table--top-section">
        <div className="paginated-search-table--top-section--params">
          <WuInput
            placeholder="Search ..."
            variant="outlined"
            min={2}
            maxLength={50}
            iconPosition="right"
            onChange={e => {
              debounced400(() => {
                setSearch(e.target.value);
                setCurrentPage(1);
              });
            }}
          />
          <WuPopover
            Trigger={
              <div className="paginated-search-table--top-section--params--date-picker">
                <div>
                  <span>{dayjs(startDate).format('MM/DD/YYYY')}</span>
                  <span> - </span>
                  <span>{dayjs(endDate).format('MM/DD/YYYY')}</span>
                </div>
                <span className="wm-calendar-today" />
              </div>
            }>
            <div className="paginated-search-table--top-section--params--date-picker-block">
              <CustomDatePicker
                defaultDate={startDate}
                onHandleChangeDate={date => {
                  setStartDate(date);
                  setCurrentPage(1);
                }}
              />
              <CustomDatePicker
                defaultDate={endDate}
                onHandleChangeDate={date => {
                  setEndDate(date);
                  setCurrentPage(1);
                }}
              />
            </div>
          </WuPopover>
        </div>

        {count > 0 && (
          <Pagination
            currentPage={currentPage}
            perPage={limit}
            allCount={count}
            changePage={onHandleChangePage}
          />
        )}
      </div>

      {(isLoading || isRefetching) && !rows.length && <WuBaseLoader />}

      {!isLoading && !isRefetching && !rows.length && (
        <EmptyDataInfo message={`There are no ${label} yet`} />
      )}

      {rows.length > 0 && (
        <div className="paginated-search-table--table-container">
          <CustomTable dashedStyle={false} isTableHead rows={rows} columns={columns} />
        </div>
      )}
    </div>
  );
};

export default PaginatedSearchTable;
