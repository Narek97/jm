import { ChangeEvent, FC, memo, useCallback, useEffect, useMemo, useState } from 'react';

import './style.scss';

import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { useLocation } from '@tanstack/react-router';
import { v4 as uuidv4 } from 'uuid';

import { LINK_ITEM_OPTIONS } from '../constants';
import { LinkType } from '../types';

import {
  DeleteMapLinkMutation,
  useDeleteMapLinkMutation,
} from '@/api/mutations/generated/deleteLink.generated';
import {
  UpdateLinkBgColorMutation,
  useUpdateLinkBgColorMutation,
} from '@/api/mutations/generated/updateLinkBGColor.generated.ts';
import { CommentAndNoteModelsEnum, MapCardTypeEnum } from '@/api/types.ts';
import LinkIcon from '@/Assets/public/mapRow/link.svg';
import { TOKEN_NAME } from '@/Constants';
import { debounced1 } from '@/Hooks/useDebounce.ts';
import CardHeader from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/CardHeader';
import { onHandleChangeFlipCardIconColor } from '@/Screens/JourneyMapScreen/helpers/onHandleChangeFlipCardIconColor.ts';
import { BoxType } from '@/Screens/JourneyMapScreen/types.ts';
import { useNote } from '@/Store/note.ts';
import { useUndoRedoStore } from '@/Store/undoRedo.ts';
import { ActionsEnum, JourneyMapRowActionEnum, JourneyMapRowTypesEnum } from '@/types/enum';
import { getCookie } from '@/utils/cookieHelper.ts';
import { getIsDarkColor } from '@/utils/getIsDarkColor';
import { lightenColor } from '@/utils/lightenColor';

interface ILinkCard {
  link: LinkType;
  boardId: number;
  disabled: boolean;
  boxItem: BoxType;
  onHandleToggleCreateUpdateModal: (stepId?: number, link?: LinkType) => void;
  onHandleUpdateMapByType: (
    type: JourneyMapRowActionEnum | JourneyMapRowTypesEnum,
    action: ActionsEnum,
    data: any,
  ) => void;
  dragHandleProps: DraggableProvidedDragHandleProps | null;
}

