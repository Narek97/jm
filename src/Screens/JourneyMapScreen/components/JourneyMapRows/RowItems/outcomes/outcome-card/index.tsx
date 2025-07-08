import React, { ChangeEvent, FC, memo, useCallback, useEffect, useMemo, useState } from 'react';

import './style.scss';

import Image from 'next/image';
import { useParams } from 'next/navigation';

import { useRecoilValue, useSetRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';

import CardHeader from '@/containers/journey-map-container/journey-map-rows/card-header';
import {
  DeleteOutcomeMutation,
  useDeleteOutcomeMutation,
} from '@/gql/mutations/generated/deleteOutcome.generated';
import { CommentAndNoteModelsEnum, MapCardTypeEnum } from '@/gql/types';
import { debounced1 } from '@/hooks/useDebounce';
import { noteStateFamily } from '@/store/atoms/note.atom';
import { redoActionsState, undoActionsState } from '@/store/atoms/undoRedo.atom';
import { JOURNEY_MAP_OUTCOME_ITEM_OPTIONS } from '@/utils/constants/options';
import { onHandleChangeFlipCardIconColor } from '@/utils/helpers/general';
import { getIsDarkColor, lightenColor } from '@/utils/helpers/get-complementary-color';
import {
  ActionsEnum,
  JourneyMapRowActionEnum,
  JourneyMapRowTypesEnum,
} from '@/utils/ts/enums/global-enums';
import { BoxItemType } from '@/utils/ts/types/journey-map/journey-map-types';
import { MapOutcomeItemType } from '@/utils/ts/types/outcome/outcome-type';

interface IOutcomeCard {
  outcome: MapOutcomeItemType;
  disabled: boolean;
  workspaceId: number | null;
  rowItem: BoxItemType;
  dragHandleProps: any;
  openDrawer: (data?: MapOutcomeItemType) => void;
  onHandleUpdateMapByType: (
    type: JourneyMapRowActionEnum | JourneyMapRowTypesEnum,
    action: ActionsEnum,
    data: any,
  ) => void;
}

const OutcomeCard: FC<IOutcomeCard> = memo(
  ({
    outcome,
    disabled,
    workspaceId,
    rowItem,
    dragHandleProps,
    openDrawer,
    onHandleUpdateMapByType,
  }) => {
    const { mapID } = useParams();

    const setUndoActions = useSetRecoilState(undoActionsState);
    const setRedoActions = useSetRecoilState(redoActionsState);

    const [isOpenNote, setIsOpenNote] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [cardInitialBgColor, setCardInitialBgColor] = useState<string>('');
    const [cardBgColor, setCardBgColor] = useState<string | null>(null);
    const [isActiveMode, setIsActiveMode] = useState<boolean>(false);

    const lightenBackgroundColor = cardBgColor ? lightenColor(cardBgColor, 12) : '#f5f7ff';
    const isDarkColor = getIsDarkColor(cardBgColor || '#e9ebf2');
    const color = isDarkColor ? '#ffffff' : '#545e6b';

    const noteData = useRecoilValue(
      noteStateFamily({ type: CommentAndNoteModelsEnum.Outcome, id: outcome.id }),
    );
    const hasNote = noteData ? noteData?.text.length : outcome.note?.text.length;

    const { mutate: deleteOutcome } = useDeleteOutcomeMutation<DeleteOutcomeMutation, Error>();

    const onHandleUpdateOutcome = useCallback(() => {
      if (outcome.bgColor !== cardBgColor) {
        const data = {
          ...outcome,
          bgColor: cardBgColor,
          previousBgColor: outcome.bgColor,
        };
        onHandleUpdateMapByType(JourneyMapRowTypesEnum.OUTCOMES, ActionsEnum['COLOR-CHANGE'], data);
        setRedoActions([]);
        setUndoActions(undoPrev => [
          ...undoPrev,
          {
            id: uuidv4(),
            type: JourneyMapRowTypesEnum.OUTCOMES,
            action: ActionsEnum.UPDATE,
            data,
          },
        ]);
      }
    }, [cardBgColor, onHandleUpdateMapByType, outcome, setRedoActions, setUndoActions]);

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
                id: +mapID!,
              },
            };

            onHandleUpdateMapByType(JourneyMapRowTypesEnum.OUTCOMES, ActionsEnum.DELETE, data);
            setRedoActions([]);
            setUndoActions(undoPrev => [
              ...undoPrev,
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
      mapID,
      onHandleUpdateMapByType,
      outcome,
      setRedoActions,
      setUndoActions,
      workspaceId,
    ]);

    const onHandleChangeBgColor = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        setCardInitialBgColor(e.target.value);
        debounced1(() => {
          onHandleChangeFlipCardIconColor(cardInitialBgColor, `${rowItem.id}-${outcome.id}`);
          setCardBgColor(cardInitialBgColor);
        });
      },
      [cardInitialBgColor, outcome.id, rowItem.id],
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
      title: outcome.title,
      itemId: outcome.id,
      rowId: outcome.rowId,
      columnId: rowItem.columnId!,
      stepId: rowItem.step.id,
      type: CommentAndNoteModelsEnum.Outcome,
    };

    useEffect(() => {
      onHandleChangeFlipCardIconColor(outcome.bgColor || '#f5f7ff', `${rowItem.id}-${outcome.id}`);
      setCardBgColor(outcome.bgColor);
    }, [outcome.bgColor, outcome.id, rowItem.id]);

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
              <Image
                src={outcome.icon || ''}
                alt="Icon"
                width={100}
                height={100}
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
            rowId: outcome.rowId,
            stepId: rowItem?.step.id,
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
            columnId: rowItem.columnId!,
            stepId: rowItem.step.id,
            rowId: outcome.rowId,
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
