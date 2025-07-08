import { ChangeEvent, FC, useCallback, useMemo, useState } from 'react';

import './style.scss';

import { Skeleton } from '@mui/material';
import { useLocation } from '@tanstack/react-router';

import { CommentAndNoteModelsEnum } from '@/api/types';
import CustomLongMenu from '@/Components/Shared/CustomLongMenu';
import { JOURNEY_MAP_VIDEO_OPTIONS } from '@/Screens/JourneyMapScreen/constants';
import { useCrudMapBoxElement } from '@/Screens/JourneyMapScreen/hooks/useCRUDMapBoxElement.tsx';
import { BoxElementType } from '@/Screens/JourneyMapScreen/types.ts';
import { MenuViewTypeEnum } from '@/types/enum.ts';

interface IVideoCard {
  rowItem: BoxElementType;
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
  const location = useLocation();
  const isGuest = location.pathname.includes('/guest');

  const { crudBoxElement } = useCrudMapBoxElement();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenNote, setIsOpenNote] = useState<boolean>(false);

  const boxVideo = rowItem?.boxElements[0];
  const fileExtension = boxVideo?.text?.split('.').pop()?.toLowerCase();
  const isAudioOnly = fileExtension === 'mp3';

  // todo
  // const noteData = useRecoilValue(
  //   noteStateFamily({ type: CommentAndNoteModelsEnum.BoxElement, id: boxVideo.id }),
  // );
  // const hasNote = noteData ? noteData.text.length : boxVideo.note?.text.length;

  const hasNote = false;

  const onHandleToggleNote = useCallback(() => {
    setIsOpenNote(prev => !prev);
  }, []);

  const commentRelatedData: CommentButtonItemType = {
    title: rowItem?.boxTextElement?.text || '',
    itemId: boxVideo.id,
    rowId: boxVideo.rowId,
    columnId: rowItem.columnId!,
    stepId: rowItem.step?.id,
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
        {/*{isOpenNote && (*/}
        {/*  <JourneyMapCardNote*/}
        {/*    type={CommentAndNoteModelsEnum.BoxElement}*/}
        {/*    itemId={boxVideo.id}*/}
        {/*    rowId={boxVideo.rowId}*/}
        {/*    stepId={rowItem.step.id}*/}
        {/*    onClickAway={onHandleToggleNote}*/}
        {/*  />*/}
        {/*)}*/}
        {!isGuest && (
          <div className={'video-card--header'}>
            <div className={'video-card--header--comment'}>
              {/*<CommentBtn commentsCount={boxVideo.commentsCount} item={commentRelatedData} />*/}
            </div>
            <div className={'video-card--header--note'}>
              {/*<NoteBtn hasValue={!!hasNote} handleClick={onHandleToggleNote} />*/}
            </div>
            <div className={'card-header--tag'}>
              {/*<JourneyMapCardTags*/}
              {/*  cardType={MapCardTypeEnum.BoxElement}*/}
              {/*  itemId={boxVideo.id}*/}
              {/*  changeActiveMode={changeActiveMode}*/}
              {/*  attachedTagsCount={rowItem.boxTextElement?.tagsCount || 0}*/}
              {/*  createTagItemAttrs={{*/}
              {/*    stepId: rowItem.step.id,*/}
              {/*    columnId: rowItem.columnId!,*/}
              {/*    rowId: boxVideo?.rowId,*/}
              {/*  }}*/}
              {/*/>*/}
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
