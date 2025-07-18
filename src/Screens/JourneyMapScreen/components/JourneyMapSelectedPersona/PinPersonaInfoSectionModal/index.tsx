import { FC, useMemo } from 'react';

import './style.scss';

import { Tooltip } from '@mui/material';

import {
  PinDemographicInfoMutation,
  usePinDemographicInfoMutation,
} from '@/api/mutations/generated/pinDemographicInfo.generated.ts';
import {
  PinPersonaSectionMutation,
  usePinPersonaSectionMutation,
} from '@/api/mutations/generated/pinPersonaSection.generated';
import { useGetPersonaDemographicInfosQuery } from '@/api/queries/generated/getPersonaDemographicInfos.generated';
import { GetPersonaDemographicInfosQuery } from '@/api/queries/generated/getPersonaDemographicInfos.generated.ts';
import {
  GetPersonaSectionsQuery,
  useGetPinPersonaSectionsQuery,
} from '@/api/queries/generated/getPersonaSections.generated.ts';
import { DemographicInfoTypeEnum } from '@/api/types.ts';
import PersonaImageBox from '@/Components/Feature/PersonaImageBox';
import CustomModal from '@/Components/Shared/CustomModal';
import CustomModalHeader from '@/Components/Shared/CustomModalHeader';
import WuBaseLoader from '@/Components/Shared/WuBaseLoader';
import { useSetQueryDataByKeyAdvanced } from '@/hooks/useQueryKey.ts';
import {
  PersonaDemographicInfoType,
  PersonSectionType,
  PinPersonaDemographicInfoType,
  PinPersonFieldSectionType,
} from '@/Screens/JourneyMapScreen/types.ts';
import ImageViewAndUpload from '@/Screens/PersonaScreen/components/PersonaLeftMenu/SectionField/ImageViewAndUpload';
import { useJourneyMapStore } from '@/store/journeyMap.ts';
import { ImageSizeEnum } from '@/types/enum';
import { getDemographicFiledKey } from '@/utils/getDemographicFiledKey.ts';
import { getTextColorBasedOnBackground } from '@/utils/getTextColorBasedOnBackground.ts';

interface IPinPersonaInfoSectionModal {
  mapId: number;
  isOpen: boolean;
  handleClose: () => void;
  onHandleAddPersonaInfoItem: (newItem: PinPersonaDemographicInfoType) => void;
  onHandleRemovePersonaInfoItem: (id: number) => void;
  onHandleAddPersonaSectionItem: (newItem: PinPersonFieldSectionType) => void;
  onHandleRemovePersonaSectionItem: (id: number) => void;
}

