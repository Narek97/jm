import React, { ChangeEvent, FC, useCallback, useMemo, useState } from 'react';

import './style.scss';

import { usePathname } from 'next/navigation';

import { Skeleton } from '@mui/material';
import { useRecoilValue } from 'recoil';

import CustomLongMenu from '@/components/atoms/custom-long-menu/custom-long-menu';
import CommentBtn from '@/containers/journey-map-container/journey-map-card-comments-drawer/comment-btn';
import JourneyMapCardNote from '@/containers/journey-map-container/journey-map-card-note';
import NoteBtn from '@/containers/journey-map-container/journey-map-note-btn';
import JourneyMapCardTags from '@/containers/journey-map-container/journey-map-tags-popover';
import { CommentAndNoteModelsEnum, MapCardTypeEnum } from '@/gql/types';
import PlayIcon from '@/public/journey-map/play.svg';
import MP3 from '@/public/media/MP3.svg';
import { noteStateFamily } from '@/store/atoms/note.atom';
import { JOURNEY_MAP_VIDEO_OPTIONS } from '@/utils/constants/options';
import { menuViewTypeEnum } from '@/utils/ts/enums/global-enums';
import { CommentButtonItemType } from '@/utils/ts/types/global-types';
import { BoxItemType } from '@/utils/ts/types/journey-map/journey-map-types';

interface IVideoCard {
  rowItem: BoxItemType;
  deleteVideo: (boxElementId: number) => void;
  viewVideo: (imageUrl: string) => void;
  disabled: boolean;
  handleUpdateFile: (e: ChangeEvent<HTMLInputElement>, onFinish: () => void) => void;
  changeActiveMode: (isActive: boolean) => void;
}

const VideoCard: FC<IVideoCard> = ({
  rowItem,
  deleteVideo,
  viewVideo,
  disabled,
  handleUpdateFile,
  changeActiveMode,
}) => {
  const pathname = usePathname();
  const isGuest = pathname.includes('/guest');

  const boxVideo = rowItem?.boxElements[0];

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenNote, setIsOpenNote] = useState<boolean>(false);

  const fileExtension = boxVideo?.text?.split('.').pop()?.toLowerCase();
  const isAudioOnly = fileExtension === 'mp3';

  const noteData = useRecoilValue(
    noteStateFamily({ type: CommentAndNoteModelsEnum.BoxElement, id: boxVideo.id }),
  );
  const hasNote = noteData ? noteData.text.length : boxVideo.note?.text.length;

  const onHandleToggleNote = useCallback(() => {
    setIsOpenNote(prev => !prev);
  }, []);

  const commentRelatedData: CommentButtonItemType = {
    title: rowItem?.boxTextElement?.text || '',
    itemId: boxVideo.id,
    rowId: boxVideo.rowId,
    columnId: rowItem.columnId!,
    stepId: rowItem.step.id,
    type: CommentAndNoteModelsEnum.BoxElement,
  };

  const options = useMemo(() => {
    return JOURNEY_MAP_VIDEO_OPTIONS({
      onHandleOpenViewModal: () => {
        viewVideo(boxVideo?.text);
      },
      onHandleFileUpload: (e: ChangeEvent<HTMLInputElement>) => {
        setIsLoading(true);
        handleUpdateFile(e, () => {
          setIsLoading(false);
        });
      },
      onHandleDelete: item => {
        deleteVideo(item?.itemId!);
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
            stepId={rowItem.step.id}
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
                attachedTagsCount={rowItem.boxTextElement?.tagsCount || 0}
                createTagItemAttrs={{
                  stepId: rowItem.step.id,
                  columnId: rowItem.columnId!,
                  rowId: boxVideo?.rowId,
                }}
              />
            </div>

            <div className={'video-card--header--menu'}>
              <CustomLongMenu
                type={menuViewTypeEnum.VERTICAL}
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
                onClick={() => viewVideo(boxVideo?.text)}
                aria-label={'play'}
                className={'video-card--play-btn'}>
                <PlayIcon />
              </button>
              {isAudioOnly && (
                <div className={'video-card--mp3-block'}>
                  <MP3 />
                </div>
              )}
              <video width="100%" height={'100%'} className={'video-card--video'}>
                <source src={`${process.env.NEXT_PUBLIC_AWS_URL}/${boxVideo.text}`} />
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
