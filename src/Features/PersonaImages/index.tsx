import { FC, ReactNode, useMemo, useState } from 'react';

import './style.scss';

import { Tooltip } from '@mui/material';

import DeleteAssignedPersona from '@/Components/Feature/DeleteAssignedPersona';
import PersonaImageBox from '@/Components/Feature/PersonaImageBox';
import CustomLongMenu from '@/Components/Shared/CustomLongMenu';
import {
  ImageSizeEnum,
  MenuItemIconPositionEnum,
  MenuViewTypeEnum,
  SelectedPersonasViewModeEnum,
} from '@/types/enum.ts';

interface IPersonaImages {
  mapId: number;
  personas: PersonaType[];
  disconnectPersona?: (personaId: number) => void;
  handleSelectPersonaItem?: ((id: number) => void) | null;
  disabled?: boolean;
  sliceCount?: number;
  showFullItems?: boolean;
  addNewPersonaButton?: ReactNode;
  viewMode: SelectedPersonasViewModeEnum;
  disableDisconnect?: boolean;
}

const PersonaImages: FC<IPersonaImages> = ({
  mapId,
  personas,
  disconnectPersona,
  handleSelectPersonaItem,
  disabled,
  showFullItems,
  addNewPersonaButton,
  sliceCount = 3,
  viewMode,
  disableDisconnect,
}) => {
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState<boolean>(false);
  const [currentDisconnectedId, setCurrentDisconnectedId] = useState<number>();
  const [isMenuActive, setIsMenuActive] = useState<boolean>(false);

  const onMenuItemClick = (id: number) => {
    setCurrentDisconnectedId(id);
    setIsOpenConfirmationModal(true);
  };

  const options = useMemo(() => {
    return personas?.map(itm => {
      return {
        name: itm?.name,
        id: itm.id,
        icon: (
          <button onClick={() => onMenuItemClick(itm.id)}>
            <span className={'wm-delete'} />
          </button>
        ),
      };
    });
  }, [personas]);

  return (
    <div className={'persona-images'} onClick={e => e.stopPropagation()}>
      <DeleteAssignedPersona
        mapId={mapId}
        disconnectedId={currentDisconnectedId!}
        isOpen={isOpenConfirmationModal}
        handleClose={() => {
          setIsOpenConfirmationModal(false);
        }}
        disconnectPersona={disconnectPersona}
      />
      {!disabled && addNewPersonaButton}
      {personas?.slice(0, showFullItems ? personas.length : sliceCount)?.map((imageItem, index) => (
        <Tooltip
          key={index}
          title={disabled ? '' : imageItem?.name + ', ' + (imageItem?.type?.toLowerCase() || '')}
          placement="bottom"
          arrow>
          <div
            className={'persona-images--card'}
            style={{
              border:
                viewMode === SelectedPersonasViewModeEnum.SENTIMENT
                  ? 'transparent'
                  : `1px solid ${imageItem.isDisabledForThisRow ? '#1b87e6' : 'transparent'} `,
            }}>
            <div
              style={{
                opacity: imageItem.isDisabledForThisRow ? 0.3 : 1,
              }}>
              <PersonaImageBox
                title={''}
                imageItem={{
                  color: imageItem?.color || '#B052A7',
                  isSelected: true,
                  attachment: {
                    id: imageItem?.attachment?.id || '',
                    url: imageItem?.attachment?.url || '',
                    key: imageItem?.attachment?.key || '',
                    croppedArea: imageItem?.croppedArea,
                  },
                }}
                size={ImageSizeEnum.SM}
              />
            </div>

            {viewMode === SelectedPersonasViewModeEnum.SENTIMENT && (
              <button
                onClick={() => handleSelectPersonaItem && handleSelectPersonaItem(imageItem.id)}
                className={'persona-images--card--hide-show'}>
                {imageItem.isDisabledForThisRow ? (
                  <span
                    className={'wm-visibility'}
                    style={{
                      color: '#fffff',
                    }}
                  />
                ) : (
                  <span
                    className={'wm-visibility-off'}
                    style={{
                      color: '#fffff',
                    }}
                  />
                )}
              </button>
            )}
          </div>
        </Tooltip>
      ))}
      {!showFullItems && personas?.length > sliceCount && (
        <>
          <CustomLongMenu
            disabled={disableDisconnect}
            type={MenuViewTypeEnum.VERTICAL}
            menuItemIconPosition={MenuItemIconPositionEnum.END}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            onCloseFunction={() => {
              setIsMenuActive(false);
            }}
            rootStyles={{
              height: '10rem',
              marginLeft: '0',
              marginTop: '0',
            }}
            sxStyles={{ minWidth: '3rem', minHeight: '3rem' }}
            customButton={
              <div
                className={`more-items  ${isMenuActive ? 'active-menu-button' : ''}`}
                onClick={() => {
                  setIsMenuActive(true);
                }}>
                +{personas.length - sliceCount}
              </div>
            }
            options={options}
          />
        </>
      )}
    </div>
  );
};
export default PersonaImages;
