import React, { FC, memo, useState } from 'react';

import './style.scss';

import CustomLoader from '@/components/molecules/custom-loader/custom-loader';
import MapRowFileUploader from '@/components/molecules/map-row-file-uploader';
import useVideoImageMedia from '@/containers/journey-map-container/hooks/useVideoImageMedia';
import VideoCard from '@/containers/journey-map-container/journey-map-rows/row-types/row-videos/row-video-item/video-card';
import VideoViewModal from '@/containers/journey-map-container/journey-map-rows/row-types/row-videos/row-video-item/video-view-modal';
import UnMergeColumnsButton from '@/containers/journey-map-container/journey-map-rows/unmerge-columns-btn';
import { FILE_TYPE_CONFIG } from '@/utils/constants/general';
import { FileTypeEnum } from '@/utils/ts/enums/global-enums';
import { BoxItemType, JourneyMapRowType } from '@/utils/ts/types/journey-map/journey-map-types';

interface IRowVideoItem {
  rowItem: BoxItemType;
  rowId: number;
  disabled: boolean;
  row: JourneyMapRowType;
  boxIndex: number;
}

const RowVideoItem: FC<IRowVideoItem> = memo(({ rowItem, rowId, disabled, row, boxIndex }) => {
  const {
    addItem,
    deleteItem,
    updateItem,
    viewItem,
    isUploading,
    isViewModalOpen,
    currentUrl,
    closeViewModal,
  } = useVideoImageMedia({
    rowItem,
    rowId,
  });

  const [isActiveMode, setIsActiveMode] = useState<boolean>(false);

  return (
    <>
      {isViewModalOpen && (
        <VideoViewModal url={currentUrl} handleClose={closeViewModal} isOpen={isViewModalOpen} />
      )}
      <div
        className={`row-video-item--card-block map-item ${isActiveMode ? 'active-video-card' : ''}`}>
        <div className={`box-controls-container--blank-type`}>
          {rowItem?.boxElements.length ? (
            <VideoCard
              changeActiveMode={isActive => {
                setIsActiveMode(isActive);
              }}
              rowItem={rowItem}
              deleteVideo={deleteItem}
              viewVideo={viewItem}
              disabled={disabled}
              handleUpdateFile={(e, callback) =>
                updateItem(
                  e,
                  {
                    boxElementId: rowItem?.boxElements[0].id,
                    callback,
                    imageId: rowItem?.boxElements[0].id,
                  },
                  FileTypeEnum.VIDEO,
                )
              }
            />
          ) : (
            <>
              {isUploading ? (
                <div className={'row-video-item--card-block--loading'}>
                  <CustomLoader />
                </div>
              ) : (
                <>
                  {disabled ? null : (
                    <MapRowFileUploader
                      rowItem={rowItem}
                      index={rowId}
                      addItem={addItem}
                      accept={FILE_TYPE_CONFIG[FileTypeEnum.VIDEO].accept}
                      type={FileTypeEnum.VIDEO}
                    />
                  )}
                </>
              )}
            </>
          )}
          {rowItem.mergeCount > 1 && row?.boxes && (
            <UnMergeColumnsButton
              boxIndex={rowItem.mergeCount - 1 + boxIndex}
              rowId={row?.id}
              rowItem={row.boxes[boxIndex + rowItem.mergeCount - 1]}
              boxes={row?.boxes}
            />
          )}
        </div>
      </div>
    </>
  );
});

export default RowVideoItem;
