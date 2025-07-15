import { FC, ReactNode } from 'react';

import './style.scss';
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';

import { CommentAndNoteModelsEnum, MapCardTypeEnum } from '@/api/types';
import PersonaImageBox from '@/Components/Feature/PersonaImageBox';
import CustomLongMenu from '@/Components/Shared/CustomLongMenu';
import { CommentButtonItemType } from '@/Screens/JourneyMapScreen/types.ts';
import { useJourneyMapStore } from '@/store/journeyMap.ts';
import { useLayerStore } from '@/store/layers.ts';
import { CroppedAreaType, MenuOptionsType } from '@/types';
import { ImageSizeEnum, MenuViewTypeEnum } from '@/types/enum.ts';

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
        {/*{isShowNote && (*/}
        {/*  <JourneyMapCardNote*/}
        {/*    type={note.type}*/}
        {/*    itemId={note.id}*/}
        {/*    rowId={note.rowId}*/}
        {/*    stepId={note.stepId}*/}
        {/*    onClickAway={note.onClickAway}*/}
        {/*  />*/}
        {/*)}*/}
        {/*<div className={'card-header--tag card-header--tag-cons-pros'}>*/}
        {/*  <JourneyMapCardTags*/}
        {/*    cardType={cardType}*/}
        {/*    itemId={note.id}*/}
        {/*    changeActiveMode={changeActiveMode}*/}
        {/*    attachedTagsCount={attachedTagsCount}*/}
        {/*    createTagItemAttrs={createTagItemAttrs}*/}
        {/*  />*/}
        {/*</div>*/}
        <div className={'card-header--comment'}>
          {/*<CommentBtn commentsCount={comment.count} item={comment.item} />*/}
        </div>
        <div className={'card-header--note'}>
          {/*<NoteBtn hasValue={!!note.hasValue} handleClick={note.onHandleOpenNote} />*/}
        </div>

        <div className={'card-header--menu'}>
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
