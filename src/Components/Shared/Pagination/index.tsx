import React, { FC } from 'react';

import './style.scss';

import Popover from '@mui/material/Popover';

import { ObjectKeysType } from '@/types';

interface IPagination {
  currentPage: number;
  perPage?: number;
  allCount: number;
  changePage: (page: number) => void;
}

const Pagination: FC<IPagination> = ({ currentPage, perPage = 10, allCount, changePage }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const handleChangePage = (page: number) => {
    changePage(page);
    handleClosePopover();
  };

  const handleClickPagination = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleClickArrow = (index: number) => {
    const page = currentPage + index;
    if (page > 0 && page <= Math.ceil(allCount / perPage)) {
      changePage(page);
    }
  };

  const open = !!anchorEl;
  const id = open ? 'simple-popover' : undefined;

  const customStyle: ObjectKeysType = {
    border: '1px solid #1b87e6',
    boxShadow: 'inherit',
  };

  return (
    <div className={'pagination-section'}>
      <div className="pagination-section--selected-pages">
        <button
          aria-label={'left'}
          data-testid="left-arrow-test-id"
          className="pagination-section--selected-pages-arrow-left"
          onClick={() => {
            handleClickArrow(-1);
          }}>
          <span className={'wm-arrow-back-ios-new'} />
        </button>
        <button data-testid="pagination-left-arrow-test-id" onClick={handleClickPagination}>
          <div className={'pagination-section--selected-pages-numbers'}>
            {`${(currentPage - 1) * perPage + 1} - ${
              currentPage * perPage < allCount ? currentPage * perPage : allCount
            }  of ${allCount}`}
          </div>
        </button>
        <button
          data-testid="pagination-right-arrow-test-id"
          aria-label={'right'}
          className="pagination-section--selected-pages-arrow-right"
          onClick={() => handleClickArrow(1)}>
          <span className={'wm-arrow-forward-ios'} />
        </button>
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        PaperProps={{
          sx: customStyle,
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}>
        <div className={'popover-content'} data-testid="pagination-popover-test-id">
          {new Array(Math.floor(allCount / perPage)).fill('').map((_, index) => (
            <button
              key={index}
              className="popover-content-item"
              onClick={() => handleChangePage(index + 1)}>
              {`${(index + 1 - 1) * perPage + 1} - ${(index + 1) * perPage}  of ${allCount}`}{' '}
            </button>
          ))}
          {Math.abs(allCount % perPage) ? (
            <button
              data-testid={'popover-content-item-test-id'}
              className="popover-content-item"
              onClick={() => handleChangePage(Math.ceil(allCount / perPage))}>
              {`${allCount - Math.abs(allCount % perPage) + 1} - ${allCount}  of ${allCount}`}{' '}
            </button>
          ) : null}
        </div>
      </Popover>
    </div>
  );
};

export default Pagination;