const PinPersonaInfoSectionModal: FC<IPinPersonaInfoSectionModal> = ({
  mapId,
  isOpen,
  handleClose,
  onHandleAddPersonaInfoItem,
  onHandleRemovePersonaInfoItem,
  onHandleAddPersonaSectionItem,
  onHandleRemovePersonaSectionItem,
}) => {
  const { selectedJourneyMapPersona } = useJourneyMapStore();

  const setPersonaDemographicInfosQuery = useSetQueryDataByKeyAdvanced();
  const setPinPersonaSectionsQuery = useSetQueryDataByKeyAdvanced();

  const { data: dataDemographicInfos, isFetching: isFetchingDemographicInfos } =
    useGetPersonaDemographicInfosQuery<GetPersonaDemographicInfosQuery, Error>(
      {
        getPersonaDemographicInfosInput: {
          personaId: +selectedJourneyMapPersona!.id,
          mapId,
        },
      },
      {
        enabled: !!selectedJourneyMapPersona,
      },
    );

  const personaFieldSections = useMemo(
    () => dataDemographicInfos?.getPersonaDemographicInfos.personaFieldSections || [],
    [dataDemographicInfos?.getPersonaDemographicInfos.personaFieldSections],
  );

  const demographicInfoFields = useMemo(
    () => dataDemographicInfos?.getPersonaDemographicInfos.demographicInfoFields || [],
    [dataDemographicInfos?.getPersonaDemographicInfos.demographicInfoFields],
  );

  const { data: dataPersonaSections, isFetching: isFetchingPersonaSections } =
    useGetPinPersonaSectionsQuery<GetPersonaSectionsQuery, Error>(
      {
        getPersonaSectionsInput: {
          personaId: +selectedJourneyMapPersona!.id,
          mapId,
        },
      },
      {
        enabled: !!selectedJourneyMapPersona,
      },
    );

  const personaSections = useMemo(
    () => dataPersonaSections?.getPersonaSections || [],
    [dataPersonaSections?.getPersonaSections],
  );

  const { mutate: mutatePinDemographicInfo } = usePinDemographicInfoMutation<
    Error,
    PinDemographicInfoMutation
  >();

  const { mutate: mutatePinPersonaSection } = usePinPersonaSectionMutation<
    Error,
    PinPersonaSectionMutation
  >();

  const onHandleInfoSelect = (info: PersonaDemographicInfoType) => {
    const categoryType = getDemographicFiledKey(info.type);
    mutatePinDemographicInfo({
      pinDemographicInfoInput: {
        id: info.id,
        mapId,
      },
    });
    if (info.isPinned) {
      onHandleRemovePersonaInfoItem(info.id);
    } else {
      onHandleAddPersonaInfoItem({
        id: info.id,
        key: info.key,
        type: info.type,
        value: info.value || '',
        attachment: undefined,
        croppedArea: undefined,
      });
    }

    setPersonaDemographicInfosQuery(
      'GetPersonaDemographicInfos',
      {
        input: 'getPersonaDemographicInfosInput',
        key: 'personaId',
        value: selectedJourneyMapPersona!.id,
      },
      (oldData: GetPersonaDemographicInfosQuery) => {
        return {
          getPersonaDemographicInfos: {
            ...oldData.getPersonaDemographicInfos,
            [categoryType]: oldData.getPersonaDemographicInfos[categoryType].map(prevInfo => {
              if (prevInfo.id === info.id) {
                return {
                  ...prevInfo,
                  isPinned: !prevInfo.isPinned,
                };
              }
              return prevInfo;
            }),
          },
        };
      },
    );
  };

  const onHandleSectionSelect = (section: PersonSectionType) => {
    mutatePinPersonaSection({
      pinSectionInput: {
        id: section.id,
        mapId,
      },
    });

    setPinPersonaSectionsQuery(
      'GetPinPersonaSections',
      {
        input: 'getPersonaSectionsInput',
        key: 'personaId',
        value: selectedJourneyMapPersona!.id,
      },
      (oldData: GetPersonaSectionsQuery) => {
        return {
          getPersonaSections: oldData.getPersonaSections.map(prevSection => {
            if (prevSection.id === section.id) {
              if (prevSection.isPinned) {
                onHandleRemovePersonaSectionItem(section.id);
              } else {
                onHandleAddPersonaSectionItem({
                  id: section.id,
                  w: section.w,
                  h: section.h,
                  x: section.x,
                  y: section.y,
                  i: section.i,
                  section: {
                    id: section.id,
                    key: section.key,
                    color: section.color,
                    content: section.content,
                  },
                });
              }
              prevSection.isPinned = !prevSection.isPinned;
            }

            return prevSection;
          }),
        };
      },
    );
  };

  return (
    <CustomModal
      isOpen={isOpen}
      handleClose={handleClose}
      canCloseWithOutsideClick={true}
      modalSize={'custom'}>
      <CustomModalHeader title={'Show/hide persona details'} />
      <div className={'pin-persona-info-section'}>
        {isFetchingDemographicInfos || isFetchingPersonaSections ? (
          <WuBaseLoader />
        ) : (
          <div
            className={'pin-persona-info-section--content'}
            data-testid={'pin-persona-info-section-test-id'}>
            <div className={'pin-persona-info-section--info-block'}>
              <div className={'pin-persona-info-section--info-block--img-block'}>
                <PersonaImageBox
                  title={''}
                  size={ImageSizeEnum.MDS}
                  imageItem={{
                    color: selectedJourneyMapPersona?.color || '',
                    attachment: {
                      id: selectedJourneyMapPersona?.attachment?.id || 0,
                      url: selectedJourneyMapPersona?.attachment?.url || '',
                      key: selectedJourneyMapPersona?.attachment?.key || '',
                      croppedArea: selectedJourneyMapPersona?.attachment?.croppedArea,
                    },
                  }}
                />
                <div className={'pin-persona-info-section--info-block--type-journeys-block'}>
                  <Tooltip title={selectedJourneyMapPersona?.name} arrow placement={'bottom'}>
                    <p className={'pin-persona-info-section--persona-name'}>
                      {selectedJourneyMapPersona?.name}
                    </p>
                  </Tooltip>
                  <p className={'pin-persona-info-section--info-block--persona-type'}>
                    {selectedJourneyMapPersona?.type}
                  </p>
                  <p className={'pin-persona-info-section--info-block--persona-journeys'}>
                    {selectedJourneyMapPersona?.journeys} Journey
                    {selectedJourneyMapPersona?.journeys || 0 > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className={'pin-persona-info-section--divider'} />
              <div className={'pin-persona-info-section--info-block--demographic-info-block'}>
                <p
                  className={'pin-persona-info-section--info-block--demographic-info-block--title'}>
                  Demographic
                </p>
                {!demographicInfoFields.length && !personaFieldSections.length ? (
                  <p>No demographic to show</p>
                ) : (
                  <ul
                    data-testid={'demographic-infos-list'}
                    className={'pin-persona-info-section--info-block--demographic-infos'}>
                    {demographicInfoFields.map((info, index) => (
                      <li
                        key={info.id}
                        className={`pin-persona-info-section--info-block--demographic-info ${
                          info.value
                            ? ''
                            : 'pin-persona-info-section--info-block--demographic-info-disabled'
                        }`}
                        data-testid="pin-persona-info-test-id"
                        onClick={() => info.value && onHandleInfoSelect(info)}>
                        <Tooltip title={info.value} key={info.id} placement="right" arrow>
                          <span>
                            {info.key}: {info.value || 'N/A'}
                          </span>
                        </Tooltip>

                        <button data-testid={'hide-show-info'}>
                          {info.isPinned ? (
                            <span
                              className={'wm-visibility'}
                              data-testid={`pin-persona-info-${index}-eye-test-id`}
                            />
                          ) : (
                            <span
                              className={'wm-visibility-off'}
                              data-testid={`pin-persona-info-${index}-close-eye-test-id`}
                            />
                          )}
                        </button>
                      </li>
                    ))}

                    {personaFieldSections.map((info, index) => (
                      <li
                        key={info.id}
                        className={`pin-persona-info-section--info-block--demographic-info ${
                          (DemographicInfoTypeEnum.Content && info.value) ||
                          (DemographicInfoTypeEnum.Image && info.attachment)
                            ? ''
                            : 'pin-persona-info-section--info-block--demographic-info-disabled'
                        }`}
                        data-testid="pin-persona-info-test-id"
                        onClick={() => {
                          if (
                            (DemographicInfoTypeEnum.Content && info.value) ||
                            (DemographicInfoTypeEnum.Image && info.attachment)
                          ) {
                            onHandleInfoSelect(info);
                          }
                        }}>
                        <Tooltip
                          title={
                            info.type === DemographicInfoTypeEnum.Content ? (
                              <span
                                className={'content-field-section'}
                                contentEditable={false}
                                dangerouslySetInnerHTML={{
                                  __html: `<span>${info.key}: </span>` + info.value || 'N/A',
                                }}
                              />
                            ) : (
                              'Image file'
                            )
                          }
                          key={info.id}
                          placement="right"
                          arrow>
                          {info.type === DemographicInfoTypeEnum.Content ? (
                            <span
                              className={'content-field-section'}
                              contentEditable={false}
                              dangerouslySetInnerHTML={{
                                __html: `<span>${info.key}: </span>` + info.value || 'N/A',
                              }}
                            />
                          ) : (
                            <span>
                              <span>{info.key}: </span>
                              {info?.attachment ? (
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
                                'N/A'
                              )}
                            </span>
                          )}
                        </Tooltip>

                        <button data-testid={'hide-show-info'}>
                          {info.isPinned ? (
                            <span
                              className={'wm-visibility'}
                              data-testid={`pin-persona-info-${index}-eye-test-id`}
                            />
                          ) : (
                            <span
                              className={'wm-visibility-off'}
                              data-testid={`pin-persona-info-${index}-close-eye-test-id`}
                            />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <ul className={'pin-persona-info-section--section-block'}>
              {personaSections.map((section, index) => (
                <li
                  key={section.id}
                  style={{
                    opacity: section.isPinned ? 1 : 0.5,
                    backgroundColor: section.color,
                    color: getTextColorBasedOnBackground(section.color || '#000000'),
                  }}
                  data-testid="pin-persona-section-test-id"
                  onClick={() => onHandleSectionSelect(section)}
                  className={'pin-persona-info-section--section-block--section'}>
                  <span className={'pin-persona-info-section--section-block--section--pinned-btn'}>
                    {section.isPinned ? (
                      <span
                        className={'wm-visibility'}
                        data-testid={`pin-persona-section-${index}-eye-test-id`}
                      />
                    ) : (
                      <span
                        className={'wm-visibility-off'}
                        data-testid={`pin-persona-section-${index}-close-eye-test-id`}
                      />
                    )}
                  </span>

                  <p className={'pin-persona-info-section--section-block--section--title'}>
                    {section.key}
                  </p>
                  <div
                    contentEditable={false}
                    dangerouslySetInnerHTML={{ __html: section.content || '' }}
                    className={'pin-persona-info-section--section-block--section--content'}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </CustomModal>
  );
};

export default PinPersonaInfoSectionModal;
