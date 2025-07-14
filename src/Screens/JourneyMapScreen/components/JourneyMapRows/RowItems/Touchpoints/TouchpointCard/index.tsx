import { ChangeEvent, FC, memo, useCallback, useEffect, useMemo, useState } from 'react';

import './style.scss';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { v4 as uuidv4 } from 'uuid';

import {
  DeleteTouchPointMutation,
  useDeleteTouchPointMutation,
} from '@/api/mutations/generated/deleteTouchPoint.generated';
import {
  UpdateTouchPointMutation,
  useUpdateTouchPointMutation,
} from '@/api/mutations/generated/updateTouchPoint.generated';
import { CommentAndNoteModelsEnum, MapCardTypeEnum } from '@/api/types';
import TouchpointIcon from '@/assets/public/mapRow/touchpoint.svg';
import { debounced1 } from '@/hooks/useDebounce';
import CardHeader from '@/Screens/JourneyMapScreen/components/JourneyMapRows/components/CardHeader';
import { TOUCHPOINT_ITEM_OPTIONS } from '@/Screens/JourneyMapScreen/constants.tsx';
import { onHandleChangeFlipCardIconColor } from '@/Screens/JourneyMapScreen/helpers/onHandleChangeFlipCardIconColor.ts';
import {
  BoxType,
  CommentButtonItemType,
  TouchPointType,
} from '@/Screens/JourneyMapScreen/types.ts';
import { useUndoRedoStore } from '@/store/undoRedo.ts';
import { ActionsEnum, JourneyMapRowActionEnum, JourneyMapRowTypesEnum } from '@/types/enum';
import { getIsDarkColor } from '@/utils/getIsDarkColor';
import { lightenColor } from '@/utils/lightenColor';

interface ITouchpointItem {
  touchpoint: TouchPointType;
  disabled: boolean;
  boxItem: BoxType;
  rowId: number;
  mapId: number;
  onHandleUpdateMapByType: (
    type: JourneyMapRowActionEnum | JourneyMapRowTypesEnum,
    action: ActionsEnum,
    data: any,
  ) => void;
  dragHandleProps: any;
}

