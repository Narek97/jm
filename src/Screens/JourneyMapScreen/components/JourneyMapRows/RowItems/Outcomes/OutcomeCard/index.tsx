import { ChangeEvent, FC, memo, useCallback, useEffect, useMemo, useState } from 'react';

import './style.scss';

import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { v4 as uuidv4 } from 'uuid';

import CardHeader from '../../../components/CardHeader';
import { JOURNEY_MAP_OUTCOME_ITEM_OPTIONS } from '../constants';
import { OutcomeType } from '../types';

import {
  DeleteOutcomeMutation,
  useDeleteOutcomeMutation,
} from '@/api/mutations/generated/deleteOutcome.generated.ts';
import { CommentAndNoteModelsEnum, MapCardTypeEnum } from '@/api/types.ts';
import { debounced1 } from '@/hooks/useDebounce';
import { onHandleChangeFlipCardIconColor } from '@/Screens/JourneyMapScreen/helpers/onHandleChangeFlipCardIconColor';
import { BoxType } from '@/Screens/JourneyMapScreen/types.ts';
import { useUndoRedoStore } from '@/store/undoRedo.ts';
import { ActionsEnum, JourneyMapRowActionEnum, JourneyMapRowTypesEnum } from '@/types/enum';
import { getIsDarkColor } from '@/utils/getIsDarkColor';
import { lightenColor } from '@/utils/lightenColor.ts';

interface IOutcomeCard {
  outcome: OutcomeType;
  boxItem: BoxType;
  workspaceId: number | null;
  mapId: number;
  disabled: boolean;
  openDrawer: (data?: OutcomeType) => void;
  onHandleUpdateMapByType: (
    type: JourneyMapRowActionEnum | JourneyMapRowTypesEnum,
    action: ActionsEnum,
    data: any,
  ) => void;
  dragHandleProps: DraggableProvidedDragHandleProps | null;
}

