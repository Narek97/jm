import { useRef } from 'react';

import { IWuTableColumnDef, WuButton, WuDataTable } from '@npm-questionpro/wick-ui-lib';
import dayjs from 'dayjs';
import fromNow from 'dayjs/plugin/relativeTime';

import { SortType } from '@/types';

interface IBaseWuDataTable<T> {
  columns: IWuTableColumnDef<T>[];
  data: T[];
  selectedRows?: T[];
  onHandleRowSelect?: (data: T[]) => void;
  onHandleSort?: (sort: SortType) => void;
  onHandleFetch?: () => void;
  onHandleDelete?: () => void;
  isLoading?: boolean;
}

const BaseWuDataTable = <T,>({
  columns,
  data,
  selectedRows = [],
  onHandleRowSelect,
  onHandleSort,
  onHandleFetch,
  onHandleDelete,
  isLoading,
}: IBaseWuDataTable<T>) => {
  dayjs.extend(fromNow);
  const parentRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLTableElement>(null);

  const onHandleScroll = () => {
    if (
      parentRef.current &&
      childRef.current &&
      parentRef?.current.offsetHeight + parentRef.current.scrollTop + 100 >=
        childRef.current.offsetHeight
    ) {
      if (onHandleFetch) {
        onHandleFetch();
      }
    }
  };

  return (
    <div
      className={'w-full h-full overflow-auto'}
      onScroll={onHandleFetch && onHandleScroll}
      ref={parentRef}>
      <WuDataTable
        HeaderAction={
          <div className="flex w-full gap-2 items-center h-full">
            <span className="text-gray-lead inline-block font-medium">
              {selectedRows?.length} Selected
            </span>
            <WuButton
              Icon={<span className="wm-delete" />}
              className="hover:bg-gray-100"
              size="sm"
              variant="secondary"
              onClick={() => onHandleDelete?.()}>
              Delete
            </WuButton>
          </div>
        }
        data={data}
        columns={columns}
        isLoading={isLoading}
        rowSelection={
          selectedRows && {
            isEnabled: !!onHandleRowSelect,
            selectedRows,
            onRowSelect: data => (onHandleRowSelect ? onHandleRowSelect(data as T[]) : () => {}),
            rowUniqueKey: 'id',
          }
        }
        sorting={{
          enabled: true,
          onSort: onHandleSort || (() => {}),
        }}
      />
    </div>
  );
};

export default BaseWuDataTable;