const TouchpointCard: FC<ITouchpointItem> = memo(
  ({ touchpoint, disabled, boxItem, rowId, mapId, dragHandleProps, onHandleUpdateMapByType }) => {
    const { showToast } = useWuShowToast();

    const { undoActions, updateUndoActions, updateRedoActions } = useUndoRedoStore();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
    const [cardInitialBgColor, setCardInitialBgColor] = useState<string>('');
    const [cardBgColor, setCardBgColor] = useState<string | null>(touchpoint.bgColor || null);
    const [isActiveMode, setIsActiveMode] = useState<boolean>(false);

    const lightenBackgroundColor = cardBgColor ? lightenColor(cardBgColor, 12) : '#f5f7ff';
    const isDarkColor = getIsDarkColor(cardBgColor || '#e3e9fa');
    const color = isDarkColor ? '#ffffff' : '#545e6b';

    // const noteData = useRecoilValue(
    //   noteStateFamily({ type: CommentAndNoteModelsEnum.Touchpoint, id: touchpoint.id }),
    // );
    // const hasNote = noteData ? noteData.text.length : touchpoint.note?.text.length;

    const hasNote = false;

    const { mutate: mutateUpdateTouchPoint } = useUpdateTouchPointMutation<
      Error,
      UpdateTouchPointMutation
    >({
      onError: error => {
        showToast({
          variant: 'error',
          message: error?.message,
        });
      },
    });

    const { mutate: mutateDeleteTouchPoint } = useDeleteTouchPointMutation<
      Error,
      DeleteTouchPointMutation
    >({
      onError: error => {
        showToast({
          variant: 'error',
          message: error?.message,
        });
      },
    });

    const onHandleUpdateTouchpoint = useCallback(() => {
      if (cardBgColor !== touchpoint.bgColor) {
        mutateUpdateTouchPoint(
          {
            updateTouchPointInput: {
              id: touchpoint.id,
              bgColor: cardBgColor,
            },
          },
          {
            onSuccess: () => {
              onHandleUpdateMapByType(JourneyMapRowTypesEnum.TOUCHPOINTS, ActionsEnum.UPDATE, {
                touchPoints: [
                  { ...touchpoint, bgColor: cardBgColor, previousBgColor: touchpoint.bgColor },
                ],
                rowId,
                stepId: boxItem.step?.id || 0,
                columnId: touchpoint.columnId,
                mapID: mapId,
              });
              updateRedoActions([]);
              updateUndoActions([
                ...undoActions,
                {
                  id: uuidv4(),
                  type: JourneyMapRowTypesEnum.TOUCHPOINTS,
                  action: ActionsEnum.UPDATE,
                  data: {
                    touchPoints: [
                      { ...touchpoint, bgColor: cardBgColor, previousBgColor: touchpoint.bgColor },
                    ],
                    rowId,
                    stepId: boxItem?.step?.id,
                    columnId: touchpoint.columnId,
                    mapID: mapId,
                  },
                },
              ]);
            },
          },
        );
      }
    }, [
      boxItem.step?.id,
      cardBgColor,
      mapId,
      mutateUpdateTouchPoint,
      onHandleUpdateMapByType,
      rowId,
      touchpoint,
      undoActions,
      updateRedoActions,
      updateUndoActions,
    ]);

    const onHandleDelete = useCallback(() => {
      setIsLoading(true);
      mutateDeleteTouchPoint(
        {
          id: touchpoint.id,
        },
        {
          onSuccess: () => {
            onHandleUpdateMapByType(JourneyMapRowTypesEnum.TOUCHPOINTS, ActionsEnum.DELETE, {
              touchPoints: [
                { ...touchpoint, bgColor: cardBgColor, previousBgColor: touchpoint.bgColor },
              ],
              rowId,
              stepId: boxItem.step?.id,
              columnId: touchpoint.columnId,
              mapID: +mapId,
            });
            updateRedoActions([]);
            updateUndoActions([
              ...undoActions,
              {
                id: uuidv4(),
                type: JourneyMapRowTypesEnum.TOUCHPOINTS,
                action: ActionsEnum.CREATE,
                data: {
                  touchPoints: [
                    { ...touchpoint, bgColor: cardBgColor, previousBgColor: touchpoint.bgColor },
                  ],
                  rowId,
                  stepId: boxItem.step?.id,
                  columnId: touchpoint.columnId,
                  mapID: +mapId,
                },
              },
            ]);
            setIsLoading(false);
          },
        },
      );
    }, [
      boxItem.step?.id,
      cardBgColor,
      mapId,
      mutateDeleteTouchPoint,
      onHandleUpdateMapByType,
      rowId,
      touchpoint,
      undoActions,
      updateRedoActions,
      updateUndoActions,
    ]);

    const onHandleOpenNote = useCallback(() => {
      setSelectedNoteId(touchpoint.id);
    }, [touchpoint.id]);

    const onHandleChangeBgColor = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        setCardInitialBgColor(e.target.value);
        debounced1(() => {
          onHandleChangeFlipCardIconColor(cardInitialBgColor, `${boxItem.id}-${touchpoint.id}`);
          setCardBgColor(cardInitialBgColor);
        });
      },
      [cardInitialBgColor, boxItem.id, touchpoint.id],
    );

    const options = useMemo(() => {
      return TOUCHPOINT_ITEM_OPTIONS({
        onHandleDelete,
        onHandleChangeBgColor,
        color: cardBgColor || '#e9ebf2',
      });
    }, [onHandleDelete, onHandleChangeBgColor, cardBgColor]);

    const commentRelatedData: CommentButtonItemType = {
      title: touchpoint.title || '',
      itemId: touchpoint.id,
      rowId: touchpoint.rowId,
      columnId: boxItem.columnId,
      stepId: boxItem.step?.id || 0,
      type: CommentAndNoteModelsEnum.Touchpoint,
    };

    useEffect(() => {
      onHandleChangeFlipCardIconColor(
        touchpoint.bgColor || '#f5f7ff',
        `${boxItem.id}-${touchpoint.id}`,
      );
      setCardBgColor(touchpoint.bgColor || null);
    }, [rowId, boxItem.id, touchpoint.bgColor, touchpoint.id]);

    return (
      <div
        className={`touchpoint-item ${isActiveMode ? 'active-map-card' : ''}`}
        data-testid={'touchpoint-card-test-id'}
        id={'touchpoint-card'}>
        <div className={`${isLoading ? 'touchpoint-item--loading' : ''}`} />
        <CardHeader
          cardType={MapCardTypeEnum.Touchpoint}
          headerColor={cardBgColor || '#e9ebf2'}
          changeActiveMode={isActive => {
            setIsActiveMode(isActive);
          }}
          isDarkColor={getIsDarkColor(cardBgColor || touchpoint.bgColor || '#e9ebf2')}
          icon={
            <img
              src={TouchpointIcon}
              alt="Touchpoint"
              style={{
                color,
              }}
            />
          }
          isShowPerson={!!touchpoint.persona}
          persona={{
            name: touchpoint.persona?.name || '',
            url: touchpoint.persona?.attachment?.url || '',
            key: touchpoint.persona?.attachment?.key || '',
            color: touchpoint.persona?.color || '#B052A7',
            croppedArea: null,
          }}
          isShowNote={selectedNoteId === touchpoint.id}
          note={{
            id: touchpoint.id,
            type: CommentAndNoteModelsEnum.Touchpoint,
            rowId: touchpoint.rowId,
            stepId: boxItem.step?.id || 0,
            onHandleOpenNote,
            onClickAway: () => setSelectedNoteId(null),
            hasValue: Boolean(hasNote),
          }}
          comment={{
            count: touchpoint?.commentsCount,
            item: commentRelatedData,
          }}
          attachedTagsCount={touchpoint?.tagsCount || 0}
          createTagItemAttrs={{
            columnId: boxItem.columnId!,
            stepId: boxItem.step?.id || 0,
            rowId: touchpoint.rowId,
          }}
          menu={{
            item: commentRelatedData,
            options,
            disabled,
            onCloseFunction: onHandleUpdateTouchpoint,
          }}
          dragHandleProps={dragHandleProps}
        />

        <div
          className={'touchpoint-item--content'}
          style={{
            backgroundColor: lightenBackgroundColor,
          }}>
          <div
            className={'touchpoint-item--content--icon'}
            style={{
              backgroundColor: color === '#ffffff' ? color : 'transparent',
            }}>
            {touchpoint.iconUrl ? (
              <img
                src={touchpoint.iconUrl}
                alt={touchpoint.title || 'Touchpoint'}
                style={{ width: '1rem', height: '1rem' }}
              />
            ) : (
              <img src={TouchpointIcon} alt="Touchpoint" />
            )}
          </div>

          <p
            className={'touchpoint-item--content--title'}
            style={{
              color,
            }}>
            {touchpoint.title}
          </p>
        </div>
      </div>
    );
  },
);

export default TouchpointCard;
