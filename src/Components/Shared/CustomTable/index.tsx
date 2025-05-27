import React, { FC, useRef } from 'react';

import './style.scss';

import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import dayjs from 'dayjs';
import fromNow from 'dayjs/plugin/relativeTime';

import { OrderByEnum } from '@/api/types.ts';
import ErrorBoundary from '@/Features/ErrorBoundary';
import { MenuOptionsType, TableColumnType } from '@/types';

interface ICustomTable {
  isTableHead?: boolean;
  stickyHeader?: boolean;
  columns: Array<TableColumnType> | [];
  rows: Array<any> | [];
  customTableHead?: React.ReactNode;
  type?: string;
  align?: 'right' | 'left' | 'center';
  onClickRow?: (data: any) => void;
  options?: Array<MenuOptionsType>;
  onHandleFetch?: () => void;
  dashedStyle?: boolean;
  sortAscDescByField?: (sortType: OrderByEnum, fieldName: string, id: any) => void;
  processingItemId?: number | null;
  permissionCheckKey?: string;
}

const CustomTable: FC<ICustomTable> = ({
  isTableHead = true,
  stickyHeader = true,
  columns,
  rows,
  align = 'left',
  onClickRow,
  onHandleFetch,
  dashedStyle = true,
  sortAscDescByField,
  options = [],
  processingItemId = null,
  permissionCheckKey,
}) => {
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

  const getStyle = (column: TableColumnType, value: number | string) => {
    let className = '';
    switch (column.id) {
      case 'payloadSize': {
        if (+value <= 1) {
          className = 'green-size';
        }
        if (+value > 1 && +value <= 10) {
          className = 'yellow-size';
        }
        if (+value > 10) {
          className = 'red-size';
        }
        break;
      }
      default: {
        break;
      }
    }
    return className;
  };

  return (
    <div
      className={`custom-table ${dashedStyle ? 'dashed-style' : ''}`}
      onScroll={onHandleFetch && onHandleScroll}
      ref={parentRef}>
      <Table
        data-testid={'table-test-id'}
        stickyHeader={stickyHeader}
        aria-label="sticky table"
        ref={childRef}>
        {isTableHead ? (
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} align={column.align || align} sx={{ ...column.style }}>
                  <div className={'custom-table--header-head'}>
                    <div
                      onClick={() => column.onClick && column.onClick()}
                      className={'custom-table--header-item'}
                      data-testid={'table-header-item-test-id'}>
                      {column.label}
                    </div>
                    {column?.isAscDescSortable && sortAscDescByField && (
                      <div className={'custom-table--header-item-sort'}>
                        <button
                          aria-label={'asc'}
                          data-testid={'asc-sort-id'}
                          className={'asc-button'}
                          onClick={() =>
                            sortAscDescByField(
                              OrderByEnum.Asc,
                              column?.sortFieldName as string,
                              column.id as string,
                            )
                          }>
                          <span className={'wm-arrow-drop-up'} style={{ fontSize: '1.4rem' }} />
                        </button>
                        <button
                          aria-label={'desc'}
                          data-testid={'desc-sort-id'}
                          className={'desc-button'}
                          onClick={() =>
                            sortAscDescByField(
                              OrderByEnum.Desc,
                              column?.sortFieldName as string,
                              column.id as string,
                            )
                          }>
                          <span className={'wm-arrow-drop-down'} style={{ fontSize: '1.4rem' }} />
                        </button>
                      </div>
                    )}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {rows.map(row => (
            <ErrorBoundary key={row.id}>
              <TableRow
                hover
                onClick={() => {
                  if (onClickRow) {
                    onClickRow(row);
                  }
                }}
                data-testid={`table-row-test-id`}
                className={`cursor-pointer ${processingItemId === row?.id ? 'processing-item' : ''}`}
                role="checkbox"
                sx={{
                  height: '2.5rem',
                }}
                key={row.id}>
                {columns.map(column => {
                  const value = row[column.id];
                  const isChecked = row['checked'];

                  return (
                    <TableCell
                      className={'custom-table--td'}
                      key={column.id}
                      align={column.align || align}
                      sx={{
                        backgroundColor: '#ffffff',
                        padding: column.id === 'operation' ? '0' : '0 1rem',
                        fontSize: 12,
                        color: '#545e6b',
                        ...column.style,
                      }}>
                      {column.id === 'operation' &&
                      (!permissionCheckKey || (permissionCheckKey && !row[permissionCheckKey])) ? (
                        <ul className={`${isChecked ? 'hide-operations' : 'operations'}`}>
                          {options?.map((itm, index) => (
                            <li
                              data-testid={`table-${itm.name?.toLowerCase()}-item-test-id`}
                              key={index}
                              onClick={() => itm.onClick && itm.onClick(row)}
                              className={'operations--item'}>
                              {itm?.icon}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className={`custom-table--${column.id} ${getStyle(column, value)}`}>
                          {column?.renderFunction
                            ? column.renderFunction(row)
                            : column.label === 'created date' || column.label === 'updated date'
                              ? dayjs(value).format('DD-MM-YYYY')
                              : value}
                        </span>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            </ErrorBoundary>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomTable;
