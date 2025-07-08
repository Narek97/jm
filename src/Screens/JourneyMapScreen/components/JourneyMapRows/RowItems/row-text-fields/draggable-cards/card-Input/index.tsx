import React, { ChangeEvent, FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import './style.scss';

import axios from 'axios';
import { useRecoilValue } from 'recoil';

import MapEditor from '@/components/organisms/editors/map-editor';
import { useCrudMapBoxElement } from '@/containers/journey-map-container/hooks/useCRUDMapBoxElement';
import CardHeader from '@/containers/journey-map-container/journey-map-rows/card-header';
import { useUpdateBoxElementMutation } from '@/gql/mutations/generated/updateBoxElement.generated';
import { CommentAndNoteModelsEnum, MapCardTypeEnum } from '@/gql/types';
import { debounced1, debounced400, debounced600 } from '@/hooks/useDebounce';
import ConsIcon from '@/public/journey-map/cons.svg';
import InteractionIcon from '@/public/journey-map/interaction.svg';
import ListIcon from '@/public/journey-map/list.svg';
import ProsIcon from '@/public/journey-map/pros.svg';
import { noteStateFamily } from '@/store/atoms/note.atom';
import { TOKEN_NAME } from '@/utils/constants/general';
import { JOURNEY_MAP_TEXT_FIELD_OPTIONS } from '@/utils/constants/options';
import { getCookies } from '@/utils/helpers/cookies';
import { onHandleChangeFlipCardIconColor } from '@/utils/helpers/general';
import { getIsDarkColor, lightenColor } from '@/utils/helpers/get-complementary-color';
import {
  ActionsEnum,
  JourneyMapRowActionEnum,
  JourneyMapRowTypesEnum,
} from '@/utils/ts/enums/global-enums';
import { CommentButtonItemType, ObjectKeysType } from '@/utils/ts/types/global-types';
import { BoxElementType } from '@/utils/ts/types/journey-map/journey-map-types';

const UPDATE_BOX_ELEMENT_MUTATION = `
  mutation UpdateBoxElement($updateBoxDataInput: UpdateBoxDataInput!) {
    updateBoxElement(updateBoxDataInput: $updateBoxDataInput) {
      id
      columnId
      stepId
      rowId
      text
      index
      previousText
      attachmentId
      bgColor
      previousBgColor
    }
  }
`;

const token = getCookies(TOKEN_NAME);

async function updateBoxElementText(
  updateBoxDataInput: { boxElementId: number; text?: string },
  signal: AbortSignal,
) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}`,
      {
        query: UPDATE_BOX_ELEMENT_MUTATION,
        variables: { updateBoxDataInput },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal,
      },
    );
    return response.data.data.updateBoxElement;
  } catch (error) {
    console.error(error);
  }
}

interface ICardInput {
  item: BoxElementType;
  type: JourneyMapRowActionEnum | JourneyMapRowTypesEnum;
  headerColor: string;
  bodyColor: string;
  rowId: number;
  stepId: number;
  columnId: number;
  disabled: boolean;
  isLoading: boolean;
  onHandleDeleteBoxElement: ({ itemId }: { itemId: number }) => void;
  dragHandleProps?: any;
}

const CardInput: FC<ICardInput> = memo(
  ({
    item,
    type,
    headerColor,
    bodyColor,
    rowId,
    stepId,
    columnId,
    disabled,
    isLoading,
    onHandleDeleteBoxElement,
    dragHandleProps,
  }) => {
    const [isOpenNote, setIsOpenNote] = useState<boolean>(false);
    const [cardInitialBgColor, setCardInitialBgColor] = useState<string>('');
    const [cardBgColor, setCardBgColor] = useState<string | null>(null);
    const [isActiveMode, setIsActiveMode] = useState<boolean>(false);

    const abortControllerRef = React.useRef<AbortController | null>(null);

    const { crudBoxElement } = useCrudMapBoxElement();

    const { mutate: updateBoxElement } = useUpdateBoxElementMutation({
      onSuccess: response => {
        crudBoxElement(response?.updateBoxElement, ActionsEnum.UPDATE);
      },
    });

    const lightenBackgroundColor = cardBgColor ? lightenColor(cardBgColor, 12) : bodyColor;
    const isDarkColor = getIsDarkColor(cardBgColor || headerColor);
    const color = isDarkColor ? '#ffffff' : '#545e6b';

    const itemIcon: ObjectKeysType = {
      [JourneyMapRowTypesEnum.CONS]: <ConsIcon />,
      [JourneyMapRowTypesEnum.PROS]: <ProsIcon />,
      [JourneyMapRowTypesEnum.INTERACTIONS]: <InteractionIcon />,
      [JourneyMapRowTypesEnum.LIST_ITEM]: <ListIcon />,
    };

    const noteData = useRecoilValue(
      noteStateFamily({ type: CommentAndNoteModelsEnum.BoxElement, id: item.id }),
    );
    const hasNote = noteData ? noteData.text.length : item.note?.text.length;

    const onHandleToggleNote = useCallback(() => {
      setIsOpenNote(prev => !prev);
    }, []);

    const onHandleChangeBgColor = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        setCardInitialBgColor(e.target.value);
        debounced1(() => {
          onHandleChangeFlipCardIconColor(cardInitialBgColor, `${rowId}-${item.id}`);
          setCardBgColor(cardInitialBgColor);
        });
      },
      [cardInitialBgColor, item.id, rowId],
    );

    const onHandleUpdateCard = useCallback(() => {
      if (cardBgColor !== item.bgColor) {
        debounced400(() => {
          updateBoxElement({
            updateBoxDataInput: {
              boxElementId: item.id,
              bgColor: cardBgColor || item.bgColor || bodyColor,
            },
          });
        });
      }
    }, [bodyColor, cardBgColor, item.bgColor, item.id, updateBoxElement]);

    const onHandleTextChange = useCallback(
      (value: string) => {
        // Cancel any existing request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        // Create a new AbortController for the new request
        debounced600(async () => {
          abortControllerRef.current = new AbortController();

          try {
            const result = await updateBoxElementText(
              {
                boxElementId: item.id,
                text: value,
              },
              abortControllerRef.current!.signal,
            );
            crudBoxElement({ ...result, previousText: item?.text }, ActionsEnum.UPDATE);
          } catch (error) {
            console.error(error);
          }
        });
      },
      [crudBoxElement, item.id, item?.text],
    );

    const itemData = useMemo(() => {
      return {
        id: item?.id || 0,
        rowId,
        stepId,
      };
    }, [item?.id, rowId, stepId]);

    const options = useMemo(() => {
      return JOURNEY_MAP_TEXT_FIELD_OPTIONS({
        onHandleDelete: onHandleDeleteBoxElement,
        onHandleChangeBgColor,
        color: cardBgColor || headerColor,
      });
    }, [cardBgColor, headerColor, onHandleChangeBgColor, onHandleDeleteBoxElement]);

    const commentRelatedData: CommentButtonItemType = {
      itemId: item.id,
      title: item.text,
      columnId,
      rowId,
      stepId,
      type: CommentAndNoteModelsEnum.BoxElement,
    };

    useEffect(() => {
      onHandleChangeFlipCardIconColor(item.bgColor || '#e3e9fa', `${rowId}-${item.id}`);
      setCardBgColor(item.bgColor);
    }, [bodyColor, item, rowId]);

    return (
      <div
        className={`draggable-input map-item ${isActiveMode ? 'active-map-card' : ''}`}
        data-testid={`draggable-input-${item?.id}-test-id`}>
        <div className={`${isLoading ? 'touchpoint-item--loading' : ''}`} />
        <CardHeader
          cardType={MapCardTypeEnum.BoxElement}
          headerColor={cardBgColor || headerColor}
          changeActiveMode={isActive => {
            setIsActiveMode(isActive);
          }}
          isDarkColor={getIsDarkColor(cardBgColor || item.bgColor || headerColor)}
          icon={itemIcon[type]}
          isShowPerson={!!item.persona}
          persona={{
            name: item.persona?.name || '',
            url: item.persona?.attachment?.url || '',
            key: item.persona?.attachment?.key || '',
            color: item.persona?.color || '#B052A7',
            croppedArea: item?.persona?.attachment?.croppedArea || null,
          }}
          isShowNote={isOpenNote}
          note={{
            id: item.id || 0,
            type: CommentAndNoteModelsEnum.BoxElement,
            rowId,
            stepId,
            onHandleOpenNote: onHandleToggleNote,
            onClickAway: onHandleToggleNote,
            hasValue: Boolean(hasNote),
          }}
          comment={{
            count: item.commentsCount || 0,
            item: commentRelatedData,
          }}
          attachedTagsCount={item?.tagsCount || 0}
          createTagItemAttrs={{
            columnId: columnId!,
            stepId: stepId,
            rowId: rowId,
          }}
          menu={{
            item: commentRelatedData,
            options,
            disabled,
            onCloseFunction: onHandleUpdateCard,
          }}
          dragHandleProps={dragHandleProps}
        />
        <div
          className={`draggable-input--content ${isDarkColor ? 'dark-mode-editor' : ''}`}
          style={{
            backgroundColor: lightenBackgroundColor,
          }}>
          <MapEditor
            onHandleTextChange={onHandleTextChange}
            itemData={itemData}
            initValue={item?.text}
            isBackCard={false}
            color={color}
          />
        </div>
      </div>
    );
  },
);

export default CardInput;
