import { FC, useEffect } from 'react';

import './style.scss';

import { ClickAwayListener } from '@mui/material';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';

import {
  CreateOrUpdateNoteMutation,
  useCreateOrUpdateNoteMutation,
} from '@/api/mutations/generated/createUpdateNote.generated.ts';
import {
  GetItemNoteQuery,
  useGetItemNoteQuery,
} from '@/api/queries/generated/getItemNote.generated.ts';
import { CommentAndNoteModelsEnum } from '@/api/types';
import CustomInput from '@/Components/Shared/CustomInput';
import CustomLoader from '@/Components/Shared/CustomLoader';
import { debounced800 } from '@/hooks/useDebounce.ts';
import { useSetQueryDataByKeyAdvanced } from '@/hooks/useQueryKey.ts';
import { useNote, useSetNote } from '@/store/note.ts';

interface IJourneyMapCardNote {
  itemId: number;
  stepId: number;
  rowId: number;
  type: CommentAndNoteModelsEnum;
  onClickAway: (e: any) => void;
}

const JourneyMapCardNote: FC<IJourneyMapCardNote> = ({
  itemId,
  stepId,
  rowId,
  type,
  onClickAway,
}) => {
  const { showToast } = useWuShowToast();

  const note = useNote(type, itemId);
  const setNote = useSetNote();

  const setNoteQuery = useSetQueryDataByKeyAdvanced();

  const { data: dataNote, isLoading: isLoadingNote } = useGetItemNoteQuery<GetItemNoteQuery, Error>(
    {
      getItemNoteInput: {
        itemId,
        rowId,
        stepId,
        itemType: type,
      },
    },
    {
      enabled: !!itemId,
    },
  );
  const { mutate: createOrUpdate } = useCreateOrUpdateNoteMutation<
    Error,
    CreateOrUpdateNoteMutation
  >({
    onSuccess: () => {
      setNoteQuery(
        'GetItemNote',
        {
          input: 'getItemNoteInput',
          key: 'itemId',
          value: itemId,
        },
        (oldData: any) => {
          if (oldData) {
            return {
              ...oldData,
              getItemNote: {
                ...oldData.getItemNote,
                text: note?.text || '',
              },
            };
          }
        },
      );
    },
    onError: async () => {
      showToast({
        variant: 'warning',
        message: `Text cannot be longer than 255 symbols`,
      });
    },
  });

  const createOrUpdateNote = (text: string) => {
    if (note) {
      setNote(type, itemId, { ...note, text });
    }
    debounced800(() => {
      createOrUpdate({
        createOrUpdateNoteInput: {
          rowId,
          stepId,
          itemType: type,
          itemId,
          text,
        },
      });
    });
  };

  useEffect(() => {
    setNote(type, itemId, dataNote?.getItemNote || null);
  }, [dataNote?.getItemNote, itemId, setNote, type]);

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <div
        onClick={e => {
          e.stopPropagation();
        }}
        className={'note-section'}
        data-testid={`note-${itemId}-test-id`}>
        {isLoadingNote ? (
          <CustomLoader />
        ) : (
          <>
            <div className="note-section--content">
              <div className="note-section--content--icon">
                <span className={'wm-add-notes'} />
              </div>
              <div className="note-section--content--max-length">
                <span>{note?.text.length} / 255</span>
              </div>
              <CustomInput
                maxRows={2}
                maxLength={255}
                multiline={true}
                autoFocus={true}
                onFocus={e => {
                  e.currentTarget.setSelectionRange(
                    e.currentTarget.value.length,
                    e.currentTarget.value.length,
                  );
                }}
                data-testid="note-test-id"
                placeholder={'Note'}
                sxStyles={{
                  background: 'transparent',
                  '& .Mui-focused': {
                    backgroundColor: '#FFF3C2',
                  },
                  '& .MuiInputBase-formControl,textarea': {
                    padding: '0 !important',
                  },
                }}
                value={note?.text}
                onChange={e => createOrUpdateNote(e?.target?.value)}
                // onKeyDown={event => {
                //   if (event.keyCode === 13) {
                //     event.preventDefault();
                //     (event.target as HTMLElement).blur();
                //   }
                // }}
              />
            </div>
          </>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default JourneyMapCardNote;
