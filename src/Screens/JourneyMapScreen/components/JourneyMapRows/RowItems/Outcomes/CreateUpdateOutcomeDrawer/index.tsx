import { FC, useCallback } from 'react';

import './style.scss';

import Drawer from '@mui/material/Drawer';
import { v4 as uuidv4 } from 'uuid';

import { OutcomeType } from '@/Screens/JourneyMapScreen/components/JourneyMapRows/RowItems/Outcomes/types.ts';
import { useUpdateMap } from '@/Screens/JourneyMapScreen/hooks/useUpdateMap.tsx';
import { OutcomeGroupType } from '@/Screens/JourneyMapScreen/types.ts';
import AddUpdateOutcomeForm from '@/Screens/OutcomeScreen/components/AddUpdateOutcomeModal/AddUpdateOutcomeForm';
import { OutcomeGroupOutcomeType } from '@/Screens/OutcomeScreen/types.ts';
import { useJourneyMapStore } from '@/store/journeyMap.ts';
import { useUndoRedoStore } from '@/store/undoRedo.ts';
import { ActionsEnum, JourneyMapRowTypesEnum, OutcomeLevelEnum } from '@/types/enum';

interface IOutcomeDrawer {
  workspaceId: number | null;
  mapId: number;
  singularNameType: string;
  isOpenDrawer: boolean;
  outcomeGroup: OutcomeGroupOutcomeType | OutcomeGroupType;
  selectedColumnStepId: {
    columnId: number;
    stepId: number;
  } | null;
  selectedOutcome: OutcomeType | null;
  onHandleToggleOutcomeDrawer: () => void;
}

const OutcomeDrawer: FC<IOutcomeDrawer> = ({
  workspaceId,
  mapId,
  singularNameType,
  isOpenDrawer,
  outcomeGroup,
  selectedColumnStepId,
  selectedOutcome,
  onHandleToggleOutcomeDrawer,
}) => {
  const { updateMapByType } = useUpdateMap();

  const { mapAssignedPersonas, selectedJourneyMapPersona } = useJourneyMapStore();
  const { undoActions, updateUndoActions, updateRedoActions } = useUndoRedoStore();

  const onHandleClose = useCallback(() => {
    onHandleToggleOutcomeDrawer();
  }, [onHandleToggleOutcomeDrawer]);

  const onHandleCreate = useCallback(
    (outcome: OutcomeGroupOutcomeType) => {
      updateMapByType(JourneyMapRowTypesEnum.OUTCOMES, ActionsEnum.CREATE, {
        ...outcome,
        workspaceId,
      });
      updateRedoActions([]);
      updateUndoActions([
        ...undoActions,
        {
          id: uuidv4(),
          type: JourneyMapRowTypesEnum.OUTCOMES,
          action: ActionsEnum.DELETE,
          data: {
            ...outcome,
            workspaceId,
          },
        },
      ]);
      onHandleClose();
    },
    [
      onHandleClose,
      undoActions,
      updateMapByType,
      updateRedoActions,
      updateUndoActions,
      workspaceId,
    ],
  );

  const onHandleUpdate = useCallback(
    (outcome: OutcomeGroupOutcomeType) => {
      const mapAssignedPersona = mapAssignedPersonas.find(p => p.id === outcome.personaId);
      let subAction: ActionsEnum | null = null;

      if (
        outcome.stepId !== selectedOutcome?.stepId ||
        outcome.columnId !== selectedOutcome?.columnId
      ) {
        subAction = ActionsEnum['CREATE-DELETE'];
      }
      if (
        (outcome.personaId && !mapAssignedPersona?.isSelected) ||
        (selectedJourneyMapPersona && outcome.personaId !== selectedJourneyMapPersona.id)
      ) {
        subAction = ActionsEnum.DELETE;
      }

      updateMapByType(
        JourneyMapRowTypesEnum.OUTCOMES,
        ActionsEnum.UPDATE,
        {
          ...outcome,
          workspaceId,
          persona: mapAssignedPersona,
          previousTitle: selectedOutcome?.title,
          previousDescription: selectedOutcome?.description,
          previousRowId: selectedOutcome?.rowId || null,
          previousStepId: selectedOutcome?.stepId || null,
        },
        null,
        subAction,
      );
      updateRedoActions([]);
      updateUndoActions([
        ...undoActions,
        {
          id: uuidv4(),
          type: JourneyMapRowTypesEnum.OUTCOMES,
          action: ActionsEnum.UPDATE,
          data: {
            ...outcome,
            workspaceId,
            previousTitle: selectedOutcome?.title,
            previousDescription: selectedOutcome?.description,
            previousRowId: selectedOutcome?.rowId || null,
            previousStepId: selectedOutcome?.stepId || null,
          },
          subAction,
        },
      ]);

      onHandleClose();
    },
    [
      mapAssignedPersonas,
      onHandleClose,
      selectedJourneyMapPersona,
      selectedOutcome?.columnId,
      selectedOutcome?.description,
      selectedOutcome?.rowId,
      selectedOutcome?.stepId,
      selectedOutcome?.title,
      undoActions,
      updateMapByType,
      updateRedoActions,
      updateUndoActions,
      workspaceId,
    ],
  );

  return (
    <Drawer
      anchor={'left'}
      data-testid={'outcome-drawer-test-id'}
      open={isOpenDrawer}
      onClose={() => onHandleClose()}>
      <div className={'add-outcome-drawer'}>
        <div className={'add-outcome-drawer--header'}>
          <p className={'add-outcome-drawer--title'}>{singularNameType}</p>
          <button
            data-testid={'outcome-drawer-close-test-id'}
            className={'add-outcome-drawer--clos-btn'}
            onClick={onHandleClose}>
            <span className={'wm-close'} />
          </button>
        </div>
        <AddUpdateOutcomeForm
          workspaceId={workspaceId!}
          outcomeGroupId={outcomeGroup!.id}
          defaultMapId={mapId || null}
          level={OutcomeLevelEnum.MAP}
          selectedOutcome={selectedOutcome}
          selectedColumnStepId={selectedColumnStepId}
          create={onHandleCreate}
          update={onHandleUpdate}
          handleClose={onHandleClose}
        />
      </div>
    </Drawer>
  );
};

export default OutcomeDrawer;
