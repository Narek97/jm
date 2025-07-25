import { FC, memo, useState } from 'react';

import './style.scss';
import MediaViewModal from './MediaViewModal';
import RowFileUploader from '../../../components/RowFileUploader';

import BaseWuLoader from '@/Components/Shared/BaseWuLoader';
import { FILE_TYPE_CONFIG } from '@/Constants';
import UnMergeColumnsButton from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/UnmergeColumnsBtn';
import MediaCard from '@/Screens/JourneyMapScreen/components/JourneyMapRows/RowItems/RowMedias/RowMediaItem/MediaCard';
import useVideoImageMedia from '@/Screens/JourneyMapScreen/hooks/useVideoImageMedia';
import { BoxType, JourneyMapRowType } from '@/Screens/JourneyMapScreen/types.ts';
import { useLayerStore } from '@/Store/layers.ts';
import { FileTypeEnum } from '@/types/enum.ts';

interface IRowMediaItem {
  boxItem: BoxType;
  rowId: number;
  disabled: boolean;
  row: JourneyMapRowType;
  boxIndex: number;
}

const RowMediaItem: FC<IRowMediaItem> = memo(({ boxItem, rowId, disabled, row, boxIndex }) => {
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
    boxItem,
    rowId,
  });
  const { currentLayer } = useLayerStore();

  const isLayerModeOn = !currentLayer?.isBase;

  const [isActiveMode, setIsActiveMode] = useState<boolean>(false);

  return (
    <>
      {isViewModalOpen && (
        <MediaViewModal url={currentUrl} handleClose={closeViewModal} isOpen={isViewModalOpen} />
      )}
      <div
        className={`row-media-item--card-block map-item ${isActiveMode ? 'active-media-card' : ''}`}>
        <div className={`box-controls-container--blank-type`}>
          {boxItem?.boxElements.length ? (
            <MediaCard
              changeActiveMode={isActive => {
                setIsActiveMode(isActive);
              }}
              boxItem={boxItem}
              deleteMedia={deleteItem}
              viewMedia={viewItem}
              disabled={disabled}
              handleUpdateFile={(e, callback) =>
                updateItem(
                  e,
                  {
                    boxElementId: boxItem?.boxElements[0].id,
                    callback,
                    imageId: boxItem?.boxElements[0].id,
                  },
                  FileTypeEnum.MEDIA,
                )
              }
            />
          ) : (
            <>
              {isUploading ? (
                <div className={'row-media-item--card-block--loading'}>
                  <BaseWuLoader />
                </div>
              ) : (
                <>
                  {disabled ? null : (
                    <RowFileUploader
                      boxItem={boxItem}
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
    </>
  );
});

export default RowMediaItem;
