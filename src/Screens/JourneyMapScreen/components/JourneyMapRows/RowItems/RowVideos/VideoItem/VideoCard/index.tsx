import { ChangeEvent, FC, useCallback, useMemo, useState } from 'react';

import './style.scss';

import { Skeleton } from '@mui/material';
import { useLocation } from '@tanstack/react-router';

import { CommentAndNoteModelsEnum, MapCardTypeEnum } from '@/api/types';
import CustomLongMenu from '@/Components/Shared/CustomLongMenu';
import JourneyMapCardNote from '@/Screens/JourneyMapScreen/components/JourneyMapCardNote';
import CommentBtn from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/CardHeader/CommentBtn';
import NoteBtn from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/CardHeader/NoteBtn';
import JourneyMapCardTags from '@/Screens/JourneyMapScreen/components/JourneyMapTagsPopover';
import { JOURNEY_MAP_VIDEO_OPTIONS } from '@/Screens/JourneyMapScreen/constants';
import { BoxType, CommentButtonItemType } from '@/Screens/JourneyMapScreen/types.ts';
import { useNote } from '@/store/note.ts';
import { MenuViewTypeEnum } from '@/types/enum.ts';

interface IVideoCard {
  boxItem: BoxType;
  deleteVideo: (boxElementId: number) => void;
  viewVideo: (imageUrl: string) => void;
  disabled: boolean;
  handleUpdateFile: (e: ChangeEvent<HTMLInputElement>, onFinish: () => void) => void;
  changeActiveMode: (isActive: boolean) => void;
}

const VideoCard: FC<IVideoCard> = ({
  boxItem,
  deleteVideo,
  viewVideo,
  disabled,
  handleUpdateFile,
  changeActiveMode,
}) => {
  const location = useLocation();
  const isGuest = location.pathname.includes('/guest');

  const hasNote = useNote(CommentAndNoteModelsEnum.BoxElement, boxItem.id || 0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenNote, setIsOpenNote] = useState<boolean>(false);

  const boxVideo = boxItem?.boxElements[0];
  const fileExtension = boxVideo?.text?.split('.').pop()?.toLowerCase();
  const isAudioOnly = fileExtension === 'mp3';

  const onHandleToggleNote = useCallback(() => {
    setIsOpenNote(prev => !prev);
  }, []);

  const commentRelatedData: CommentButtonItemType = {
    title: boxItem?.boxTextElement?.text || 'Untitled',
    itemId: boxVideo.id,
    rowId: boxVideo.rowId,
    columnId: boxItem.columnId,
    stepId: boxItem.step?.id || 0,
    type: CommentAndNoteModelsEnum.BoxElement,
  };

  const options = useMemo(() => {
    return JOURNEY_MAP_VIDEO_OPTIONS({
      onHandleOpenViewModal: () => {
        viewVideo(boxVideo?.text || '');
      },
      onHandleFileUpload: (e: ChangeEvent<HTMLInputElement>) => {
        setIsLoading(true);
        handleUpdateFile(e, () => {
          setIsLoading(false);
        });
      },
      onHandleDelete: item => {
        deleteVideo(item?.itemId);
        setIsLoading(true);
      },
    });
  }, [boxVideo?.text, deleteVideo, handleUpdateFile, viewVideo]);

  return (
    <>
      <div key={boxVideo?.id} className={'video-card'} data-testid={'video-card-test-id'}>
        {isOpenNote && (
          <JourneyMapCardNote
            type={CommentAndNoteModelsEnum.BoxElement}
            itemId={boxVideo.id}
            rowId={boxVideo.rowId}
            stepId={boxItem.step?.id || 0}
            onClickAway={onHandleToggleNote}
          />
        )}
        {!isGuest && (
          <div className={'video-card--header'}>
            <div className={'video-card--header--comment'}>
              <CommentBtn commentsCount={boxVideo.commentsCount} item={commentRelatedData} />
            </div>
            <div className={'video-card--header--note'}>
              <NoteBtn hasValue={!!hasNote} handleClick={onHandleToggleNote} />
            </div>
            <div className={'card-header--tag'}>
              <JourneyMapCardTags
                cardType={MapCardTypeEnum.BoxElement}
                itemId={boxVideo.id}
                changeActiveMode={changeActiveMode}
                attachedTagsCount={boxItem.boxTextElement?.tagsCount || 0}
                createTagItemAttrs={{
                  stepId: boxItem.step?.id || 0,
                  columnId: boxItem.columnId!,
                  rowId: boxVideo?.rowId,
                }}
              />
            </div>

            <div className={'video-card--header--menu'}>
              <CustomLongMenu
                type={MenuViewTypeEnum.VERTICAL}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                item={commentRelatedData}
                options={options}
                disabled={disabled}
                sxStyles={{
                  display: 'inline-block',
                  background: 'transparent',
                }}
              />
            </div>
          </div>
        )}

        <>
          {isLoading ? (
            <Skeleton
              sx={{
                borderRadius: 1,
                width: '100%',
                height: '100%',
              }}
              animation="wave"
              variant="rectangular"
            />
          ) : (
            <div className={'video-card--video-block'}>
              <button
                onClick={() => viewVideo(boxVideo?.text || '')}
                aria-label={'play'}
                className={'video-card--play-btn'}>
                <span className={'wm-play-arrow'} />
              </button>
              {isAudioOnly && (
                <div className={'video-card--mp3-block'}>
                  {/*todo icon*/}
                  MP3
                </div>
              )}
              <video width="100%" height={'100%'} className={'video-card--video'}>
                <source src={`${import.meta.env.VITE_AWS_URL}/${boxVideo.text}`} />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </>
      </div>
    </>
  );
};

export default VideoCard;
