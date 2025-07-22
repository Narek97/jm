import React, { ChangeEvent, FC, ReactElement, useCallback, useMemo, useState } from 'react';

import './style.scss';

import { Skeleton } from '@mui/material';
import { useLocation } from '@tanstack/react-router';

import { CommentAndNoteModelsEnum, MapCardTypeEnum } from '@/api/types';
import CSV_SVG from '@/Assets/public/media/CSV.svg';
import DOC_SVG from '@/Assets/public/media/DOC.svg';
import DOCX_SVG from '@/Assets/public/media/DOCX.svg';
import PDF_SVG from '@/Assets/public/media/PDF.svg';
import PPT_SVG from '@/Assets/public/media/PPT.svg';
import PPTX_SVG from '@/Assets/public/media/PPTX.svg';
import XLS_SVG from '@/Assets/public/media/XLS.svg';
import XLSX_SVG from '@/Assets/public/media/XLSX.svg';
import CustomLongMenu from '@/Components/Shared/CustomLongMenu';
import JourneyMapCardNote from '@/Screens/JourneyMapScreen/components/JourneyMapCardNote';
import CommentBtn from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/CardHeader/CommentBtn';
import NoteBtn from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/CardHeader/NoteBtn';
import JourneyMapCardTags from '@/Screens/JourneyMapScreen/components/JourneyMapTagsPopover';
import { JOURNEY_MAP_MEDIA_OPTIONS } from '@/Screens/JourneyMapScreen/constants';
import { BoxType, CommentButtonItemType } from '@/Screens/JourneyMapScreen/types.ts';
import { useNote } from '@/Store/note.ts';
import { MenuViewTypeEnum } from '@/types/enum.ts';

interface IMediaCard {
  boxItem: BoxType;
  deleteMedia: (boxElementId: number) => void;
  viewMedia: (imageUrl: string) => void;
  disabled: boolean;
  handleUpdateFile: (e: ChangeEvent<HTMLInputElement>, onFinish: () => void) => void;
  changeActiveMode: (isActive: boolean) => void;
}

type FileFormat = 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'csv' | 'ppt' | 'pptx';

const MediaCard: FC<IMediaCard> = ({
  boxItem,
  deleteMedia,
  viewMedia,
  disabled,
  handleUpdateFile,
  changeActiveMode,
}) => {
  const location = useLocation();
  const isGuest = location.pathname.includes('/guest');

  const boxMedia = boxItem.boxElements[0];

  const hasNote = useNote(CommentAndNoteModelsEnum.BoxElement, boxItem.id || 0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenNote, setIsOpenNote] = useState<boolean>(false);

  const onHandleToggleNote = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpenNote(prev => !prev);
  }, []);

  const getFileType = (url: string) => {
    return url.split('.').pop()?.toLowerCase();
  };

  const getFileIcon = (format: FileFormat): ReactElement | undefined => {
    const icons: Record<FileFormat, ReactElement> = {
      pdf: <img src={PDF_SVG} alt="PDF_SVG" />,
      doc: <img src={DOC_SVG} alt="DOC_SVG" />,
      docx: <img src={DOCX_SVG} alt="DOCX_SVG" />,
      xls: <img src={XLS_SVG} alt="XLS_SVG" />,
      xlsx: <img src={XLSX_SVG} alt="XLSX_SVG" />,
      csv: <img src={CSV_SVG} alt="CSV_SVG" />,
      ppt: <img src={PPT_SVG} alt="PPT_SVG" />,
      pptx: <img src={PPTX_SVG} alt="PPTX_SVG" />,
    };
    return icons[format];
  };

  const commentRelatedData: CommentButtonItemType = {
    title: boxItem?.boxTextElement?.text || '',
    itemId: boxMedia.id,
    rowId: boxMedia.rowId,
    columnId: boxItem.columnId,
    stepId: boxItem.step?.id || 0,
    type: CommentAndNoteModelsEnum.BoxElement,
  };

  const options = useMemo(() => {
    return JOURNEY_MAP_MEDIA_OPTIONS({
      onHandleOpenViewModal: () => {
        viewMedia(boxMedia?.text || '');
      },
      onHandleFileUpload: (e: ChangeEvent<HTMLInputElement>) => {
        setIsLoading(true);
        handleUpdateFile(e, () => {
          setIsLoading(false);
        });
      },
      onHandleDelete: item => {
        deleteMedia(item?.itemId);
        setIsLoading(true);
      },
    });
  }, [boxMedia?.text, deleteMedia, handleUpdateFile, viewMedia]);

  return (
    <>
      <div
        key={boxMedia?.id}
        className={'media-card'}
        data-testid={'media-card-test-id'}
        onClick={() => {
          viewMedia(boxMedia?.text || '');
        }}>
        {isOpenNote && (
          <JourneyMapCardNote
            type={CommentAndNoteModelsEnum.BoxElement}
            itemId={boxMedia.id}
            rowId={boxMedia.rowId}
            stepId={boxItem.step?.id || 0}
            onClickAway={onHandleToggleNote}
          />
        )}
        {!isGuest && (
          <div className={'media-card--header'}>
            <div className={'media-card--header--comment'}>
              <CommentBtn commentsCount={boxMedia.commentsCount} item={commentRelatedData} />
            </div>
            <div className={'media-card--header--note'}>
              <NoteBtn hasValue={!!hasNote} handleClick={onHandleToggleNote} />
            </div>
            <div className={'card-header--tag'}>
              <JourneyMapCardTags
                cardType={MapCardTypeEnum.BoxElement}
                itemId={boxMedia.id}
                changeActiveMode={changeActiveMode}
                attachedTagsCount={boxMedia.tagsCount || 0}
                createTagItemAttrs={{
                  stepId: boxItem.step?.id || 0,
                  columnId: boxItem.columnId,
                  rowId: boxMedia.rowId,
                }}
              />
            </div>

            <div className={'media-card--header--menu'}>
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
            <div className={'media-card--media-block'} data-testid={'media-card-icon-test-id'}>
              {getFileIcon(getFileType(boxMedia?.text || '') as FileFormat)}
            </div>
          )}
        </>
      </div>
    </>
  );
};

export default MediaCard;