const OutcomeCard: FC<IOutcomeCard> = memo(
  ({
    outcome,
    boxItem,
    workspaceId,
    mapId,
    disabled,
    openDrawer,
    onHandleUpdateMapByType,
    dragHandleProps,
  }) => {
    const { showToast } = useWuShowToast();

    const { undoActions, updateUndoActions, updateRedoActions } = useUndoRedoStore();

    const [isOpenNote, setIsOpenNote] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [cardInitialBgColor, setCardInitialBgColor] = useState<string>('');
    const [cardBgColor, setCardBgColor] = useState<string | null>(null);
    const [isActiveMode, setIsActiveMode] = useState<boolean>(false);

    const lightenBackgroundColor = cardBgColor ? lightenColor(cardBgColor, 12) : '#f5f7ff';
    const isDarkColor = getIsDarkColor(cardBgColor || '#e9ebf2');
    const color = isDarkColor ? '#ffffff' : '#545e6b';

    // const noteData = useRecoilValue(
    //   noteStateFamily({ type: CommentAndNoteModelsEnum.Outcome, id: outcome.id }),
    // );
    // const hasNote = noteData ? noteData?.text.length : outcome.note?.text.length;

    const hasNote = false;

    const { mutate: deleteOutcome } = useDeleteOutcomeMutation<Error, DeleteOutcomeMutation>({
      onError: error => {
        showToast({
          variant: 'error',
          message: error?.message,
        });
      },
    });

    const onHandleUpdateOutcome = useCallback(() => {
      if (outcome.bgColor !== cardBgColor) {
        const data = {
          ...outcome,
          bgColor: cardBgColor,
          previousBgColor: outcome.bgColor,
        };
        onHandleUpdateMapByType(JourneyMapRowTypesEnum.OUTCOMES, ActionsEnum['COLOR-CHANGE'], data);
        updateRedoActions([]);
        updateUndoActions([
          ...undoActions,
          {
            id: uuidv4(),
            type: JourneyMapRowTypesEnum.OUTCOMES,
            action: ActionsEnum.UPDATE,
            data,
          },
        ]);
      }
    }, [
      cardBgColor,
      onHandleUpdateMapByType,
      outcome,
      undoActions,
      updateRedoActions,
      updateUndoActions,
    ]);

    const onHandleToggleNote = useCallback(() => {
      setIsOpenNote(prev => !prev);
    }, []);

    const onHandleEdit = useCallback(() => {
      openDrawer(outcome);
    }, [openDrawer, outcome]);

    const onHandleDelete = useCallback(() => {
      setIsLoading(true);
      deleteOutcome(
        {
          id: outcome.id,
        },
        {
          onSuccess: () => {
            const data = {
              ...outcome,
              previousStepId: outcome.stepId,
              workspaceId,
              map: {
                id: mapId,
              },
            };

            onHandleUpdateMapByType(JourneyMapRowTypesEnum.OUTCOMES, ActionsEnum.DELETE, data);
            updateRedoActions([]);
            updateUndoActions([
              ...undoActions,
              {
                id: uuidv4(),
                type: JourneyMapRowTypesEnum.OUTCOMES,
                action: ActionsEnum.CREATE,
                data,
              },
            ]);
            setIsLoading(false);
          },
        },
      );
    }, [
      deleteOutcome,
      mapId,
      onHandleUpdateMapByType,
      outcome,
      undoActions,
      updateRedoActions,
      updateUndoActions,
      workspaceId,
    ]);

    const onHandleChangeBgColor = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        setCardInitialBgColor(e.target.value);
        debounced1(() => {
          onHandleChangeFlipCardIconColor(cardInitialBgColor, `${boxItem.id}-${outcome.id}`);
          setCardBgColor(cardInitialBgColor);
        });
      },
      [boxItem.id, cardInitialBgColor, outcome.id],
    );

    const options = useMemo(() => {
      return JOURNEY_MAP_OUTCOME_ITEM_OPTIONS({
        onHandleEdit,
        onHandleDelete,
        onHandleChangeBgColor,
        color: cardBgColor || '#e3e9fa',
      });
    }, [cardBgColor, onHandleChangeBgColor, onHandleDelete, onHandleEdit]);

    const commentRelatedData = {
      title: outcome.title || 'Untitled',
      itemId: outcome.id,
      rowId: outcome.rowId || 0,
      columnId: boxItem.columnId,
      stepId: boxItem.step?.id || 0,
      type: CommentAndNoteModelsEnum.Outcome,
    };

    useEffect(() => {
      onHandleChangeFlipCardIconColor(outcome.bgColor || '#f5f7ff', `${boxItem.id}-${outcome.id}`);
      setCardBgColor(outcome.bgColor || '');
    }, [boxItem.id, outcome.bgColor, outcome.id]);

    return (
      <div className={`outcome-item ${isActiveMode ? 'active-map-card' : ''}`}>
        <div className={`${isLoading ? 'outcome-item--loading' : ''} `} />

        <CardHeader
          cardType={MapCardTypeEnum.Outcome}
          headerColor={cardBgColor || '#e3e9fa'}
          changeActiveMode={isActive => {
            setIsActiveMode(isActive);
          }}
          isDarkColor={getIsDarkColor(cardBgColor || outcome.bgColor || '#e9ebf2')}
          icon={
            <>
              <img
                src={outcome.icon || ''}
                alt="OutcomeIcon"
                style={{ width: '1rem', height: '1rem' }}
              />
            </>
          }
          isShowPerson={!!outcome.persona}
          persona={{
            name: outcome.persona?.name || '',
            url: outcome.persona?.attachment?.url || '',
            key: outcome.persona?.attachment?.key || '',
            color: outcome.persona?.color || '#B052A7',
            croppedArea: outcome.persona?.attachment?.croppedArea || null,
          }}
          isShowNote={isOpenNote}
          note={{
            id: outcome.id,
            type: CommentAndNoteModelsEnum.Outcome,
            rowId: outcome.rowId || 0,
            stepId: boxItem.step?.id || 0,
            onHandleOpenNote: onHandleToggleNote,
            onClickAway: onHandleToggleNote,
            hasValue: Boolean(hasNote),
          }}
          comment={{
            count: outcome?.commentsCount,
            item: commentRelatedData,
          }}
          attachedTagsCount={outcome?.tagsCount || 0}
          createTagItemAttrs={{
            columnId: boxItem.columnId,
            stepId: boxItem.step?.id || 0,
            rowId: outcome.rowId || 0,
          }}
          menu={{
            item: commentRelatedData,
            options,
            disabled,
            onCloseFunction: onHandleUpdateOutcome,
          }}
          dragHandleProps={dragHandleProps}
        />

        <div
          className="outcome-item--content"
          style={{
            backgroundColor: lightenBackgroundColor,
          }}>
          <div
            className="outcome-item--content--title"
            style={{
              color,
            }}>
            {outcome?.title}
          </div>
          <div
            className="outcome-item--content--description"
            style={{
              color,
            }}>
            {outcome?.description}
          </div>
        </div>
      </div>
    );
  },
);

export default OutcomeCard;
