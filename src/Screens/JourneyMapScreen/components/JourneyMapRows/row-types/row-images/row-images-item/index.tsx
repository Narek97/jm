import React, { FC, memo, useState } from 'react';

import './style.scss';

import { useRecoilValue } from 'recoil';

import CustomLoader from '@/components/molecules/custom-loader/custom-loader';
import MapRowFileUploader from '@/components/molecules/map-row-file-uploader';
import useVideoImageMedia from '@/containers/journey-map-container/hooks/useVideoImageMedia';
import ImageCard from '@/containers/journey-map-container/journey-map-rows/row-types/row-images/row-images-item/image-card';
import UnMergeColumnsButton from '@/containers/journey-map-container/journey-map-rows/unmerge-columns-btn';
import { currentLayerState } from '@/store/atoms/layers.atom';
import { FILE_TYPE_CONFIG } from '@/utils/constants/general';
import { FileTypeEnum } from '@/utils/ts/enums/global-enums';
import { BoxItemType, JourneyMapRowType } from '@/utils/ts/types/journey-map/journey-map-types';

interface IRowImagesItem {
  rowItem: BoxItemType;
  rowId: number;
  disabled: boolean;
  row: JourneyMapRowType;
  boxIndex: number;
}

const RowImagesItem: FC<IRowImagesItem> = memo(({ rowItem, rowId, disabled, row, boxIndex }) => {
  const { deleteItem, addItem, updateItem, isUploading } = useVideoImageMedia({
    rowItem,
    rowId,
  });
  const [isActiveMode, setIsActiveMode] = useState<boolean>(false);

  const currentLayer = useRecoilValue(currentLayerState);
  const isLayerModeOn = !currentLayer?.isBase;

  return (
    <div
      className={`row-images-item--card-block ${isActiveMode ? 'active-image-card' : ''}  map-item`}>
      <div className={`box-controls-container--blank-type`}>
        {rowItem?.boxElements.length ? (
          <ImageCard
            changeActiveMode={isActive => {
              setIsActiveMode(isActive);
            }}
            rowItem={rowItem}
            deleteImage={deleteItem}
            disabled={disabled}
            handleUpdateFile={(e, callback) =>
              updateItem(
                e,
                {
                  boxElementId: rowItem?.boxElements[0].id,
                  callback,
                  imageId: rowItem?.boxElements[0].id,
                },
                FileTypeEnum.IMAGE,
              )
            }
          />
        ) : (
          <>
            {isUploading ? (
              <div className={'row-images-item--card-block--loading'}>
                <CustomLoader />
              </div>
            ) : (
              <>
                {disabled ? null : (
                  <>
                    <MapRowFileUploader
                      rowItem={rowItem}
                      index={rowId}
                      addItem={addItem}
                      accept={FILE_TYPE_CONFIG[FileTypeEnum.IMAGE].accept}
                      type={FileTypeEnum.IMAGE}
                    />
                  </>
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
  );
});

export default RowImagesItem;
