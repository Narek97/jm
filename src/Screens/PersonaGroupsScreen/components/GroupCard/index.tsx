import { FC, MouseEvent, useCallback } from 'react';

import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { useNavigate } from '@tanstack/react-router';

import {
  UpdatePersonaGroupMutation,
  useUpdatePersonaGroupMutation,
} from '@/api/mutations/generated/updatePersonaGroup.generated';
import PersonaImageBox from '@/Components/Feature/PersonaImageBox';
import EditableTitle from '@/Components/Shared/EditableTitle';
import ErrorBoundary from '@/Features/ErrorBoundary';
import useCardLayout from '@/Hooks/useWindowResize.ts';
import { PersonaGroupType } from '@/Screens/PersonaGroupsScreen/types.ts';
import { EditableInputType } from '@/types';
import { ImageSizeEnum } from '@/types/enum.ts';

interface IGroupCard {
  group: PersonaGroupType;
  workspaceId: string;
  onUpdatePersonaGroup: (data: EditableInputType) => void;
  onTogglePersonaGroupDeleteModal: (personaGroup: PersonaGroupType) => void;
}

const GroupCard: FC<IGroupCard> = ({
  group,
  workspaceId,
  onUpdatePersonaGroup,
  onTogglePersonaGroupDeleteModal,
}) => {
  const navigate = useNavigate();
  const { showToast } = useWuShowToast();

  const { maxCardNumber } = useCardLayout();

  const { mutate } = useUpdatePersonaGroupMutation<Error, UpdatePersonaGroupMutation>();

  const onNavigatePersonaPage = () => {
    navigate({
      to: `/workspace/${workspaceId}/persona-group/${group.id}`,
    }).then();
  };

  const onHandleUpdate = useCallback(
    (data: EditableInputType) => {
      mutate(
        {
          updatePersonaGroupInput: {
            id: group.id,
            name: data.value,
          },
        },
        {
          onSuccess: response => {
            onUpdatePersonaGroup({
              id: group.id,
              value: response.updatePersonaGroup.name,
            });
          },
          onError: error => {
            showToast({
              variant: 'error',
              message: error?.message,
            });
          },
        },
      );
    },
    [group.id, mutate, onUpdatePersonaGroup, showToast],
  );

  const onNavigateSinglePersonaPage = (e: MouseEvent<HTMLLIElement>, personaId: number) => {
    e.stopPropagation();
    navigate({
      to: `/workspace/${workspaceId}/persona/${personaId}`,
    }).then();
  };

  return (
    <div
      className={
        'card-borders flex gap-4 relative w-full h-[10.625rem] px-6 py-4 pl-3.5 mt-4 overflow-auto'
      }
      onClick={onNavigatePersonaPage}>
      <div className={'w-[14rem] max-w-[14rem]'}>
        <EditableTitle
          item={group}
          onHandleUpdate={onHandleUpdate}
          onHandleDelete={onTogglePersonaGroupDeleteModal}
          maxLength={100}
        />
      </div>
      <div className={'flex items-center gap-4'}>
        {group?.persona.length ? (
          <>
            <ul className={'flex gap-4'}>
              {group.persona.slice(0, maxCardNumber)?.map(persona => (
                <ErrorBoundary key={persona.id}>
                  <li
                    onClick={e => onNavigateSinglePersonaPage(e, persona.id)}
                    className={'w-[15rem] h-[8.5rem] px-6 py-4 pl-3.5 card-borders'}>
                    <div>
                      <p className={'font-[var(--font-weight-medium)] text-[var(--primary)]'}>
                        {persona.name}
                      </p>
                      <span className={'text-[0.75rem]'}>{persona.type?.toLocaleLowerCase()}</span>
                    </div>

                    <PersonaImageBox
                      title={''}
                      imageItem={{
                        color: '',
                        attachment: {
                          id: persona?.id,
                          url: persona?.attachment?.url || '',
                          key: persona?.attachment?.key || '',
                          croppedArea: persona?.croppedArea || {},
                        },
                      }}
                      size={ImageSizeEnum.SM}
                    />
                  </li>
                </ErrorBoundary>
              ))}
            </ul>
            {group?.persona.length > maxCardNumber && (
              <div className={'w-[15rem] h-[8.5rem] px-6 py-4 pl-3.5 card-borders'}>
                <span>And {group?.persona.length - maxCardNumber} more</span>
              </div>
            )}
          </>
        ) : (
          <div className={'group-card--no-persona-info'}>No persona yet</div>
        )}
      </div>
    </div>
  );
};

export default GroupCard;
