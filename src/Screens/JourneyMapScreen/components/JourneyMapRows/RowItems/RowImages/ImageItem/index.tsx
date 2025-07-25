import { FC, memo, useState } from 'react';

import './style.scss';
import BaseWuLoader from '@/Components/Shared/BaseWuLoader';
import { FILE_TYPE_CONFIG } from '@/Constants';
import RowFileUploader from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/RowFileUploader';
import UnMergeColumnsButton from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/UnmergeColumnsBtn';
import ImageCard from '@/Screens/JourneyMapScreen/components/JourneyMapRows/RowItems/RowImages/ImageItem/ImageCard';
import useVideoImageMedia from '@/Screens/JourneyMapScreen/hooks/useVideoImageMedia.tsx';
import { BoxType, JourneyMapRowType } from '@/Screens/JourneyMapScreen/types.ts';
import { useLayerStore } from '@/Store/layers.ts';
import { FileTypeEnum } from '@/types/enum.ts';

interface IImagesItem {
  boxItem: BoxType;
  rowId: number;
  disabled: boolean;
  row: JourneyMapRowType;
  boxIndex: number;
}

const ImagesItem: FC<IImagesItem> = memo(({ boxItem, rowId, disabled, row, boxIndex }) => {
  const { deleteItem, addItem, updateItem, isUploading } = useVideoImageMedia({
    boxItem,
    rowId,
  });
  const { currentLayer } = useLayerStore();

  const isLayerModeOn = !currentLayer?.isBase;

  const [isActiveMode, setIsActiveMode] = useState<boolean>(false);

  return (
    <div
      className={`row-images-item--card-block ${isActiveMode ? 'active-image-card' : ''}  map-item`}>
      <div className={`box-controls-container--blank-type`}>
        {boxItem?.boxElements.length ? (
          <ImageCard
            changeActiveMode={isActive => {
              setIsActiveMode(isActive);
            }}
            boxItem={boxItem}
            deleteImage={deleteItem}
            disabled={disabled}
            handleUpdateFile={(e, callback) =>
              updateItem(
                e,
                {
                  boxElementId: boxItem?.boxElements[0].id,
                  callback,
                  imageId: boxItem?.boxElements[0].id,
                },
                FileTypeEnum.IMAGE,
              )
            }
          />
        ) : (
          <>
            {isUploading ? (
              <div className={'row-images-item--card-block--loading'}>
                <BaseWuLoader />
              </div>
            ) : (
              <>
                {disabled ? null : (
                  <>
                    <RowFileUploader
                      boxItem={boxItem}
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
        {boxItem.mergeCount > 1 && row?.boxes && !isLayerModeOn && (
          <UnMergeColumnsButton
            boxIndex={boxItem.mergeCount - 1 + boxIndex}
            rowId={row?.id}
            boxItem={row.boxes[boxIndex + boxItem.mergeCount - 1]}
            boxes={row?.boxes}
          />
        )}
      </div>
    </div>
  );
});

export default ImagesItem;