const LinkCard: FC<ILinkCard> = memo(
  ({
    link,
    boardId,
    disabled,
    boxItem,
    onHandleToggleCreateUpdateModal,
    onHandleUpdateMapByType,
    dragHandleProps,
  }) => {
    const location = useLocation();
    const isGuest = location.pathname.includes('/guest');

    const { showToast } = useWuShowToast();

    const token = getCookie(TOKEN_NAME);

    const { undoActions, updateUndoActions, updateRedoActions } = useUndoRedoStore();
    const hasNote = useNote(CommentAndNoteModelsEnum.Links, link.id);

    const [isOpenNote, setIsOpenNote] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [cardInitialBgColor, setCardInitialBgColor] = useState<string>('');
    const [cardBgColor, setCardBgColor] = useState<string | null>(null);
    const [isActiveMode, setIsActiveMode] = useState<boolean>(false);

    const lightenBackgroundColor = cardBgColor ? lightenColor(cardBgColor, 12) : '#f5f7ff';
    const isDarkColor = getIsDarkColor(cardBgColor || '#e3e9fa');
    const color = isDarkColor ? '#ffffff' : '#545e6b';

    const { mutate: mutateDeleteLink } = useDeleteMapLinkMutation<Error, DeleteMapLinkMutation>({
      onSuccess: () => {
        const data = {
          ...link,
          stepId: boxItem.step?.id,
        };

        onHandleUpdateMapByType(JourneyMapRowTypesEnum.LINKS, ActionsEnum.DELETE, data);
        updateRedoActions([]);
        updateUndoActions([
          ...undoActions,
          {
            id: uuidv4(),
            type: JourneyMapRowTypesEnum.LINKS,
            action: ActionsEnum.CREATE,
            data,
          },
        ]);
      },
      onError: error => {
        showToast({
          variant: 'error',
          message: error?.message,
        });
      },
    });

    const { mutate: mutateUpdateLink } = useUpdateLinkBgColorMutation<
      Error,
      UpdateLinkBgColorMutation
    >({
      onSuccess: () => {
        const data = {
          ...link,
          bgColor: cardBgColor,
          previousBgColor: link.bgColor,
          stepId: boxItem.step?.id,
        };

        onHandleUpdateMapByType(JourneyMapRowTypesEnum.LINKS, ActionsEnum['COLOR-CHANGE'], data);
        updateRedoActions([]);
        updateUndoActions([
          ...undoActions,
          {
            id: uuidv4(),
            type: JourneyMapRowTypesEnum.LINKS,
            action: ActionsEnum['COLOR-CHANGE'],
            data,
          },
        ]);
      },
    });

    const getLinkHref = () => {
      let url = `${import.meta.env.VITE_APP_URL}/graphql/board/${boardId}/journey-map/${link.linkedMapId}`;
      if (!token) {
        url += '/guest';
      }
      return url;
    };

    const onHandleUpdateLink = useCallback(() => {
      if (link.bgColor !== cardBgColor) {
        mutateUpdateLink({ updateLinkBGColor: { linkId: link.id, bgColor: cardBgColor! } });
      }
    }, [cardBgColor, link.bgColor, link.id, mutateUpdateLink]);

    const onHandleEdit = useCallback(() => {
      onHandleToggleCreateUpdateModal(boxItem.step?.id, link);
    }, [link, onHandleToggleCreateUpdateModal, boxItem.step?.id]);

    const onHandleDelete = useCallback(async () => {
      setIsLoading(true);
      mutateDeleteLink({
        id: link.id,
      });
    }, [link.id, mutateDeleteLink]);

    const onHandleToggleNote = useCallback(() => {
      setIsOpenNote(prev => !prev);
    }, []);

    const onHandleChangeBgColor = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        setCardInitialBgColor(e.target.value);
        debounced1(() => {
          onHandleChangeFlipCardIconColor(cardInitialBgColor, `${boxItem.id}-${link.id}`);
          setCardBgColor(cardInitialBgColor);
        });
      },
      [cardInitialBgColor, link.id, boxItem.id],
    );

    const options = useMemo(() => {
      return LINK_ITEM_OPTIONS({
        onHandleEdit,
        onHandleDelete,
        onHandleChangeBgColor,
        color: cardBgColor || '#e3e9fa',
      });
    }, [cardBgColor, onHandleChangeBgColor, onHandleDelete, onHandleEdit]);

    const commentRelatedData = {
      title: link.title || 'Untitled',
      itemId: link.id,
      rowId: link.rowId,
      columnId: boxItem.columnId,
      stepId: boxItem.step?.id || 0,
      type: CommentAndNoteModelsEnum.Links,
    };

    useEffect(() => {
      onHandleChangeFlipCardIconColor(link.bgColor || '#e3e9fa', `${boxItem.id}-${link.id}`);
      setCardBgColor(link.bgColor || '');
    }, [boxItem.id, link.bgColor, link.id]);

    return (
      <div
        className={`link-item ${isActiveMode ? 'active-map-card' : ''} ${isGuest ? 'guest-view-link-item' : ''}`}
        data-testid={'link-item-test-id'}>
        <div className={`${isLoading ? 'link-item--loading' : ''}`} />
        <CardHeader
          cardType={MapCardTypeEnum.Link}
          headerColor={cardBgColor || '#e3e9fa'}
          changeActiveMode={isActive => {
            setIsActiveMode(isActive);
          }}
          isDarkColor={getIsDarkColor(cardBgColor || link.bgColor || '#e3e9fa')}
          icon={<img src={LinkIcon} alt="LinkIcon" />}
          isShowPerson={!!link.personaImage}
          persona={{
            name: '',
            url: link.personaImage?.url || '',
            key: link.personaImage?.key || '',
            color: link.personaImage?.color || '#B052A7',
            croppedArea: null,
          }}
          isShowNote={isOpenNote}
          note={{
            id: link.id,
            type: CommentAndNoteModelsEnum.Links,
            rowId: link.rowId,
            stepId: boxItem.step?.id || 0,
            onHandleOpenNote: onHandleToggleNote,
            onClickAway: onHandleToggleNote,
            hasValue: Boolean(hasNote),
          }}
          comment={{
            count: link?.commentsCount,
            item: commentRelatedData,
          }}
          attachedTagsCount={link?.tagsCount || 0}
          createTagItemAttrs={{
            columnId: boxItem.columnId!,
            stepId: boxItem.step?.id || 0,
            rowId: link.rowId,
          }}
          menu={{
            item: commentRelatedData,
            options,
            disabled,
            onCloseFunction: onHandleUpdateLink,
          }}
          dragHandleProps={dragHandleProps}
        />

        <div
          className={'link-item--content'}
          style={{
            backgroundColor: lightenBackgroundColor,
          }}>
          <div data-testid={`link-item-${link.id}-logo-title-test-id`}>
            {link.type === 'JOURNEY' ? (
              <span className={'link-item--content--logo-title'}>
                <span className="wm-map" />
                <a href={getLinkHref()} target={'_blank'} rel="noreferrer" style={{ color }}>
                  {link.title}
                </a>
              </span>
            ) : (
              <span className={'link-item--content--logo-title'}>
                <img
                  className={'link-item--content--logo-image'}
                  width={50}
                  height={50}
                  src={link.icon || ''}
                  alt="Logo"
                />
                <a href={link.url!} target={'_blank'} rel="noreferrer" style={{ color }}>
                  {link.title}
                </a>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  },
);

export default LinkCard;
