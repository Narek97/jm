import { FC, MouseEvent, useCallback, useTransition } from 'react';

import './style.scss';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { useNavigate } from '@tanstack/react-router';

import {
  UpdatePersonaGroupMutation,
  useUpdatePersonaGroupMutation,
} from '@/api/mutations/generated/updatePersonaGroup.generated';
import { PersonaGroup } from '@/api/types.ts';
import EditableTitle from '@/Components/Shared/EditableTitle';
import { useSetQueryDataByKey } from '@/hooks/useQueryKey';
import useWindowResize from '@/hooks/useWindowResize.ts';

interface IGroupCard {
  group: PersonaGroup;
  workspaceId: string;
  onTogglePersonaGroupDeleteModal: (personaGroup: PersonaGroup) => void;
}

const GroupCard: FC<IGroupCard> = ({ group, workspaceId, onTogglePersonaGroupDeleteModal }) => {
  const navigate = useNavigate();
  const { showToast } = useWuShowToast();

  const { maxCardNumber } = useWindowResize();

  const setPersonaGroupQueryData = useSetQueryDataByKey('GetPersonaGroupsWithPersonas');

  const { mutate } = useUpdatePersonaGroupMutation<Error, UpdatePersonaGroupMutation>();

  const onNavigatePersonaPage = () => {
    navigate({
      to: `/workspace/${workspaceId}/persona-group/${group.id}`,
    }).then();
  };

  const onHandleUpdate = useCallback(
    (data: EditableInputChangeType) => {
      mutate(
        {
          updatePersonaGroupInput: {
            id: group.id,
            name: data.value,
          },
        },
        {
          onSuccess: response => {
            setPersonaGroupQueryData((oldData: any) => {
              if (oldData) {
              }
            });
          },
          onError: (error: any) => {
            showToast({
              variant: 'error',
              message: error?.message,
            });
          },
        },
      );
    },
    [group.id, mutate, setPersonaGroupQueryData, showToast],
  );

  const onNavigateSinglePersonaPage = (e: MouseEvent<HTMLLIElement>, personaId: number) => {
    e.stopPropagation();
    navigate({
      to: `/workspace/${workspaceId}/persona/${personaId}`,
    }).then();
  };

  return (
    <div className={'group-card'} onClick={onNavigatePersonaPage}>
      <div className={'group-card--left'}>
        <EditableTitle
          item={group}
          onHandleUpdate={onHandleUpdate}
          onHandleDelete={onTogglePersonaGroupDeleteModal}
        />
      </div>
      <div className={'group-card--right'}>
        {group?.persona.length ? (
          <>
            <ul className={'group-card--right-personas'}>
              {group.persona.slice(0, maxCardNumber)?.map(persona => (
                <li
                  onClick={e => onNavigateSinglePersonaPage(e, persona.id)}
                  key={persona.id}
                  className={'group-card--persona-card'}>
                  <div>
                    <p className={'group-card--persona-card--name'}>{persona.name}</p>
                    <span className={'group-card--persona-card--type'}>
                      {persona.type?.toLocaleLowerCase()}
                    </span>
                  </div>

                  <PersonaImageBox
                    title={''}
                    imageItem={{
                      color: persona?.color || '',
                      attachment: {
                        url: persona?.attachment?.url || '',
                        key: persona?.attachment?.key || '',
                        croppedArea: persona?.croppedArea,
                      },
                    }}
                    size={ImageSizeEnum.SM}
                  />
                </li>
              ))}
            </ul>
            {group?.persona.length > maxCardNumber && (
              <div className={'group-card--persona-card'}>
                <span>and {group?.persona.length - maxCardNumber} more</span>
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
