import React, {
  ChangeEvent,
  FC,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import './style.scss';

import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import axios from 'axios';

import {
  UpdateBoxElementMutation,
  useUpdateBoxElementMutation,
} from '@/api/mutations/generated/updateBoxElement.generated.ts';
import { CommentAndNoteModelsEnum, MapCardTypeEnum } from '@/api/types.ts';
import ConsIcon from '@/Assets/public/mapRow/cons.svg';
import InteractionIcon from '@/Assets/public/mapRow/interaction.svg';
import ListIcon from '@/Assets/public/mapRow/list.svg';
import ProsIcon from '@/Assets/public/mapRow/pros.svg';
import MapEditor from '@/Components/Shared/Editors/MapEditor';
import { TOKEN_NAME } from '@/Constants';
import { debounced1, debounced400, debounced600 } from '@/Hooks/useDebounce.ts';
import CardHeader from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/CardHeader';
import { JOURNEY_MAP_TEXT_FIELD_OPTIONS } from '@/Screens/JourneyMapScreen/constants.tsx';
import { onHandleChangeFlipCardIconColor } from '@/Screens/JourneyMapScreen/helpers/onHandleChangeFlipCardIconColor.ts';
import { useCrudMapBoxElement } from '@/Screens/JourneyMapScreen/hooks/useCRUDMapBoxElement.tsx';
import { BoxElementType, CommentButtonItemType } from '@/Screens/JourneyMapScreen/types.ts';
import { useNote } from '@/Store/note.ts';
import { ObjectKeysType } from '@/types';
import { ActionsEnum, JourneyMapRowActionEnum, JourneyMapRowTypesEnum } from '@/types/enum';
import { getCookie } from '@/utils/cookieHelper.ts';
import { getIsDarkColor } from '@/utils/getIsDarkColor.ts';
import { lightenColor } from '@/utils/lightenColor.ts';

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

const token = getCookie(TOKEN_NAME);

async function updateBoxElementText(
  updateBoxDataInput: { boxElementId: number; text?: string },
  signal: AbortSignal,
) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/graphql`,
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
  onHandleDeleteBoxElement: (data?: { itemId: number }) => void;
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
    const { showToast } = useWuShowToast();
    const { crudBoxElement } = useCrudMapBoxElement();
    const hasNote = useNote(CommentAndNoteModelsEnum.BoxElement, item.id);

    const [isOpenNote, setIsOpenNote] = useState<boolean>(false);
    const [cardInitialBgColor, setCardInitialBgColor] = useState<string>('');
    const [cardBgColor, setCardBgColor] = useState<string | null>(null);
    const [isActiveMode, setIsActiveMode] = useState<boolean>(false);

    const abortControllerRef = React.useRef<AbortController | null>(null);

    const { mutate: updateBoxElement } = useUpdateBoxElementMutation<
      Error,
      UpdateBoxElementMutation
    >({
      onSuccess: response => {
        crudBoxElement(response?.updateBoxElement, ActionsEnum.UPDATE);
      },
      onError: error => {
        showToast({
          variant: 'error',
          message: error?.message,
        });
      },
    });

    const lightenBackgroundColor = cardBgColor ? lightenColor(cardBgColor, 12) : bodyColor;
    const isDarkColor = getIsDarkColor(cardBgColor || headerColor);
    const color = isDarkColor ? '#ffffff' : '#545e6b';

    const itemIcon: ObjectKeysType = {
      [JourneyMapRowTypesEnum.CONS]: <img src={ConsIcon} alt={'Cons'} />,
      [JourneyMapRowTypesEnum.PROS]: <img src={ProsIcon} alt={'Pros'} />,
      [JourneyMapRowTypesEnum.INTERACTIONS]: <img src={InteractionIcon} alt={'Interaction'} />,
      [JourneyMapRowTypesEnum.LIST_ITEM]: <img src={ListIcon} alt={'List'} />,
    };

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
      title: item.text || '',
      columnId,
      rowId,
      stepId,
      type: CommentAndNoteModelsEnum.BoxElement,
    };

    useEffect(() => {
      onHandleChangeFlipCardIconColor(item.bgColor || '#e3e9fa', `${rowId}-${item.id}`);
      setCardBgColor(item.bgColor || null);
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
          icon={itemIcon[type] as ReactNode}
          isShowPerson={!!item.persona}
          persona={{
            name: item.persona?.name || '',
            url: item.persona?.attachment?.url || '',
            key: item.persona?.attachment?.key || '',
            color: item.persona?.color || '#B052A7',
            croppedArea: null,
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
            initValue={item?.text || ''}
            isBackCard={false}
            color={color}
          />
        </div>
      </div>
    );
  },
);

export default CardInput;
