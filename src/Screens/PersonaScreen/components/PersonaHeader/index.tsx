import { FC, useCallback, useState } from 'react';

import './style.scss';
import { useWuShowToast, WuButton } from '@npm-questionpro/wick-ui-lib';
import { useNavigate } from '@tanstack/react-router';

import { PersonaInfoType, PersonaSectionType } from '../../types';

import BaseWuInput from '@/Components/Shared/BaseWuInput';
import { TOKEN_NAME } from '@/Constants';
import PersonaContainsJourneysModal from '@/Screens/PersonaScreen/components/PersonaContainsJourneysModal';
import { useBreadcrumbStore } from '@/Store/breadcrumb.ts';
import { getCookie } from '@/utils/cookieHelper.ts';

interface IPersonaHeader {
  personaInfo: PersonaInfoType | null;
  workspaceId: number;
  isLoadingPersonaSection: boolean;
  onHandleUpdateInfo: (key: string, value: string) => void;
  onHandleAddSection: (layout: PersonaSectionType | null) => void;
}

const PersonaHeader: FC<IPersonaHeader> = ({
  personaInfo,
  workspaceId,
  isLoadingPersonaSection,
  onHandleUpdateInfo,
  onHandleAddSection,
}) => {
  const token = getCookie(TOKEN_NAME);
  const { showToast } = useWuShowToast();
  const navigate = useNavigate();

  const { updateBreadcrumb } = useBreadcrumbStore();

  // todo : setPersonaInfo
  const [isOpenSelectedPersonasModal, setIsOpenSelectedPersonasModal] = useState<boolean>(false);
  console.log(isOpenSelectedPersonasModal, 'isOpenSelectedPersonasModal');
  const journeysCount = personaInfo?.journeys || 0;

  const onHandleGoBack = () => {
    navigate({
      to: `/workspace/${workspaceId}/persona-group/${personaInfo?.personaGroupId}`,
    }).then();
  };

  const toggleJourneysModal = useCallback(() => {
    setIsOpenSelectedPersonasModal(prev => !prev);
  }, []);

  const onHandleDownloadPdf = async () => {
    showToast({
      variant: 'info',
      message: 'Download is in progress. It may take a few seconds.',
      duration: 2000,
    });

    const url = `${import.meta.env.VITE_API_URL}/pdf/persona/${personaInfo?.id}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const blob = await response.blob();
      const link = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      link.href = objectUrl;
      link.download = `${personaInfo?.name}.pdf`;
      link.click();
      URL.revokeObjectURL(objectUrl);
    } else {
      const errorMessage = await response.text();

      showToast({
        variant: 'error',
        message: `Failed to download PDF | Message: ${JSON.parse(errorMessage).message || 'Not supported'}`,
        duration: 2000,
      });
    }
  };

  return (
    <div className={'persona-header'}>
      {isOpenSelectedPersonasModal && (
        <PersonaContainsJourneysModal
          personaId={personaInfo?.id as number}
          isOpen={isOpenSelectedPersonasModal}
          handleClose={toggleJourneysModal}
        />
      )}
      <div className={'persona-header--left-block'}>
        <button
          aria-label={'Back'}
          className={'persona-header--go-back-btn'}
          onClick={onHandleGoBack}>
          <span
            className={'wm-arrow-back'}
            style={{
              color: '#1B87E6',
            }}
          />
        </button>
        <BaseWuInput
          data-testid={'persona-name-test-id'}
          type="text"
          autoFocus={true}
          placeholder={'name...'}
          value={personaInfo?.name}
          onChange={e => {
            onHandleUpdateInfo('name', e.target.value);
            updateBreadcrumb(3, { name: e.target.value });
          }}
          onKeyDown={event => {
            if (event.keyCode === 13) {
              event.preventDefault();
              (event.target as HTMLElement).blur();
            }
          }}
        />
      </div>
      <div className={'persona-header--right-block'}>
        {journeysCount > 0 && (
          <WuButton
            Icon={
              <span
                className="wm-map"
                style={{
                  color: '#1B87E6',
                }}
              />
            }
            color="primary"
            iconPosition="left"
            onClick={toggleJourneysModal}
            size="md"
            variant="secondary">
            <span>{journeysCount}</span>
            <span>{journeysCount > 1 ? 'Journeys' : 'Journey'}</span>
          </WuButton>
        )}
        <WuButton
          Icon={<span className="wm-add" />}
          iconPosition="left"
          data-testid={'add-section-test-id'}
          aria-label={'add section'}
          onClick={() => onHandleAddSection(null)}
          variant={'secondary'}
          disabled={isLoadingPersonaSection}>
          Add card
        </WuButton>
        <button
          data-testid={'download-persona-test-id'}
          aria-label={'add section'}
          className={'persona-header--download-section-btn'}
          onClick={() => onHandleDownloadPdf()}
          disabled={isLoadingPersonaSection}>
          <span className="wm-download" />
        </button>
      </div>
    </div>
  );
};

export default PersonaHeader;
