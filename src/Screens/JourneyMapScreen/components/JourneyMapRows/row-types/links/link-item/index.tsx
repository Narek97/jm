import React, { ChangeEvent, FC, memo, useCallback, useEffect, useMemo, useState } from 'react';

import './style.scss';

import Image from 'next/image';
import { useParams, usePathname } from 'next/navigation';

import { useRecoilValue, useSetRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';

import CardHeader from '@/containers/journey-map-container/journey-map-rows/card-header';
import {
  DeleteMapLinkMutation,
  useDeleteMapLinkMutation,
} from '@/gql/mutations/generated/deleteLink.generated';
import {
  UpdateLinkBgColorMutation,
  useUpdateLinkBgColorMutation,
} from '@/gql/mutations/generated/updateLinkBGColor.generated';
import { CommentAndNoteModelsEnum, MapCardTypeEnum } from '@/gql/types';
import { debounced1 } from '@/hooks/useDebounce';
import JourneyIcon from '@/public/journey-map/journey.svg';
import LinkIcon from '@/public/journey-map/link.svg';
import { noteStateFamily } from '@/store/atoms/note.atom';
import { redoActionsState, undoActionsState } from '@/store/atoms/undoRedo.atom';
import { TOKEN_NAME } from '@/utils/constants/general';
import { LINK_ITEM_OPTIONS } from '@/utils/constants/options';
import { getCookies } from '@/utils/helpers/cookies';
import { onHandleChangeFlipCardIconColor } from '@/utils/helpers/general';
import { getIsDarkColor, lightenColor } from '@/utils/helpers/get-complementary-color';
import {
  ActionsEnum,
  JourneyMapRowActionEnum,
  JourneyMapRowTypesEnum,
} from '@/utils/ts/enums/global-enums';
import { ObjectKeysType } from '@/utils/ts/types/global-types';
import { BoxItemType } from '@/utils/ts/types/journey-map/journey-map-types';
import { LinkType } from '@/utils/ts/types/link/link-type';

interface ILinkItem {
  link: LinkType;
  disabled: boolean;
  rowItem: BoxItemType;
  dragHandleProps: ObjectKeysType;
  onHandleToggleCreateUpdateModal: (stepId?: number, link?: LinkType) => void;
  onHandleUpdateMapByType: (
    type: JourneyMapRowActionEnum | JourneyMapRowTypesEnum,
    action: ActionsEnum,
    data: any,
  ) => void;
}

const LinkItem: FC<ILinkItem> = memo(
  ({
    link,
    disabled,
    rowItem,
    dragHandleProps,
    onHandleToggleCreateUpdateModal,
    onHandleUpdateMapByType,
  }) => {
    const pathname = usePathname();
    const isGuest = pathname.includes('guest');

    const { boardID } = useParams();
    const token = getCookies(TOKEN_NAME);
    const setUndoActions = useSetRecoilState(undoActionsState);
    const setRedoActions = useSetRecoilState(redoActionsState);

    const [isOpenNote, setIsOpenNote] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [cardInitialBgColor, setCardInitialBgColor] = useState<string>('');
    const [cardBgColor, setCardBgColor] = useState<string | null>(null);
    const [isActiveMode, setIsActiveMode] = useState<boolean>(false);

    const lightenBackgroundColor = cardBgColor ? lightenColor(cardBgColor, 12) : '#f5f7ff';
    const isDarkColor = getIsDarkColor(cardBgColor || '#e3e9fa');
    const color = isDarkColor ? '#ffffff' : '#545e6b';

    const noteData = useRecoilValue(
      noteStateFamily({ type: CommentAndNoteModelsEnum.Links, id: link.id }),
    );
    const hasNote = noteData ? noteData?.text.length : link.note?.text.length;

    const { mutate: mutateDeleteLink } = useDeleteMapLinkMutation<DeleteMapLinkMutation, Error>({
      onSuccess: () => {
        const data = {
          ...link,
          stepId: rowItem.step.id,
        };

        onHandleUpdateMapByType(JourneyMapRowTypesEnum.LINKS, ActionsEnum.DELETE, data);
        setRedoActions([]);
        setUndoActions(undoPrev => [
          ...undoPrev,
          {
            id: uuidv4(),
            type: JourneyMapRowTypesEnum.LINKS,
            action: ActionsEnum.CREATE,
            data,
          },
        ]);
      },
    });

    const { mutate: mutateUpdateLink } = useUpdateLinkBgColorMutation<
      UpdateLinkBgColorMutation,
      Error
    >({
      onSuccess: () => {
        const data = {
          ...link,
          bgColor: cardBgColor,
          previousBgColor: link.bgColor,
          stepId: rowItem.step.id,
        };

        onHandleUpdateMapByType(JourneyMapRowTypesEnum.LINKS, ActionsEnum['COLOR-CHANGE'], data);
        setRedoActions([]);
        setUndoActions(undoPrev => [
          ...undoPrev,
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
      let url = `${process.env.NEXT_PUBLIC_APP}/board/${boardID}/journey-map/${link.linkedMapId}`;
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
      onHandleToggleCreateUpdateModal(rowItem.step.id, link);
    }, [link, onHandleToggleCreateUpdateModal, rowItem.step.id]);

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
          onHandleChangeFlipCardIconColor(cardInitialBgColor, `${rowItem.id}-${link.id}`);
          setCardBgColor(cardInitialBgColor);
        });
      },
      [cardInitialBgColor, link.id, rowItem.id],
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
      title: link.title,
      itemId: link.id,
      rowId: link.rowId,
      columnId: rowItem.columnId!,
      stepId: rowItem.step.id,
      type: CommentAndNoteModelsEnum.Links,
    };

    useEffect(() => {
      onHandleChangeFlipCardIconColor(link.bgColor || '#e3e9fa', `${rowItem.id}-${link.id}`);
      setCardBgColor(link.bgColor);
    }, [link.bgColor, link.id, rowItem.id]);

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
          icon={<LinkIcon />}
          isShowPerson={!!link.personaImage}
          persona={{
            name: '',
            url: link.personaImage?.url || '',
            key: link.personaImage?.key || '',
            color: link.personaImage?.color || '#B052A7',
            croppedArea: link.personaImage?.croppedArea || null,
          }}
          isShowNote={isOpenNote}
          note={{
            id: link.id,
            type: CommentAndNoteModelsEnum.Links,
            rowId: link.rowId,
            stepId: rowItem?.step.id,
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
            columnId: rowItem.columnId!,
            stepId: rowItem.step.id,
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
                <JourneyIcon />
                <a href={getLinkHref()} target={'_blank'} rel="noreferrer" style={{ color }}>
                  {link.title}
                </a>
              </span>
            ) : (
              <span className={'link-item--content--logo-title'}>
                <Image
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

export default LinkItem;
