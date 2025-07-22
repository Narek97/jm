import { FC, memo, useCallback, useMemo } from 'react';

import './style.scss';
import { useNavigate } from '@tanstack/react-router';

import { useCopyPersonaMutation } from '@/api/mutations/generated/copyPersona.generated.ts';
import PersonaImageBox from '@/Components/Feature/PersonaImageBox';
import CropImage from '@/Components/Shared/CropImage';
import CustomLongMenu from '@/Components/Shared/CustomLongMenu';
import { IMAGE_ASPECT } from '@/Constants';
import { PERSONA_OPTIONS } from '@/Screens/PersonaGroupScreen/constnats.tsx';
import { PersonaType } from '@/Screens/PersonaGroupScreen/types.ts';
import { ImageSizeEnum, MenuViewTypeEnum } from '@/types/enum.ts';
import { getResizedFileName } from '@/utils/getResizedFileName.ts';

interface IPersonaCard {
  persona: PersonaType;
  workspaceId: number;
  onToggleDeletePersonaModal: (persona: PersonaType) => void;
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
      <>
        <li
          className={'persona-card'}
          onClick={onHandleNavigate}
          id={persona.id.toString()}
          data-testid={`persona-card-${persona.id}`}>
          <div className={'persona-card--menu'}>
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
              item={persona}
              options={options}
              sxStyles={{
                display: 'inline-block',
                background: 'transparent',
              }}
            />
          </div>
          <div className={'persona-card--frame-block'}>
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

          <div className={'persona-card--info'}>
            <p className={'persona-card--info--name'}>{persona.name}</p>
            <p className={'persona-card--info--type'}>{persona.type?.toLocaleLowerCase()}</p>
          </div>

          <div className={'persona-card--footer'}>
            <div className={'persona-card--footer--journies'}>
              <span className="wm-map" />
              <span>
                {persona.journeys || 0}{' '}
                {persona.journeys && persona.journeys > 1 ? 'Journeys' : 'Journey'}
              </span>
            </div>

            <div className={'persona-card--emotion'}></div>
          </div>
        </li>
      </>
    );
  },
);

export default PersonaCard;
