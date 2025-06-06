import { FC, useCallback, useState } from 'react';

import './style.scss';
import { useWuShowToast, WuButton } from '@npm-questionpro/wick-ui-lib';
import { useNavigate } from '@tanstack/react-router';

import CustomInput from '@/Components/Shared/CustomInput';
import { TOKEN_NAME } from '@/constants';
import { PersonaInfoType } from '@/Screens/PersonaScreen/types.ts';
import { useBreadcrumbStore } from '@/store/breadcrumb.ts';
import { getCookie } from '@/utils/cookieHelper.ts';

interface IPersonaHeader {
  personaInfo: PersonaInfoType | null;
  workspaceId: number;
  isLoadingPersonaSection: boolean;
  onHandleUpdateInfo: (key: string, value: string) => void;
  onHandleAddSection: (layout: PersonSectionType | null) => void;
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
      variant: 'success',
      message: 'Download is in progress. It may take a few seconds.',
    });

    const url = `${import.meta.env.NEXT_PUBLIC_SOCKET_URL}/pdf/persona/${personaInfo?.id}`;

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
      });
    }
  };

  return (
    <div className={'persona-header'}>
      {/*{isOpenSelectedPersonasModal && (*/}
      {/*  <PersonaContainsJourneysModal*/}
      {/*    personaId={personaInfo?.id}*/}
      {/*    isOpen={isOpenSelectedPersonasModal}*/}
      {/*    handleClose={toggleJourneysModal}*/}
      {/*  />*/}
      {/*)}*/}
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
        <CustomInput
          data-testid={'persona-name-test-id'}
          type="text"
          autoFocus={true}
          placeholder={'name...'}
          value={personaInfo?.name}
          sxStyles={{
            '&:hover': {
              '& .MuiInput-underline::before': {
                borderBottom: `1px solid #D8D8D8 !important`,
              },
            },
            '& .MuiInput-underline:after': {
              borderBottom: `1px solid #1B87E6`,
            },
            background: '#ffffff',
            '& .MuiInput-input': {
              fontSize: '1.5rem',
              background: 'transparent',
            },
          }}
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
          <button
            onClick={toggleJourneysModal}
            className={`persona-header--right-block--journeys-btn `}>
            <div className={'persona-header--right-block--journeys-btn--icon'}>
              <span
                className="wm-map"
                style={{
                  color: '#1B87E6',
                }}
              />
            </div>
            <div className={'persona-header--right-block--journeys-btn-content'}>
              <span>{journeysCount}</span>
              <span>{journeysCount > 1 ? 'Journeys' : 'Journey'}</span>
            </div>
          </button>
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
