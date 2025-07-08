import React, { FC, useCallback } from 'react';

import './style.scss';

import { useParams } from 'next/navigation';

import Drawer from '@mui/material/Drawer';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';

import { useUpdateMap } from '@/containers/journey-map-container/hooks/useUpdateMap';
import AddUpdateOutcomeForm from '@/containers/outcome-container/add-update-outcome-item-modal/add-update-outcome-form';
import CloseIcon from '@/public/base-icons/close.svg';
import { mapAssignedPersonasState, selectedJourneyMapPersona } from '@/store/atoms/journeyMap.atom';
import { redoActionsState, undoActionsState } from '@/store/atoms/undoRedo.atom';
import {
  ActionsEnum,
  JourneyMapRowTypesEnum,
  OutcomeLevelEnum,
} from '@/utils/ts/enums/global-enums';
import {
  MapOutcomeItemType,
  OutcomeGroupItemType,
  OutcomeGroupType,
} from '@/utils/ts/types/outcome/outcome-type';

interface IOutcomeDrawer {
  workspaceId: number | null;
  singularNameType: string;
  isOpenDrawer: boolean;
  level: OutcomeLevelEnum;
  outcomeGroup: OutcomeGroupType | null;
  selectedColumnStepId: {
    columnId: number;
    stepId: number;
  } | null;
  selectedOutcome: MapOutcomeItemType | null;
  onHandleToggleOutcomeDrawer: () => void;
}

const OutcomeDrawer: FC<IOutcomeDrawer> = ({
  outcomeGroup,
  singularNameType,
  workspaceId,
  selectedColumnStepId,
  selectedOutcome,
  isOpenDrawer,
  onHandleToggleOutcomeDrawer,
}) => {
  const { mapID } = useParams();
  const { updateMapByType } = useUpdateMap();

  const mapAssignedPersonas = useRecoilValue(mapAssignedPersonasState);
  const selectedPersona = useRecoilValue(selectedJourneyMapPersona);
  const setUndoActions = useSetRecoilState(undoActionsState);
  const setRedoActions = useSetRecoilState(redoActionsState);

  const onHandleClose = useCallback(() => {
    onHandleToggleOutcomeDrawer();
  }, [onHandleToggleOutcomeDrawer]);

  const onHandleCreate = useCallback(
    (outcome: OutcomeGroupItemType) => {
      updateMapByType(JourneyMapRowTypesEnum.OUTCOMES, ActionsEnum.CREATE, {
        ...outcome,
        workspaceId,
      });
      setRedoActions([]);
      setUndoActions(undoPrev => [
        ...undoPrev,
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
    [onHandleClose, setRedoActions, setUndoActions, updateMapByType, workspaceId],
  );

  const onHandleUpdate = useCallback(
    (outcome: OutcomeGroupItemType) => {
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
        (selectedPersona && outcome.personaId !== selectedPersona.id)
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
      setRedoActions([]);
      setUndoActions(undoPrev => [
        ...undoPrev,
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
      selectedOutcome,
      selectedPersona,
      setRedoActions,
      setUndoActions,
      updateMapByType,
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
            <CloseIcon />
          </button>
        </div>
        <AddUpdateOutcomeForm
          workspaceId={workspaceId!}
          outcomeGroupId={outcomeGroup?.id!}
          defaultMapId={mapID ? +mapID : null}
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
