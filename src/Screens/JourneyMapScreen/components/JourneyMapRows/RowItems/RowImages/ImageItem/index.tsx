import { FC, memo, useState } from 'react';

import './style.scss';
import CustomLoader from '@/Components/Shared/CustomLoader';
import { FILE_TYPE_CONFIG } from '@/constants';
import RowFileUploader from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/RowFileUploader';
import UnMergeColumnsButton from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/UnmergeColumnsBtn';
import ImageCard from '@/Screens/JourneyMapScreen/components/JourneyMapRows/RowItems/RowImages/ImageItem/ImageCard';
import useVideoImageMedia from '@/Screens/JourneyMapScreen/hooks/useVideoImageMedia.tsx';
import { BoxElementType, JourneyMapRowType } from '@/Screens/JourneyMapScreen/types.ts';
import { useLayerStore } from '@/store/layers.ts';
import { FileTypeEnum } from '@/types/enum.ts';

interface IImagesItem {
  rowItem: BoxElementType;
  rowId: number;
  disabled: boolean;
  row: JourneyMapRowType;
  boxIndex: number;
}

const ImagesItem: FC<IImagesItem> = memo(({ rowItem, rowId, disabled, row, boxIndex }) => {
  const { deleteItem, addItem, updateItem, isUploading } = useVideoImageMedia({
    rowItem,
    rowId,
  });
  const { currentLayer } = useLayerStore();

  const isLayerModeOn = !currentLayer?.isBase;

  const [isActiveMode, setIsActiveMode] = useState<boolean>(false);

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
                    <RowFileUploader
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

export default ImagesItem;
