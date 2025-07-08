import React, { ChangeEvent, FC, ReactElement, useCallback, useMemo, useState } from 'react';

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
import CSV_SVG from '@/public/media/CSV.svg';
import DOC_SVG from '@/public/media/DOC.svg';
import DOCX_SVG from '@/public/media/DOCX.svg';
import PDF_SVG from '@/public/media/PDF.svg';
import PPT_SVG from '@/public/media/PPT.svg';
import PPTX_SVG from '@/public/media/PPTX.svg';
import XLS_SVG from '@/public/media/XLS.svg';
import XLSX_SVG from '@/public/media/XLSX.svg';
import { noteStateFamily } from '@/store/atoms/note.atom';
import { JOURNEY_MAP_MEDIA_OPTIONS } from '@/utils/constants/options';
import { getFileType } from '@/utils/helpers/general';
import { menuViewTypeEnum } from '@/utils/ts/enums/global-enums';
import { CommentButtonItemType } from '@/utils/ts/types/global-types';
import { BoxItemType } from '@/utils/ts/types/journey-map/journey-map-types';

interface IMediaCard {
  rowItem: BoxItemType;
  deleteMedia: (boxElementId: number) => void;
  viewMedia: (imageUrl: string) => void;
  disabled: boolean;
  handleUpdateFile: (e: ChangeEvent<HTMLInputElement>, onFinish: () => void) => void;
  changeActiveMode: (isActive: boolean) => void;
}

type FileFormat = 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'csv' | 'ppt' | 'pptx';

const MediaCard: FC<IMediaCard> = ({
  rowItem,
  deleteMedia,
  viewMedia,
  disabled,
  handleUpdateFile,
  changeActiveMode,
}) => {
  const pathname = usePathname();

  const isGuest = pathname.includes('/guest');

  const boxMedia = rowItem.boxElements[0];

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenNote, setIsOpenNote] = useState<boolean>(false);

  const noteData = useRecoilValue(
    noteStateFamily({ type: CommentAndNoteModelsEnum.BoxElement, id: boxMedia.id }),
  );
  const hasNote = noteData ? noteData.text.length : boxMedia.note?.text.length;

  const onHandleToggleNote = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpenNote(prev => !prev);
  }, []);

  const getFileIcon = (format: FileFormat): ReactElement | undefined => {
    const icons: Record<FileFormat, ReactElement> = {
      pdf: <PDF_SVG />,
      doc: <DOC_SVG />,
      docx: <DOCX_SVG />,
      xls: <XLS_SVG />,
      xlsx: <XLSX_SVG />,
      csv: <CSV_SVG />,
      ppt: <PPT_SVG />,
      pptx: <PPTX_SVG />,
    };
    return icons[format];
  };

  const commentRelatedData: CommentButtonItemType = {
    title: rowItem?.boxTextElement?.text || '',
    itemId: boxMedia.id,
    rowId: boxMedia.rowId,
    columnId: rowItem.columnId!,
    stepId: rowItem.step.id,
    type: CommentAndNoteModelsEnum.BoxElement,
  };

  const options = useMemo(() => {
    return JOURNEY_MAP_MEDIA_OPTIONS({
      onHandleOpenViewModal: () => {
        viewMedia(boxMedia?.text);
      },
      onHandleFileUpload: (e: ChangeEvent<HTMLInputElement>) => {
        setIsLoading(true);
        handleUpdateFile(e, () => {
          setIsLoading(false);
        });
      },
      onHandleDelete: item => {
        deleteMedia(item?.itemId!);
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
          viewMedia(boxMedia?.text);
        }}>
        {isOpenNote && (
          <JourneyMapCardNote
            type={CommentAndNoteModelsEnum.BoxElement}
            itemId={boxMedia.id}
            rowId={boxMedia.rowId}
            stepId={rowItem.step.id}
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
                  stepId: rowItem.step.id,
                  columnId: rowItem.columnId!,
                  rowId: boxMedia.rowId,
                }}
              />
            </div>

            <div className={'media-card--header--menu'}>
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
            <div className={'media-card--media-block'} data-testid={'media-card-icon-test-id'}>
              {getFileIcon(getFileType(boxMedia?.text) as FileFormat)}
            </div>
          )}
        </>
      </div>
    </>
  );
};

export default MediaCard;
