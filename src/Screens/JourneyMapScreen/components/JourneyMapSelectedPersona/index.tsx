import { FC, useCallback, useMemo, useState } from 'react';

import './style.scss';
import {
  GetPinnedPersonaItemsQuery,
  useGetPinnedPersonaItemsQuery,
} from '@/api/queries/generated/getPinnedPersonaItems.generated.ts';
import { DemographicInfoTypeEnum } from '@/api/types.ts';
import PersonaImageBox from '@/Components/Feature/PersonaImageBox';
import { useSetQueryDataByKeyAdvanced } from '@/hooks/useQueryKey.ts';
import PinPersonaInfoSectionModal from '@/Screens/JourneyMapScreen/components/JourneyMapSelectedPersona/PinPersonaInfoSectionModal';
import {
  PinPersonaDemographicInfoType,
  PinPersonFieldSectionType,
} from '@/Screens/JourneyMapScreen/types.ts';
import ImageViewAndUpload from '@/Screens/PersonaScreen/components/PersonaLeftMenu/SectionField/ImageViewAndUpload';
import { useJourneyMapStore } from '@/store/journeyMap.ts';
import { ImageSizeEnum } from '@/types/enum';

const JourneyMapSelectedPersona = ({ mapId }: { mapId: number }) => {
  const {
    selectedJourneyMapPersona,
    isOpenSelectedJourneyMapPersonaInfo,
    updateIsOpenSelectedJourneyMapPersonaInfo,
  } = useJourneyMapStore();

  const setPinnedPersonaItemsQuery = useSetQueryDataByKeyAdvanced();

  const [isCollapseDemographics, setIsCollapseDemographics] = useState<boolean>(false);
  const [isOpenPersonaDetailsModal, setIsOpenPersonaDetailsModal] = useState<boolean>(false);

  const { data: dataPinnedPersonaItems } = useGetPinnedPersonaItemsQuery<
    GetPinnedPersonaItemsQuery,
    Error
  >(
    {
      pinnedPersonaItemsInput: {
        id: selectedJourneyMapPersona?.id as number,
        mapId,
      },
    },
    {
      enabled: !!selectedJourneyMapPersona,
    },
  );

  const demographicInfos = useMemo(
    () => dataPinnedPersonaItems?.getPinnedPersonaItems.demographicInfos || [],
    [dataPinnedPersonaItems?.getPinnedPersonaItems.demographicInfos],
  );
  const pinnedSections = useMemo(
    () => dataPinnedPersonaItems?.getPinnedPersonaItems.pinnedSections || [],
    [dataPinnedPersonaItems?.getPinnedPersonaItems.pinnedSections],
  );

  console.log(pinnedSections, 'pinnedSections');

  const onHandleAddPersonaInfoItem = useCallback(
    (newItem: PinPersonaDemographicInfoType) => {
      setPinnedPersonaItemsQuery(
        'GetPinnedPersonaItems',
        {
          input: 'pinnedPersonaItemsInput',
          key: 'id',
          value: selectedJourneyMapPersona?.id,
        },
        (oldData: GetPinnedPersonaItemsQuery) => {
          if (oldData) {
            return {
              getPinnedPersonaItems: {
                ...oldData.getPinnedPersonaItems,
                demographicInfos: [...oldData.getPinnedPersonaItems.demographicInfos, newItem],
              },
            };
          }
        },
      );
    },
    [selectedJourneyMapPersona?.id, setPinnedPersonaItemsQuery],
  );

  const onHandleRemovePersonaInfoItem = useCallback(
    (id: number) => {
      setPinnedPersonaItemsQuery(
        'GetPinnedPersonaItems',
        {
          input: 'pinnedPersonaItemsInput',
          key: 'id',
          value: selectedJourneyMapPersona?.id,
        },
        (oldData: GetPinnedPersonaItemsQuery) => {
          if (oldData) {
            return {
              getPinnedPersonaItems: {
                ...oldData.getPinnedPersonaItems,
                demographicInfos: oldData.getPinnedPersonaItems.demographicInfos.filter(
                  info => info.id !== id,
                ),
              },
            };
          }
        },
      );
    },
    [selectedJourneyMapPersona?.id, setPinnedPersonaItemsQuery],
  );

  const onHandleAddPersonaSectionItem = useCallback(
    (newItem: PinPersonFieldSectionType) => {
      setPinnedPersonaItemsQuery(
        'GetPinnedPersonaItems',
        {
          input: 'pinnedPersonaItemsInput',
          key: 'id',
          value: selectedJourneyMapPersona?.id,
        },
        (oldData: GetPinnedPersonaItemsQuery) => {
          if (oldData) {
            return {
              getPinnedPersonaItems: {
                ...oldData.getPinnedPersonaItems,
                pinnedSections: [...oldData.getPinnedPersonaItems.pinnedSections, newItem],
              },
            };
          }
        },
      );
    },
    [selectedJourneyMapPersona?.id, setPinnedPersonaItemsQuery],
  );

  const onHandleRemovePersonaSectionItem = useCallback(
    (id: number) => {
      setPinnedPersonaItemsQuery(
        'GetPinnedPersonaItems',
        {
          input: 'pinnedPersonaItemsInput',
          key: 'id',
          value: selectedJourneyMapPersona?.id,
        },
        (oldData: GetPinnedPersonaItemsQuery) => {
          if (oldData) {
            return {
              getPinnedPersonaItems: {
                ...oldData.getPinnedPersonaItems,
                pinnedSections: oldData.getPinnedPersonaItems.pinnedSections.filter(
                  info => info.section.id !== id,
                ),
              },
            };
          }
        },
      );
    },
    [selectedJourneyMapPersona?.id, setPinnedPersonaItemsQuery],
  );

  const togglePersonaDetailsModal = () => {
    setIsOpenPersonaDetailsModal(prev => !prev);
  };

  return (
    <div
      className={`${
        isOpenSelectedJourneyMapPersonaInfo
          ? 'journey-map-selected-persona'
          : 'journey-map-selected-persona-close'
      }`}>
      {isOpenPersonaDetailsModal && (
        <PinPersonaInfoSectionModal
          mapId={mapId}
          isOpen={isOpenPersonaDetailsModal}
          handleClose={togglePersonaDetailsModal}
          onHandleAddPersonaInfoItem={onHandleAddPersonaInfoItem}
          onHandleRemovePersonaInfoItem={onHandleRemovePersonaInfoItem}
          onHandleAddPersonaSectionItem={onHandleAddPersonaSectionItem}
          onHandleRemovePersonaSectionItem={onHandleRemovePersonaSectionItem}
        />
      )}
      <div className={'journey-map-selected-persona--info-block'}>
        <PersonaImageBox
          title={''}
          size={ImageSizeEnum.MDS}
          imageItem={{
            color: selectedJourneyMapPersona?.color || '',
            attachment: {
              id: selectedJourneyMapPersona?.attachment?.id || 0,
              url: selectedJourneyMapPersona?.attachment?.url || '',
              key: selectedJourneyMapPersona?.attachment?.key || '',
              croppedArea: selectedJourneyMapPersona?.croppedArea,
            },
          }}
        />

        <div className={'journey-map-selected-persona--info-block--name-type'}>
          <p className={'journey-map-selected-persona--info-block--name'}>
            {selectedJourneyMapPersona?.name}
          </p>
          <p className={'journey-map-selected-persona--info-block--type'}>
            {selectedJourneyMapPersona?.type?.toLowerCase()}
          </p>
        </div>

        <button
          aria-label={'Close'}
          className={'journey-map-selected-persona--info-block--close'}
          onClick={() => updateIsOpenSelectedJourneyMapPersonaInfo(false)}>
          <span className={'wm-close'} />
        </button>
        <button
          aria-label={'Settings'}
          className={'journey-map-selected-persona--info-block--settings'}
          onClick={togglePersonaDetailsModal}>
          <span className={'wm-settings'} />
        </button>
      </div>
      <div className={'journey-map-selected-persona--items-block'}>
        <div className={'journey-map-selected-persona--demographic-infos'}>
          <div className={'journey-map-selected-persona--demographic-infos--header'}>
            <p className={'journey-map-selected-persona--demographic-infos--header--title'}>
              Demographics
            </p>
            {demographicInfos.length ? (
              <button
                aria-label={'Collapse'}
                className={`journey-map-selected-persona--card--collapse-btn ${
                  isCollapseDemographics
                    ? 'journey-map-selected-persona--card--collapse-close-btn'
                    : 'journey-map-selected-persona--card--collapse-open-btn'
                }`}
                onClick={() => setIsCollapseDemographics(prev => !prev)}>
                <span className={'wm-keyboard-arrow-down'} />
              </button>
            ) : null}
          </div>
          <div
            className={`${isCollapseDemographics ? 'journey-map-selected-persona--close-demographic-infos' : 'journey-map-selected-persona--open-demographic-infos'}`}>
            <ul className={`journey-map-selected-persona--demographic-infos--list`}>
              {demographicInfos.length ? (
                demographicInfos.map(info => (
                  <li
                    className={'journey-map-selected-persona--demographic-infos--list-item'}
                    key={info.id}>
                    <span>{info.key}: </span>
                    {info.type === DemographicInfoTypeEnum.Content ? (
                      <span
                        className={'content-field-section'}
                        contentEditable={false}
                        dangerouslySetInnerHTML={{
                          __html: `<span>${info.key}: </span>` + info.value || 'N/A',
                        }}
                      />
                    ) : info.type === DemographicInfoTypeEnum.Image ? (
                      <ImageViewAndUpload
                        hasResizedVersions={!!info?.attachment?.hasResizedVersions}
                        croppedArea={info?.croppedArea || null}
                        avatarKey={
                          info?.attachment
                            ? `${info?.attachment?.url}/large${info?.attachment?.key}`
                            : ''
                        }
                        onlyView={true}
                      />
                    ) : (
                      <span>{info.value}</span>
                    )}
                  </li>
                ))
              ) : (
                <div>No data</div>
              )}
            </ul>
          </div>
        </div>
        <ul className={'journey-map-selected-persona--pinned-sections'}>
          {pinnedSections.map(section => (
            <PersonaPinnedSectionCard key={section.section.id} section={section.section} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default JourneyMapSelectedPersona;

interface IPersonaPinnedSectionCard {
  section: {
    id: number;
    key: string;
    color: string;
    content?: string | null;
  };
}

const PersonaPinnedSectionCard: FC<IPersonaPinnedSectionCard> = ({ section }) => {
  const [isCollapse, setIsCollapse] = useState<boolean>(false);

  return (
    <>
      <div
        className={'journey-map-selected-persona--pinned-section'}
        style={{
          backgroundColor: section.color,
        }}>
        <div className={'journey-map-selected-persona--pinned-section--header'}>
          <p className={'journey-map-selected-persona--pinned-section--header--title'}>
            {section.key}
          </p>
          <button
            aria-label={'Collapse'}
            className={`journey-map-selected-persona--card--collapse-btn ${
              isCollapse
                ? 'journey-map-selected-persona--card--collapse-close-btn'
                : 'journey-map-selected-persona--card--collapse-open-btn'
            }`}
            onClick={() => setIsCollapse(prev => !prev)}>
            <span className={'wm-keyboard-arrow-down'} />
          </button>
        </div>
        <div
          className={`${
            isCollapse
              ? 'journey-map-selected-persona--close-content'
              : 'journey-map-selected-persona--open-content'
          }`}>
          <div
            contentEditable={false}
            dangerouslySetInnerHTML={{ __html: section.content || '' }}
            className={'journey-map-selected-persona--pinned-section--content'}
          />
        </div>
      </div>
    </>
  );
};
