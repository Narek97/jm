import { FC, memo, useCallback, useMemo } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { useCopyPersonaMutation } from '@/api/mutations/generated/copyPersona.generated.ts';
import PersonaImageBox from '@/Components/Feature/PersonaImageBox';
import BaseWuMenu from '@/Components/Shared/BaseWuMenu';
import CropImage from '@/Components/Shared/CropImage';
import { IMAGE_ASPECT } from '@/Constants';
import { PERSONA_OPTIONS } from '@/Screens/PersonaGroupScreen/constnats.tsx';
import { PersonaType } from '@/Screens/PersonaGroupScreen/types.ts';
import { ImageSizeEnum } from '@/types/enum.ts';
import { getResizedFileName } from '@/utils/getResizedFileName.ts';

interface IPersonaCard {
  persona: PersonaType;
  workspaceId: number;
  onToggleDeletePersonaModal: (persona?: PersonaType) => void;
}

const PersonaCard: FC<IPersonaCard> = memo(
  ({ persona, workspaceId, onToggleDeletePersonaModal }) => {
    const navigate = useNavigate();

    const { mutate: copyPersona } = useCopyPersonaMutation({
      onSuccess: response => {
        navigate({
          to: `/workspace/${workspaceId}/persona/${response.copyPersona}`,
        }).then();
      },
    });

    const onHandleNavigate = useCallback(() => {
      navigate({
        to: `/workspace/${workspaceId}/persona/${persona.id}`,
      }).then();
    }, [navigate, persona.id, workspaceId]);

    const onHandleCopy = useCallback(() => {
      copyPersona({
        copyPersonaInput: {
          personaId: persona.id,
        },
      });
    }, [copyPersona, persona.id]);

    const options = useMemo(() => {
      return PERSONA_OPTIONS({
        onHandleEdit: onHandleNavigate,
        onHandleCopy: onHandleCopy,
        onHandleDelete: onToggleDeletePersonaModal,
      });
    }, [onHandleCopy, onHandleNavigate, onToggleDeletePersonaModal]);

    return (
      <li
        className={'group card-borders w-[17.75rem] h-[17rem] px-4 py-0'}
        onClick={onHandleNavigate}
        id={persona.id.toString()}
        data-testid={`persona-card-${persona.id}`}>
        <div className={'absolute right-2 top-2 invisible group-hover:visible!'}>
          <BaseWuMenu item={persona} options={options} />
        </div>
        <div className={'flex items-center justify-center h-40'}>
          {persona?.croppedArea ? (
            <div
              className={'persona-cropped-image'}
              style={{ borderColor: persona?.color || '#545e6b' }}>
              <CropImage
                imageSource={`${import.meta.env.VITE_AWS_URL}/${persona?.attachment?.url}/large${persona.attachment?.hasResizedVersions ? getResizedFileName(persona?.attachment?.key, IMAGE_ASPECT) : persona?.attachment?.key}`}
                croppedArea={persona?.croppedArea}
                CROP_AREA_ASPECT={3 / 3}
              />
            </div>
          ) : (
            <PersonaImageBox
              title={''}
              imageItem={{
                color: persona?.color || '',
                attachment: {
                  id: persona?.attachment?.id || 0,
                  url: persona?.attachment?.url || '',
                  key: persona?.attachment?.key || '',
                  croppedArea: persona?.croppedArea,
                },
              }}
              size={ImageSizeEnum.LG}
            />
          )}
        </div>

        <div>
          <p className={'reduce-text text-[var(--primary)] font-[var(--font-weight-medium)]'}>
            {persona.name}
          </p>
          <p className={'text-[0.75rem]'}>{persona.type?.toLocaleLowerCase()}</p>
        </div>

        <div className={'flex items-center gap-1 mt-8! text-xs'}>
          <span className="wm-map" />
          <span>
            {persona.journeys || 0}{' '}
            {persona.journeys && persona.journeys > 1 ? 'Journeys' : 'Journey'}
          </span>
        </div>
      </li>
    );
  },
);

export default PersonaCard;
