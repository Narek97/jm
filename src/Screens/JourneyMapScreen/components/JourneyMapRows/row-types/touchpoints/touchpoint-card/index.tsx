import React, { ChangeEvent, FC, memo, useCallback, useEffect, useMemo, useState } from 'react';

import './style.scss';

import Image from 'next/image';
import { useParams } from 'next/navigation';

import { useRecoilValue, useSetRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';

import CardHeader from '@/containers/journey-map-container/journey-map-rows/card-header';
import {
  DeleteTouchPointMutation,
  useDeleteTouchPointMutation,
} from '@/gql/mutations/generated/deleteTouchPoint.generated';
import {
  UpdateTouchPointMutation,
  useUpdateTouchPointMutation,
} from '@/gql/mutations/generated/updateTouchPoint.generated';
import { CommentAndNoteModelsEnum, MapCardTypeEnum } from '@/gql/types';
import { debounced1 } from '@/hooks/useDebounce';
import TouchPointIcon from '@/public/journey-map/touchpoint.svg';
import { noteStateFamily } from '@/store/atoms/note.atom';
import { redoActionsState, undoActionsState } from '@/store/atoms/undoRedo.atom';
import { TOUCHPOINT_ITEM_OPTIONS } from '@/utils/constants/options';
import { onHandleChangeFlipCardIconColor } from '@/utils/helpers/general';
import { getIsDarkColor, lightenColor } from '@/utils/helpers/get-complementary-color';
import {
  ActionsEnum,
  JourneyMapRowActionEnum,
  JourneyMapRowTypesEnum,
} from '@/utils/ts/enums/global-enums';
import { CommentButtonItemType } from '@/utils/ts/types/global-types';
import { BoxItemType, TouchPointType } from '@/utils/ts/types/journey-map/journey-map-types';

interface ITouchpointItem {
  touchpoint: TouchPointType;
  disabled: boolean;
  rowItem: BoxItemType;
  rowId: number;
  onHandleUpdateMapByType: (
    type: JourneyMapRowActionEnum | JourneyMapRowTypesEnum,
    action: ActionsEnum,
    data: any,
  ) => void;
  dragHandleProps: any;
}

const TouchpointCard: FC<ITouchpointItem> = memo(
  ({ touchpoint, disabled, rowItem, rowId, dragHandleProps, onHandleUpdateMapByType }) => {
    const { mapID } = useParams();

    const setUndoActions = useSetRecoilState(undoActionsState);
    const setRedoActions = useSetRecoilState(redoActionsState);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
    const [cardInitialBgColor, setCardInitialBgColor] = useState<string>('');
    const [cardBgColor, setCardBgColor] = useState<string | null>(touchpoint.bgColor);
    const [isActiveMode, setIsActiveMode] = useState<boolean>(false);

    const lightenBackgroundColor = cardBgColor ? lightenColor(cardBgColor, 12) : '#f5f7ff';
    const isDarkColor = getIsDarkColor(cardBgColor || '#e3e9fa');
    const color = isDarkColor ? '#ffffff' : '#545e6b';

    const noteData = useRecoilValue(
      noteStateFamily({ type: CommentAndNoteModelsEnum.Touchpoint, id: touchpoint.id }),
    );
    const hasNote = noteData ? noteData.text.length : touchpoint.note?.text.length;

    const { mutate: mutateUpdateTouchPoint } = useUpdateTouchPointMutation<
      UpdateTouchPointMutation,
      Error
    >();

    const { mutate: mutateDeleteTouchPoint } = useDeleteTouchPointMutation<
      DeleteTouchPointMutation,
      Error
    >();

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
                stepId: rowItem?.step.id,
                columnId: touchpoint.columnId,
                mapID: +mapID!,
              });
              setRedoActions([]);
              setUndoActions(undoPrev => [
                ...undoPrev,
                {
                  id: uuidv4(),
                  type: JourneyMapRowTypesEnum.TOUCHPOINTS,
                  action: ActionsEnum.UPDATE,
                  data: {
                    touchPoints: [
                      { ...touchpoint, bgColor: cardBgColor, previousBgColor: touchpoint.bgColor },
                    ],
                    rowId,
                    stepId: rowItem?.step.id,
                    columnId: touchpoint.columnId,
                    mapID: +mapID!,
                  },
                },
              ]);
            },
          },
        );
      }
    }, [
      cardBgColor,
      mapID,
      mutateUpdateTouchPoint,
      onHandleUpdateMapByType,
      rowId,
      rowItem?.step.id,
      setRedoActions,
      setUndoActions,
      touchpoint,
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
              stepId: rowItem?.step.id,
              columnId: touchpoint.columnId,
              mapID: +mapID!,
            });
            setRedoActions([]);
            setUndoActions(undoPrev => [
              ...undoPrev,
              {
                id: uuidv4(),
                type: JourneyMapRowTypesEnum.TOUCHPOINTS,
                action: ActionsEnum.CREATE,
                data: {
                  touchPoints: [
                    { ...touchpoint, bgColor: cardBgColor, previousBgColor: touchpoint.bgColor },
                  ],
                  rowId,
                  stepId: rowItem?.step.id,
                  columnId: touchpoint.columnId,
                  mapID: +mapID!,
                },
              },
            ]);
            setIsLoading(false);
          },
        },
      );
    }, [
      cardBgColor,
      mapID,
      mutateDeleteTouchPoint,
      onHandleUpdateMapByType,
      rowId,
      rowItem?.step.id,
      setRedoActions,
      setUndoActions,
      touchpoint,
    ]);

    const onHandleOpenNote = useCallback(() => {
      setSelectedNoteId(touchpoint.id);
    }, [touchpoint.id]);

    const onHandleChangeBgColor = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        setCardInitialBgColor(e.target.value);
        debounced1(() => {
          onHandleChangeFlipCardIconColor(cardInitialBgColor, `${rowItem.id}-${touchpoint.id}`);
          setCardBgColor(cardInitialBgColor);
        });
      },
      [cardInitialBgColor, rowItem.id, touchpoint.id],
    );

    const options = useMemo(() => {
      return TOUCHPOINT_ITEM_OPTIONS({
        onHandleDelete,
        onHandleChangeBgColor,
        color: cardBgColor || '#e9ebf2',
      });
    }, [onHandleDelete, onHandleChangeBgColor, cardBgColor]);

    const commentRelatedData: CommentButtonItemType = {
      title: touchpoint.title,
      itemId: touchpoint.id,
      rowId: touchpoint.rowId,
      columnId: rowItem.columnId!,
      stepId: rowItem.step.id,
      type: CommentAndNoteModelsEnum.Touchpoint,
    };

    useEffect(() => {
      onHandleChangeFlipCardIconColor(
        touchpoint.bgColor || '#f5f7ff',
        `${rowItem.id}-${touchpoint.id}`,
      );
      setCardBgColor(touchpoint.bgColor);
    }, [rowId, rowItem.id, touchpoint.bgColor, touchpoint.id]);

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
          icon={<TouchPointIcon fill={color} />}
          isShowPerson={!!touchpoint.persona}
          persona={{
            name: touchpoint.persona?.name || '',
            url: touchpoint.persona?.attachment?.url || '',
            key: touchpoint.persona?.attachment?.key || '',
            color: touchpoint.persona?.color || '#B052A7',
            croppedArea: touchpoint.persona?.attachment?.croppedArea || null,
          }}
          isShowNote={selectedNoteId === touchpoint.id}
          note={{
            id: touchpoint.id,
            type: CommentAndNoteModelsEnum.Touchpoint,
            rowId: touchpoint.rowId,
            stepId: rowItem?.step.id,
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
            columnId: rowItem.columnId!,
            stepId: rowItem.step.id,
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
              <Image
                src={touchpoint.iconUrl}
                alt={touchpoint.title}
                width={100}
                height={100}
                style={{ width: '1rem', height: '1rem' }}
              />
            ) : (
              <TouchPointIcon />
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
