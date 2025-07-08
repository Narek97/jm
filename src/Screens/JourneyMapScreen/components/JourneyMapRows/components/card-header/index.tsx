import React, { FC, ReactNode } from 'react';

import './style.scss';

import { useRecoilValue } from 'recoil';

import CustomLongMenu from '@/components/atoms/custom-long-menu/custom-long-menu';
import CommentBtn from '@/containers/journey-map-container/journey-map-card-comments-drawer/comment-btn';
import JourneyMapCardNote from '@/containers/journey-map-container/journey-map-card-note';
import JourneyMapCardTags from '@/containers/journey-map-container/journey-map-tags-popover';
import { CommentAndNoteModelsEnum, MapCardTypeEnum } from '@/gql/types';
import DragIcon from '@/public/base-icons/drag-icon.svg';
import { isElementDraggingState } from '@/store/atoms/isElementDragging.atom';
import { selectedJourneyMapPersona } from '@/store/atoms/journeyMap.atom';
import { currentLayerState } from '@/store/atoms/layers.atom';
import { ImageSizeEnum, menuViewTypeEnum } from '@/utils/ts/enums/global-enums';
import {
  CommentButtonItemType,
  CroppedAreaType,
  MenuOptionsType,
} from '@/utils/ts/types/global-types';

import PersonaImageBox from '../../../../components/molecules/persona-image-box';
import NoteBtn from '../../journey-map-note-btn';

interface ICardHeader {
  cardType: MapCardTypeEnum;
  icon: ReactNode;
  isShowPerson: boolean;
  changeActiveMode: (data: boolean) => void;
  persona: {
    name: string;
    url: string;
    key: string;
    color: string;
    croppedArea: CroppedAreaType | null;
  };
  isShowNote: boolean;
  note: {
    id: number;
    type: CommentAndNoteModelsEnum;
    rowId: number;
    stepId: number;
    onHandleOpenNote: () => void;
    onClickAway: () => void;
    hasValue?: boolean;
  };
  comment: {
    count: number;
    item: CommentButtonItemType;
  };
  menu: {
    item: any;
    options: Array<MenuOptionsType>;
    disabled?: boolean;
    onCloseFunction?: () => void;
  };
  createTagItemAttrs: { columnId: number; stepId: number; rowId: number };
  dragHandleProps: any;
  headerColor?: string;
  attachedTagsCount?: number;
  isDarkColor?: boolean;
}

const CardHeader: FC<ICardHeader> = ({
  cardType,
  icon,
  isShowPerson,
  persona,
  changeActiveMode,
  isShowNote,
  note,
  comment,
  menu,
  dragHandleProps,
  createTagItemAttrs,
  headerColor = '#f5f7ff',
  attachedTagsCount = 0,
  isDarkColor,
}) => {
  const isElementDragging = useRecoilValue(isElementDraggingState);
  const currentLayer = useRecoilValue(currentLayerState);
  const isLayerModeOn = (currentLayer && !currentLayer?.isBase) || false;
  const selectedPerson = useRecoilValue(selectedJourneyMapPersona);
  return (
    <div
      className={`card-header ${isDarkColor ? 'card-header--dark' : 'card-header--light'}`}
      style={{
        backgroundColor: headerColor,
      }}>
      <div className={'card-header--left-block'}>
        <div>
          <button
            className={`${isElementDragging ? 'card-header--hide-icon' : 'card-header--base-icon'}     ${isLayerModeOn ? 'always-show-icon' : ''} `}>
            {icon}
          </button>
          {!isLayerModeOn ? (
            <button
              className={`card-header--drag-icon ${
                isElementDragging ? 'card-header--show-icon' : ''
              }`}
              {...dragHandleProps}>
              <DragIcon />
            </button>
          ) : (
            <div {...dragHandleProps} />
          )}
        </div>

        {isShowPerson && !selectedPerson && (
          <PersonaImageBox
            title={persona.name}
            imageItem={{
              color: persona?.color,
              isSelected: true,
              attachment: {
                url: persona.url,
                key: persona.key,
                croppedArea: persona.croppedArea,
              },
            }}
            size={ImageSizeEnum.XSM}
          />
        )}
      </div>
      <div className={'card-header--right-block'}>
        {isShowNote && (
          <JourneyMapCardNote
            type={note.type}
            itemId={note.id}
            rowId={note.rowId}
            stepId={note.stepId}
            onClickAway={note.onClickAway}
          />
        )}
        <div className={'card-header--tag card-header--tag-cons-pros'}>
          <JourneyMapCardTags
            cardType={cardType}
            itemId={note.id}
            changeActiveMode={changeActiveMode}
            attachedTagsCount={attachedTagsCount}
            createTagItemAttrs={createTagItemAttrs}
          />
        </div>
        <div className={'card-header--comment'}>
          <CommentBtn commentsCount={comment.count} item={comment.item} />
        </div>
        <div className={'card-header--note'}>
          <NoteBtn hasValue={!!note.hasValue} handleClick={note.onHandleOpenNote} />
        </div>

        <div className={'card-header--menu'}>
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
            item={menu.item}
            options={menu.options}
            disabled={menu.disabled}
            sxStyles={{
              display: 'inline-block',
              background: 'transparent',
            }}
            onCloseFunction={menu.onCloseFunction}
          />
        </div>
      </div>
    </div>
  );
};

export default CardHeader;
