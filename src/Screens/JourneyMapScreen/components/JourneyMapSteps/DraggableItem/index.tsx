import {
  ChangeEvent,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import './style.scss';

import { v4 as uuidv4 } from 'uuid';

import StepInput from './StepInput';

import {
  AddOrUpdateColumnStepMutation,
  useAddOrUpdateColumnStepMutation,
} from '@/api/mutations/generated/addOrUpdateColumnStep.generated.ts';
import {
  DeleteColumnStepMutation,
  useDeleteColumnStepMutation,
} from '@/api/mutations/generated/deleteColumnStep.generated.ts';
import CustomLoader from '@/Components/Shared/CustomLoader';
import CustomLongMenu from '@/Components/Shared/CustomLongMenu';
import StepColumnDrag from '@/Components/Shared/StepColumnDrag';
import { debounced800 } from '@/hooks/useDebounce.ts';
import { JOURNEY_MAP_STEP_OPTIONS } from '@/Screens/JourneyMapScreen/constants.tsx';
import { useUpdateMap } from '@/Screens/JourneyMapScreen/hooks/useUpdateMap.tsx';
import { BoxElementType } from '@/Screens/JourneyMapScreen/types.ts';
import { useJourneyMapStore } from '@/store/journeyMap.ts';
import { useLayerStore } from '@/store/layers.ts';
import { useUndoRedoStore } from '@/store/undoRedo.ts';
import { ActionsEnum, JourneyMapRowActionEnum, MenuViewTypeEnum } from '@/types/enum.ts';
import { getTextColorBasedOnBackground } from '@/utils/getTextColorBasedOnBackground.ts';
import { lightenColor } from '@/utils/lightenColor.ts';

interface ChildRef {
  createNewColumn: () => void;
}

interface IDraggableItem {
  stepItem: BoxElementType;
  columnColor: string;
  index: number;
  stageStepCount: number;
  isGuest: boolean;
  onHandleCreateNewStep: (
    columnId: number,
    id: number,
    stepIndex: number,
    position: number,
  ) => void;
  onHandleDeleteStep: (id: number, columnId: number) => void;
  dragHandleProps?: any;
  hasMergeItems: boolean;
  canAddNewItem: boolean;
}

const DraggableItem = forwardRef<ChildRef, IDraggableItem>((props, ref) => {
  const {
    stepItem,
    columnColor,
    index,
    stageStepCount,
    isGuest,
    onHandleCreateNewStep,
    onHandleDeleteStep,
    dragHandleProps,
    hasMergeItems,
    canAddNewItem,
  } = props;

  const { updateMapByType } = useUpdateMap();

  const { journeyMap, updateJourneyMap } = useJourneyMapStore();
  const { undoActions, updateUndoActions, updateRedoActions } = useUndoRedoStore();
  const { currentLayer } = useLayerStore();

  const isLayerModeOn = !currentLayer?.isBase;

  const [stepColor, setStepColor] = useState<string | null>(stepItem.step?.bgColor || null);

  const stepItemRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: deleteColumnStepMutate } = useDeleteColumnStepMutation<
    DeleteColumnStepMutation,
    Error
  >();

  const { mutate: createOrUpdateStepMutate } = useAddOrUpdateColumnStepMutation<
    AddOrUpdateColumnStepMutation,
    Error
  >();

  const onHandleCreateStep = useCallback(
    (position: number) => {
      let dragIndex = position;
      const columnId = stepItem.columnId!;
      const columnIndex = journeyMap.columns.findIndex(c => c.id === columnId);

      for (let i = 0; i < columnIndex; i++) {
        dragIndex -= journeyMap.columns[i].size;
      }

      createOrUpdateStepMutate(
        {
          addOrUpdateColumnStepInput: {
            add: {
              columnId,
              name: '',
              index: dragIndex,
            },
          },
        },
        {
          onSuccess: response => {
            const { id, index: stepIndex } = response.addOrUpdateColumnStep.columnStep;
            onHandleCreateNewStep(columnId, id, stepIndex, position - 2);
          },
        },
      );
    },
    [stepItem.columnId, journeyMap.columns, createOrUpdateStepMutate, onHandleCreateNewStep],
  );

  const onHandleDelete = useCallback(
    (deletedStepItem: BoxElementType) => {
      if (deletedStepItem.step) {
        deleteColumnStepMutate(
          {
            id: deletedStepItem.step.id,
          },
          {
            onSuccess: () => {
              onHandleDeleteStep(deletedStepItem.step!.id, deletedStepItem.step!.columnId);
            },
          },
        );
      }
    },
    [deleteColumnStepMutate, onHandleDeleteStep],
  );

  const onHandleUpdateStepColumn = useCallback(
    ({ id, value, columnId }: { id: number; value: string; columnId: number }) => {
      debounced800(() => {
        const rows = journeyMap.rows;

        rows[0].boxes?.forEach(box => {
          if (box.step?.id === id) {
            box.step.name = value;
          }
        });

        updateJourneyMap({ rows });
        createOrUpdateStepMutate(
          {
            addOrUpdateColumnStepInput: {
              update: {
                columnId,
                id,
                name: value,
              },
            },
          },
          {
            onSuccess: () => {},
          },
        );
      });
    },
    [createOrUpdateStepMutate, journeyMap.rows, updateJourneyMap],
  );

  const onHandleChangeColor = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const bgColor = e.target.value;
      if (stepItemRef && stepItemRef.current) {
        stepItemRef.current.style.backgroundColor = bgColor;
      }
      if (inputRef && inputRef.current) {
        inputRef.current.style.color = getTextColorBasedOnBackground(bgColor);
      }

      debounced800(() => {
        const data = {
          stepId: stepItem.step?.id,
          bgColor,
          previousBgColor: stepColor,
        };
        updateMapByType(JourneyMapRowActionEnum.STEPS_BG_COLOR, ActionsEnum.UPDATE, data);
        updateRedoActions([]);
        updateUndoActions([
          ...undoActions,
          {
            id: uuidv4(),
            type: JourneyMapRowActionEnum.STEPS_BG_COLOR,
            action: ActionsEnum.UPDATE,
            data,
          },
        ]);
      });
    },
    [
      stepColor,
      stepItem.step?.id,
      undoActions,
      updateMapByType,
      updateRedoActions,
      updateUndoActions,
    ],
  );

  const options = useMemo(() => {
    return JOURNEY_MAP_STEP_OPTIONS({
      onHandleDelete,
      onHandleChangeColor,
      color: stepColor || lightenColor(columnColor, 20) || '',
      isSingleStep: stageStepCount > 1 && !hasMergeItems,
    });
  }, [columnColor, hasMergeItems, onHandleChangeColor, onHandleDelete, stageStepCount, stepColor]);

  useImperativeHandle(ref, () => ({
    createNewColumn() {
      onHandleCreateStep(1);
    },
  }));

  useEffect(() => {
    if (stepItem.step?.bgColor) {
      setStepColor(stepItem.step.bgColor);
    }
  }, [stepItem.step?.bgColor]);

  return (
    <>
      {stepItem.isLoading ? (
        <div className={'step-draggable-item--loading'}>
          <div {...dragHandleProps} />
          <CustomLoader />
        </div>
      ) : (
        <div
          ref={stepItemRef}
          style={{
            backgroundColor: stepColor
              ? stepColor
              : columnColor
                ? lightenColor(columnColor, 20)
                : '#D9DFF2',
          }}
          className={'step-draggable-item'}>
          {!hasMergeItems && !isLayerModeOn ? (
            <StepColumnDrag
              columnColor={stepColor || columnColor}
              dragHandleProps={dragHandleProps}
            />
          ) : (
            <span {...dragHandleProps} />
          )}
          <div
            className={'step-draggable-item-content'}
            style={{
              width: '12.5rem',
            }}>
            <StepInput
              rowId={stepItem.id}
              index={index}
              columnId={stepItem.columnId!}
              updateStepColumn={data => {
                onHandleUpdateStepColumn({
                  value: data.value,
                  columnId: stepItem.columnId!,
                  id: stepItem.step?.id,
                });
              }}
              label={stepItem?.step?.name?.trim() || 'Untitled'}
              id={stepItem.step.id!}
              disabled={!!stepItem?.isDisabled}
              inputRef={inputRef}
              stepColor={
                stepColor ? stepColor : columnColor ? lightenColor(columnColor, 20) : '#D9DFF2'
              }
            />
          </div>

          <div className={'step-draggable-item--menu'}>
            {!isLayerModeOn && (
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
                item={stepItem}
                options={options}
                disabled={isGuest}
                buttonColor={stepColor || columnColor}
                sxStyles={{
                  display: 'inline-block',
                  background: 'transparent',
                }}
              />
            )}
          </div>

          {canAddNewItem && !isLayerModeOn && (
            <div className={'journey-map-step--new-step-button-block'}>
              <button
                aria-label={'plus'}
                className={'journey-map-step--new-step-button-block--button'}
                disabled={isGuest}
                onClick={() => onHandleCreateStep(index + 1)}>
                <span className={'wm-add'} />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
});

export default DraggableItem;
