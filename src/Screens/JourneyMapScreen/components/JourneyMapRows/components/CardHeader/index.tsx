import { FC, ReactNode } from 'react';

import './style.scss';
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';

import NoteBtn from './NoteBtn';

import { CommentAndNoteModelsEnum, MapCardTypeEnum } from '@/api/types';
import PersonaImageBox from '@/Components/Feature/PersonaImageBox';
import BaseWuMenu from '@/Components/Shared/BaseWuMenu';
import JourneyMapCardNote from '@/Screens/JourneyMapScreen/components/JourneyMapCardNote';
import CommentBtn from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/CardHeader/CommentBtn';
import JourneyMapCardTags from '@/Screens/JourneyMapScreen/components/JourneyMapTagsPopover';
import { CommentButtonItemType } from '@/Screens/JourneyMapScreen/types.ts';
import { useJourneyMapStore } from '@/Store/journeyMap.ts';
import { useLayerStore } from '@/Store/layers.ts';
import { CroppedAreaType, MenuOptionsType } from '@/types';
import { ImageSizeEnum } from '@/types/enum.ts';

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
    options: Array<MenuOptionsType<any>>;
    disabled?: boolean;
    onCloseFunction?: () => void;
  };
  createTagItemAttrs: { columnId: number; stepId: number; rowId: number };
  headerColor?: string;
  attachedTagsCount?: number;
  isDarkColor?: boolean;
  dragHandleProps: DraggableProvidedDragHandleProps | null;
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
  createTagItemAttrs,
  headerColor = '#f5f7ff',
  attachedTagsCount = 0,
  isDarkColor,
  dragHandleProps,
}) => {
  const { currentLayer } = useLayerStore();
  const { selectedJourneyMapPersona, isDragging } = useJourneyMapStore();

  const isLayerModeOn = !currentLayer?.isBase;

  return (
    <div
      className={`card-header ${isDarkColor ? 'card-header--dark' : 'card-header--light'}`}
      style={{
        backgroundColor: headerColor,
      }}>
      <div className={'card-header--left-block'}>
        <div>
          <button
            className={`${isDragging ? 'card-header--hide-icon' : 'card-header--base-icon'} ${isLayerModeOn ? 'always-show-icon' : ''} `}>
            {icon}
          </button>
          {isLayerModeOn ? (
            <div {...dragHandleProps} />
          ) : (
            <div
              className={`card-header--drag-icon ${isDragging ? 'card-header--show-icon' : ''}`}
              {...dragHandleProps}>
              <span className={'wm-drag-indicator'} />
            </div>
          )}
        </div>

        {isShowPerson && !selectedJourneyMapPersona && (
          <PersonaImageBox
            title={persona.name}
            imageItem={{
              color: persona?.color,
              isSelected: true,
              attachment: {
                id: 0,
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
          <NoteBtn hasValue={note.hasValue || false} handleClick={note.onHandleOpenNote} />
        </div>

        <div className={'card-header--menu'}>
          <BaseWuMenu
            item={menu.item}
            options={menu.options}
            disabled={menu.disabled}
            onCloseFunction={menu.onCloseFunction}
          />
        </div>
      </div>
    </div>
  );
};

export default CardHeader;
