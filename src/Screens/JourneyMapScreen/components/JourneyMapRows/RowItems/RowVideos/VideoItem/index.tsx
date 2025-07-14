import { FC, memo, useState } from 'react';

import './style.scss';
import CustomLoader from '@/Components/Shared/CustomLoader';
import { FILE_TYPE_CONFIG } from '@/constants';
import RowFileUploader from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/RowFileUploader';
import UnMergeColumnsButton from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/UnmergeColumnsBtn';
import VideoCard from '@/Screens/JourneyMapScreen/components/JourneyMapRows/RowItems/RowVideos/VideoItem/VideoCard';
import VideoViewModal from '@/Screens/JourneyMapScreen/components/JourneyMapRows/RowItems/RowVideos/VideoItem/VideoViewModal';
import useVideoImageMedia from '@/Screens/JourneyMapScreen/hooks/useVideoImageMedia.tsx';
import { BoxType, JourneyMapRowType } from '@/Screens/JourneyMapScreen/types.ts';
import { FileTypeEnum } from '@/types/enum.ts';

interface IVideoItem {
  boxItem: BoxType;
  rowId: number;
  disabled: boolean;
  row: JourneyMapRowType;
  boxIndex: number;
}

const VideoItem: FC<IVideoItem> = memo(({ boxItem, rowId, disabled, row, boxIndex }) => {
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

  const [isActiveMode, setIsActiveMode] = useState<boolean>(false);

  return (
    <>
      {isViewModalOpen && (
        <VideoViewModal url={currentUrl} handleClose={closeViewModal} isOpen={isViewModalOpen} />
      )}
      <div
        className={`row-video-item--card-block map-item ${isActiveMode ? 'active-video-card' : ''}`}>
        <div className={`box-controls-container--blank-type`}>
          {boxItem?.boxElements.length ? (
            <VideoCard
              changeActiveMode={isActive => {
                setIsActiveMode(isActive);
              }}
              boxItem={boxItem}
              deleteVideo={deleteItem}
              viewVideo={viewItem}
              disabled={disabled}
              handleUpdateFile={(e, callback) =>
                updateItem(
                  e,
                  {
                    boxElementId: boxItem?.boxElements[0].id,
                    callback,
                    imageId: boxItem?.boxElements[0].id,
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
                    <RowFileUploader
                      boxItem={boxItem}
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
          {boxItem.mergeCount > 1 && row?.boxes && (
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

export default VideoItem;
