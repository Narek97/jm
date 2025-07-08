import React, { FC, memo, useState } from 'react';

import './style.scss';

import { useRecoilValue } from 'recoil';

import CustomLoader from '@/components/molecules/custom-loader/custom-loader';
import MapRowFileUploader from '@/components/molecules/map-row-file-uploader';
import useVideoImageMedia from '@/containers/journey-map-container/hooks/useVideoImageMedia';
import MediaCard from '@/containers/journey-map-container/journey-map-rows/row-types/row-medias/row-media-item/media-card';
import MediaViewModal from '@/containers/journey-map-container/journey-map-rows/row-types/row-medias/row-media-item/media-view-modal';
import UnMergeColumnsButton from '@/containers/journey-map-container/journey-map-rows/unmerge-columns-btn';
import { currentLayerState } from '@/store/atoms/layers.atom';
import { FILE_TYPE_CONFIG } from '@/utils/constants/general';
import { FileTypeEnum } from '@/utils/ts/enums/global-enums';
import { BoxItemType, JourneyMapRowType } from '@/utils/ts/types/journey-map/journey-map-types';

interface IRowMediaItem {
  rowItem: BoxItemType;
  rowId: number;
  disabled: boolean;
  row: JourneyMapRowType;
  boxIndex: number;
}

const RowMediaItem: FC<IRowMediaItem> = memo(({ rowItem, rowId, disabled, row, boxIndex }) => {
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
  const currentLayer = useRecoilValue(currentLayerState);
  const isLayerModeOn = !currentLayer?.isBase;

  return (
    <>
      {isViewModalOpen && (
        <MediaViewModal url={currentUrl} handleClose={closeViewModal} isOpen={isViewModalOpen} />
      )}
      <div
        className={`row-media-item--card-block map-item ${isActiveMode ? 'active-media-card' : ''}`}>
        <div className={`box-controls-container--blank-type`}>
          {rowItem?.boxElements.length ? (
            <MediaCard
              changeActiveMode={isActive => {
                setIsActiveMode(isActive);
              }}
              rowItem={rowItem}
              deleteMedia={deleteItem}
              viewMedia={viewItem}
              disabled={disabled}
              handleUpdateFile={(e, callback) =>
                updateItem(
                  e,
                  {
                    boxElementId: rowItem?.boxElements[0].id,
                    callback,
                    imageId: rowItem?.boxElements[0].id,
                  },
                  FileTypeEnum.MEDIA,
                )
              }
            />
          ) : (
            <>
              {isUploading ? (
                <div className={'row-media-item--card-block--loading'}>
                  <CustomLoader />
                </div>
              ) : (
                <>
                  {disabled ? null : (
                    <MapRowFileUploader
                      rowItem={rowItem}
                      index={rowId}
                      addItem={addItem}
                      accept={FILE_TYPE_CONFIG[FileTypeEnum.MEDIA].accept}
                      type={FileTypeEnum.MEDIA}
                    />
                  )}
                </>
              )}
            </>
          )}
          {rowItem.mergeCount > 1 && row?.boxes && !isLayerModeOn && (
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

export default RowMediaItem;
