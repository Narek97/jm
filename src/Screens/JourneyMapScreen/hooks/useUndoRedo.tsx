import { useCallback, useEffect } from 'react';

import { useIsFetching, useIsMutating } from '@tanstack/react-query';

import { useUpdateMap } from './useUpdateMap';

import { useUndoRedoStore } from '@/Store/undoRedo.ts';
import { ActionsEnum, UndoRedoEnum } from '@/types/enum.ts';

const actions = {
  [ActionsEnum.CREATE]: ActionsEnum.DELETE,
  [ActionsEnum.DELETE]: ActionsEnum.CREATE,
  [ActionsEnum.UNMERGE]: ActionsEnum.MERGE,
  [ActionsEnum.MERGE]: ActionsEnum.UNMERGE,
  [ActionsEnum.UPDATE]: ActionsEnum.UPDATE,
  [ActionsEnum.DRAG]: ActionsEnum.DRAG,
  [ActionsEnum.DISABLE]: ActionsEnum.DISABLE,
  [ActionsEnum.ENABLE]: ActionsEnum.ENABLE,
  [ActionsEnum.ADD_MERGE_ID]: ActionsEnum.ADD_MERGE_ID,
  [ActionsEnum.DELETE_MERGE_ID]: ActionsEnum.DELETE_MERGE_ID,
  [ActionsEnum['CREATE-DELETE']]: ActionsEnum['CREATE-DELETE'],
  [ActionsEnum['COLOR-CHANGE']]: ActionsEnum['COLOR-CHANGE'],
};

export const useUndoRedo = () => {
  const { updateMapByType } = useUpdateMap();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const { undoActions, redoActions, updateUndoActions, updateRedoActions } = useUndoRedoStore();

  const handleUndo = useCallback(async () => {
    const item = undoActions[undoActions.length - 1];
    if (item && !isFetching && !isMutating) {
      updateUndoActions(undoActions.filter(p => p.id !== item.id));
      updateRedoActions([...redoActions, { ...item, action: actions[item.action] }]);
      updateMapByType(
        item.type,
        item.action,
        { ...item.data, parentId: item.id },
        UndoRedoEnum.UNDO,
        item.subAction,
      );
    }
  }, [
    isFetching,
    isMutating,
    redoActions,
    undoActions,
    updateMapByType,
    updateRedoActions,
    updateUndoActions,
  ]);

  const handleRedo = useCallback(async () => {
    const item = redoActions[redoActions.length - 1];
    if (item && !isFetching && !isMutating) {
      updateRedoActions(redoActions.filter(p => p.id !== item.id));
      updateUndoActions([...undoActions, { ...item, action: actions[item.action] }]);
      updateMapByType(
        item.type,
        item.action,
        { ...item.data, parentId: item.id },
        UndoRedoEnum.REDO,
        item.subAction,
      );
    }
  }, [
    isFetching,
    isMutating,
    redoActions,
    undoActions,
    updateMapByType,
    updateRedoActions,
    updateUndoActions,
  ]);

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

      if (isMac) {
        const isUndo = (event.ctrlKey || event.metaKey) && event.key === 'z';

        if (isUndo) {
          if (event.shiftKey) {
            await handleRedo();
            event.stopPropagation();
            event.preventDefault();
            // Ctrl + Shift + Z or Cmd + Shift + Z
          } else {
            await handleUndo();
            event.stopPropagation();
            event.preventDefault();
            // Ctrl + Z or Cmd + Z
          }
        }
      } else {
        const isUndo = (event.ctrlKey || event.metaKey) && event.key === 'z';
        const isRedo = event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'z';
        if (isUndo) {
          await handleUndo();
          event.stopPropagation();
          event.preventDefault();
          // Ctrl + Z or Cmd + Z
        }
        if (isRedo) {
          await handleRedo();
          event.stopPropagation();
          event.preventDefault();
          // Ctrl + Shift + Z or Cmd + Shift + Z
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleRedo, handleUndo]);

  return { handleUndo, handleRedo };
};
