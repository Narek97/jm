import {
  ChangeEvent,
  FC,
  FormEvent,
  LegacyRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import './style.scss';

import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { WuButton, WuMenu, WuMenuItem, WuPopover } from '@npm-questionpro/wick-ui-lib';
import Skeleton from 'react-loading-skeleton';

import DeleteDemographicInfosSectionConfirmModal from './DeleteDemographicInfosSectionConfirmModal';
import SectionField from './SectionField';
import {
  DemographicInfoFieldsType,
  DemographicInfosType,
  PersonaImageContainedComponentType,
  PersonaInfoType,
} from '../../types';
import ImageViewAndUpload from './SectionField/ImageViewAndUpload';

import {
  CreateDefaultDemographicInfoFieldsMutation,
  useCreateDefaultDemographicInfoFieldsMutation,
} from '@/api/mutations/generated/createDefaultDemographicInfoFields.generated';
import {
  UpdateDemographicInfoPositionMutation,
  useUpdateDemographicInfoPositionMutation,
} from '@/api/mutations/generated/updateDemographicInfoPosition.generated';
import { DemographicInfoTypeEnum } from '@/api/types.ts';
import BaseWuInput from '@/Components/Shared/BaseWuInput';
import BaseWuSelect from '@/Components/Shared/BaseWuSelect';
import CustomColorPicker from '@/Components/Shared/CustomColorPicker';
import { debounced400 } from '@/Hooks/useDebounce';
import { useSetQueryDataByKey } from '@/Hooks/useQueryKey.ts';
import DemographicInfoItem from '@/Screens/PersonaScreen/components/PersonaLeftMenu/DemographicIInfoItem';
import PersonaGalleryModal from '@/Screens/PersonaScreen/components/PersonaLeftMenu/PersonaGalleryModal';
import {
  DEMOGRAPHIC_INFO_POPOVER,
  PERSONA_DEMOGRAPHIC_INFO_OPTIONS,
  PERSONA_FIELD_SECTIONS_TYPES,
  PERSONA_TYPE_MENU_ITEMS,
} from '@/Screens/PersonaScreen/constants.tsx';
import { AttachmentType, CroppedAreaType } from '@/types';
import { PersonaFieldCategoryTypeEnum, PersonaTypeEnum } from '@/types/enum';

interface IPersonaLeftMenu {
  personaId: number;
  personaInfo: PersonaInfoType | null;
  demographicInfos: DemographicInfosType;
  onHandleUpdateInfo: (key: string, value: string) => void;
  onHandleChangeDemographicInfo: (
    demographicInfoId: number,
    value: any,
    key: 'key' | 'value' | 'isHidden' | 'attachment' | 'height',
    categoryType: PersonaFieldCategoryTypeEnum,
  ) => void;
  onHandleAddNewDemographicInfo: (
    name: string,
    type: DemographicInfoTypeEnum,
    value: string,
    callback: () => void,
  ) => void;
  onHandleDeleteDemographicInfo: (id: number, type: DemographicInfoTypeEnum) => void;
  isLoadingCreateDemographicInfo: boolean;
  isLoadingDeleteDemographicInfo: boolean;
  demographicInfoRef: LegacyRef<HTMLDivElement> | undefined;
}

const PersonaLeftMenu: FC<IPersonaLeftMenu> = ({
  personaId,
  personaInfo,
  demographicInfos,
  onHandleUpdateInfo,
  onHandleChangeDemographicInfo,
  onHandleAddNewDemographicInfo,
  onHandleDeleteDemographicInfo,
  isLoadingCreateDemographicInfo,
  isLoadingDeleteDemographicInfo,
  demographicInfoRef,
}) => {
  const setDemographicInfos = useSetQueryDataByKey('GetPersonaDemographicInfos');

  const inputRef = useRef<HTMLInputElement | null>(null);
  const personaTypeInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState<string>('');
  const [selectedDemographicInfoType, setSelectedDemographicInfoType] =
    useState<DemographicInfoTypeEnum | null>(null);
  const [selectedDemographicInfoId, setSelectedDemographicInfoId] = useState<number | null>(null);
  const [otherTypeText, setOtherTypeText] = useState<string>(personaInfo?.type || '');
  const [isAutoFocusOn, setIsAutoFocusOn] = useState<boolean>(false);
  const [isOpenGalleryModal, setIsOpenGalleryModal] = useState<boolean>(false);
  const [avatarKey, setAvatarKey] = useState<string>(
    personaInfo?.attachment
      ? `${personaInfo?.attachment?.url}/large${personaInfo?.attachment?.key}`
      : '',
  );
  const [
    isOpenDeleteDemographicInfoSectionConfirmModal,
    setIsOpenDeleteDemographicInfoSectionConfirmModal,
  ] = useState<boolean>(false);

  const [currentUpdatedImageComponent, setCurrentUpdatedImageComponent] =
    useState<PersonaImageContainedComponentType>({
      type: null,
      itemId: null,
      attachment: null,
    });
  const [avatarCroppedArea, setAvatarCroppedArea] = useState<CroppedAreaType | null>(
    personaInfo?.croppedArea || null,
  );

  const { mutate: mutateCreateDefaultFields } = useCreateDefaultDemographicInfoFieldsMutation<
    Error,
    CreateDefaultDemographicInfoFieldsMutation
  >();

  const { mutate: mutateDemographicInfoPosition } = useUpdateDemographicInfoPositionMutation<
    Error,
    UpdateDemographicInfoPositionMutation
  >();

  const onHandleUpdateSectionItemAttachment = useCallback(
    (data: AttachmentType, itemId: number) => {
      onHandleChangeDemographicInfo(
        itemId,
        { ...data },
        'attachment',
        PersonaFieldCategoryTypeEnum.PERSONA_FIELD_SECTIONS,
      );
    },
    [onHandleChangeDemographicInfo],
  );

  const onHandleChangeAvatar = useCallback(
    (data: AttachmentType, croppedArea?: CroppedAreaType): Promise<void> => {
      return new Promise(resolve => {
        const source = data.url ? `${data.url}/large${data.key}` : data.key;
        switch (currentUpdatedImageComponent.type) {
          case 'avatar':
            setAvatarKey(source);
            setAvatarCroppedArea(croppedArea || data.croppedArea || null);
            break;
          case 'personaField': {
            const itemId = currentUpdatedImageComponent.itemId;
            if (itemId) {
              onHandleUpdateSectionItemAttachment({ ...data, croppedArea }, itemId);
            }
            onHandleToggleGalleryModal();
            break;
          }
        }
        setTimeout(() => {
          resolve();
        }, 1500);
      });
    },
    [
      currentUpdatedImageComponent?.itemId,
      currentUpdatedImageComponent?.type,
      onHandleUpdateSectionItemAttachment,
    ],
  );

  const onHandleToggleGalleryModal = () => {
    setIsOpenGalleryModal(prev => !prev);
  };

  const onHandleSelectDemographicInfo = (type: DemographicInfoTypeEnum) => {
    setSelectedDemographicInfoType(type);
  };

  const onHandleCreateDemographicInfo = (e: FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLInputElement;

    onHandleAddNewDemographicInfo(
      name,
      selectedDemographicInfoType as DemographicInfoTypeEnum,
      target.value || '',
      () => {
        setSelectedDemographicInfoType(null);
        setName('');
      },
    );
  };

  const onHandleEditDemographicInfoItem = useCallback((item?: DemographicInfoFieldsType) => {
    if (item) {
      setSelectedDemographicInfoId(item.id);
    }
  }, []);

  const onHandleRemoveSelectedDemographicInfoId = useCallback(() => {
    setSelectedDemographicInfoId(null);
  }, []);

  const onHandleDeleteDemographicInfoItem = useCallback(
    (item?: DemographicInfoFieldsType) => {
      if (item) {
        onHandleDeleteDemographicInfo(item.id, item.type);
      }
    },
    [onHandleDeleteDemographicInfo],
  );

  const onHandleAddOtherType = (e: ChangeEvent<HTMLInputElement>) => {
    setOtherTypeText(e.target.value);
    debounced400(() => {
      onHandleUpdateInfo('type', e.target.value);
    });
  };

  const onHandleAddSection = (type: DemographicInfoTypeEnum) => {
    onHandleSelectDemographicInfo(type);

    onHandleAddNewDemographicInfo(name, type as DemographicInfoTypeEnum, '', () => {
      setSelectedDemographicInfoType(null);
      setName('');
    });
  };

  const onHandleAddDefaultDemographicFields = () => {
    mutateCreateDefaultFields(
      {
        createDefaultDemographicInfoFieldsInput: {
          personaId: +personaId || 0,
        },
      },
      {
        onSuccess: response => {
          setDemographicInfos((oldData: any) => {
            if (oldData) {
              return {
                getPersonaDemographicInfos: {
                  ...oldData.getPersonaDemographicInfos,
                  demographicInfoFields: response.createDefaultDemographicInfoFields,
                },
              };
            }
          });
        },
      },
    );
  };

  const onActionAfterDeleteFields = () => {
    setIsOpenDeleteDemographicInfoSectionConfirmModal(false);
    setDemographicInfos((oldData: any) => {
      if (oldData) {
        return {
          getPersonaDemographicInfos: {
            ...oldData.getPersonaDemographicInfos,
            demographicInfoFields: [],
          },
        };
      }
    });
  };

  const options = useMemo(() => {
    return PERSONA_DEMOGRAPHIC_INFO_OPTIONS({
      onHandleEdit: onHandleEditDemographicInfoItem,
      onHandleDelete: onHandleDeleteDemographicInfoItem,
    });
  }, [onHandleDeleteDemographicInfoItem, onHandleEditDemographicInfoItem]);

  useEffect(() => {
    if (isAutoFocusOn) {
      personaTypeInputRef?.current?.focus();
    }
  }, [isAutoFocusOn]);

  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.index === destination.index) return;
    const reorderedItems = Array.from(demographicInfos.personaFieldSections);
    const [movedItem] = reorderedItems.splice(source.index, 1);
    reorderedItems.splice(destination.index, 0, movedItem);
    const beforeId = destination.index > 0 ? reorderedItems[destination.index - 1].id : null;

    const afterId =
      destination.index < reorderedItems.length - 1
        ? reorderedItems[destination.index + 1].id
        : null;

    mutateDemographicInfoPosition({
      updateDemographicInfoPositionInput: {
        personaId: personaId,
        id: movedItem.id,
        afterId,
        beforeId,
      },
    });
  };

  return (
    <div className={'persona-left-menu'}>
      {isOpenDeleteDemographicInfoSectionConfirmModal && (
        <DeleteDemographicInfosSectionConfirmModal
          personaId={personaId}
          isOpen={isOpenDeleteDemographicInfoSectionConfirmModal}
          handleClose={() => {
            setIsOpenDeleteDemographicInfoSectionConfirmModal(false);
          }}
          onSuccess={onActionAfterDeleteFields}
        />
      )}
      {isOpenGalleryModal && currentUpdatedImageComponent.type && (
        <PersonaGalleryModal
          isOpen={isOpenGalleryModal}
          personaId={personaId}
          currentUpdatedImageComponent={currentUpdatedImageComponent}
          selectedGalleryItemId={null}
          onHandleCloseModal={onHandleToggleGalleryModal}
          onHandleChangeAvatar={onHandleChangeAvatar}
        />
      )}
      <div className={'persona-left-menu--content'}>
        <div
          className={'persona-left-menu--avatar-frame'}
          data-testid={'persona-left-menu--avatar-frame'}
          style={{ border: `4px solid ${personaInfo?.color}` }}
          onClick={() => {
            setCurrentUpdatedImageComponent(prev => ({
              ...prev,
              itemId: personaId,
              attachment: personaInfo?.attachment || null,
              type: 'avatar',
            }));

            onHandleToggleGalleryModal();
          }}>
          <ImageViewAndUpload
            hasResizedVersions={!!personaInfo?.attachment?.hasResizedVersions}
            croppedArea={avatarCroppedArea}
            avatarKey={avatarKey}
            onlyView={false}
            isTemplate
          />
        </div>
        <div className={'persona-left-menu--color-type-block'}>
          <div className={'persona-left-menu--type-block'}>
            <p>Type</p>
            {personaInfo?.type !== PersonaTypeEnum.Customer &&
              personaInfo?.type !== PersonaTypeEnum.Employee && (
                <div className={'custom-type-input'}>
                  <BaseWuInput
                    data-testid="custom-user-type"
                    inputRef={personaTypeInputRef}
                    value={otherTypeText}
                    onChange={onHandleAddOtherType}
                    onBlur={() => setIsAutoFocusOn(false)}
                    onKeyDown={event => {
                      if (event.keyCode === 13) {
                        event.preventDefault();
                        (event.target as HTMLElement).blur();
                      }
                    }}
                  />
                </div>
              )}
            <BaseWuSelect
              data={PERSONA_TYPE_MENU_ITEMS}
              onSelect={data => {
                if ((data as { value: string }).value === PersonaTypeEnum.Others) {
                  setIsAutoFocusOn(true);
                  setOtherTypeText('');
                  onHandleUpdateInfo('type', '');
                } else {
                  onHandleUpdateInfo(
                    'type',
                    (data as (typeof PERSONA_TYPE_MENU_ITEMS)[number]).value,
                  );
                }
              }}
              accessorKey={{
                label: 'name',
                value: 'id',
              }}
              defaultValue={PERSONA_TYPE_MENU_ITEMS.find(
                persona => persona.value === personaInfo?.type,
              )}
            />
          </div>
          <div className={'persona-left-menu--color-block'}>
            <p>Color</p>
            <CustomColorPicker
              defaultColor={personaInfo?.color || '#1b87e6'}
              onChange={colorData => {
                onHandleUpdateInfo('color', colorData);
              }}
            />
          </div>
        </div>
      </div>

      {demographicInfos.demographicInfoFields?.length > 0 ? (
        <div className={'persona-left-menu--block-2'}>
          <div data-testid={'delete-demographic-infos'}>
            <WuButton
              className={'delete-demographic-info-section'}
              onClick={() => setIsOpenDeleteDemographicInfoSectionConfirmModal(true)}
              Icon={<span className="wm-delete" />}
              variant="iconOnly"
            />
          </div>
          <p className={'persona-left-menu--block-2-title !text-heading-3'}>Demographic info</p>
          <div
            className={'persona-left-menu--demographic-info-block'}
            ref={demographicInfoRef}
            data-testid="demographic-info-section">
            {demographicInfos.demographicInfoFields.map((demographicInfo, index) => (
              <DemographicInfoItem
                key={demographicInfo.id}
                demographicInfo={demographicInfo}
                index={index}
                onHandleChangeDemographicInfo={onHandleChangeDemographicInfo}
                selectedDemographicInfoId={selectedDemographicInfoId}
                onHandleRemoveSelectedDemographicInfoId={onHandleRemoveSelectedDemographicInfoId}
                options={options}
              />
            ))}
          </div>
          {isLoadingCreateDemographicInfo &&
            selectedDemographicInfoType &&
            [
              DemographicInfoTypeEnum.List,
              DemographicInfoTypeEnum.Text,
              DemographicInfoTypeEnum.Number,
            ]?.includes(selectedDemographicInfoType) && (
              <div className={'persona-left-menu--demographic-info-create-loading-block'}>
                <Skeleton width={'18.2rem'} height={'2.688rem'} />
              </div>
            )}
          <form
            autoComplete="off"
            className={`${
              isLoadingCreateDemographicInfo
                ? 'persona-left-menu--demographic-none-info-create-block'
                : 'persona-left-menu--demographic-info-create-block'
            }  ${
              selectedDemographicInfoType
                ? 'persona-left-menu--demographic-open-info-create-block'
                : ''
            }`}
            onSubmit={onHandleCreateDemographicInfo}>
            <BaseWuInput
              inputRef={inputRef}
              value={name}
              data-testid={'demographic-info-name-test-id'}
              onChange={e => setName(e.target.value)}
            />
            <div className={'persona-left-menu--demographic-info-actions'}>
              <button
                type={'submit'}
                aria-label={'Tick'}
                data-testid={'create-demographic-info-test-id'}>
                <span className={'wm-check'} />
              </button>
              <button
                type={'button'}
                aria-label={'XDelete'}
                disabled={isLoadingDeleteDemographicInfo}
                onClick={() => setSelectedDemographicInfoType(null)}>
                <span className={'wm-close'} />
              </button>
            </div>
          </form>
          <WuPopover
            side="left"
            Trigger={<WuButton variant="outline" className="wm-add min-w-0 px-2.5"></WuButton>}
            className="w-28"
            aria-label={'add'}
            data-testid={'add-demographic-info-test-id'}
            disabled={isLoadingCreateDemographicInfo}>
            <ul>
              {DEMOGRAPHIC_INFO_POPOVER.map(item => (
                <li
                  key={item.id}
                  data-testid={`${item.type.toLowerCase()}-test-id`}
                  className={'persona-left-menu--demographic-info-popover-item'}
                  onClick={() => onHandleSelectDemographicInfo(item.type)}>
                  {item.name}
                </li>
              ))}
            </ul>
          </WuPopover>
        </div>
      ) : (
        <WuButton
          data-testid={'add-demographic-info-test-id'}
          color="primary"
          Icon={null}
          className={'add-default-demographic-fields'}
          iconPosition="left"
          onClick={onHandleAddDefaultDemographicFields}
          size="md"
          style={{
            width: '200px',
          }}
          variant="outline">
          Add demographics
        </WuButton>
      )}

      <div className="persona-left-menu--block-2 demographic-sections">
        <div className={'persona-left-menu--demographic-info-block'}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {provided => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {demographicInfos?.personaFieldSections?.map((demographicInfo, index) => (
                    <Draggable
                      key={demographicInfo.id}
                      draggableId={String(demographicInfo.id)}
                      index={index}>
                      {provided => (
                        <SectionField
                          provided={provided}
                          key={demographicInfo.id}
                          onHandleToggleGalleryModal={() => {
                            setCurrentUpdatedImageComponent({
                              itemId: demographicInfo.id,
                              attachment: demographicInfo?.attachment || null,
                              type: 'personaField',
                            });
                            onHandleToggleGalleryModal();
                          }}
                          onHandleDeleteDemographicInfoItem={onHandleDeleteDemographicInfoItem}
                          onHandleChangeDemographicInfo={onHandleChangeDemographicInfo}
                          item={demographicInfo}
                          index={index}
                          type={demographicInfo.type}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <WuMenu
          Trigger={
            <WuButton variant="outline" className="add-demographic-field">
              Add Section
            </WuButton>
          }>
          {PERSONA_FIELD_SECTIONS_TYPES.map(sectionType => (
            <WuMenuItem
              onSelect={() => {
                onHandleAddSection(sectionType.type);
              }}
              key={sectionType.type}>
              {sectionType.label}
            </WuMenuItem>
          ))}
        </WuMenu>
      </div>
    </div>
  );
};

export default PersonaLeftMenu;
