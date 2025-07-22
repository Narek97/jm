import { FC, useMemo, useState } from 'react';

import './style.scss';
import { v4 as uuidv4 } from 'uuid';

import {
  COMMUNICATION,
  FINANCE,
  HEALTHCARE,
  HUMAN_RESOURCES,
  RETAIL,
  SALES_MARKETING,
  SOCIAL_MEDIA,
  TOUCHPOINT_OPTIONS,
} from '../../constants';
import CreateTouchpointModal from '../CreateTouchpointModal';
import DeleteTouchPointConfirmModal from '../DeleteTouchpointConfirmModal';

import CustomInput from '@/Components/Shared/CustomInput';
import CustomLongMenu from '@/Components/Shared/CustomLongMenu';
import EmptyDataInfo from '@/Components/Shared/EmptyDataInfo';
import { JourneyMapTouchpointIconsType } from '@/Screens/JourneyMapScreen/types';
import { useTouchpointsStore } from '@/Store/touchpoints.ts';
import { AttachmentType, ObjectKeysType } from '@/types';
import { MenuViewTypeEnum, TouchpointIconsEnum } from '@/types/enum';

interface ITouchpointIcons {
  type: TouchpointIconsEnum;
}

const TouchpointIcons: FC<ITouchpointIcons> = ({ type }) => {
  const {
    touchPointCustomIcons,
    selectedCustomTouchpoints,
    selectedTouchpoints,
    setSelectedCustomTouchpoints,
    setSelectedTouchpoints,
  } = useTouchpointsStore();

  const [currentAttachmentData, setCurrentAttachmentData] = useState<
    (JourneyMapTouchpointIconsType & { attachmentId?: number }) | null
  >(null);
  const [isOpenDeleteConfirmationModal, setIsOpenDeleteConfirmationModal] =
    useState<boolean>(false);
  const [isOpenCreateTouchpointModal, setIsOpenCreateTouchpointModal] = useState<boolean>(false);
  const [search, setSearch] = useState('');

  const iconsByType: ObjectKeysType = useMemo(
    () => ({
      [TouchpointIconsEnum.ALL]: [...COMMUNICATION, ...FINANCE],
      [TouchpointIconsEnum.COMMUNICATION]: COMMUNICATION,
      [TouchpointIconsEnum.SOCIAL_MEDIA]: SOCIAL_MEDIA,
      [TouchpointIconsEnum.SALES_MARKETING]: SALES_MARKETING,
      [TouchpointIconsEnum.FINANCE]: FINANCE,
      [TouchpointIconsEnum.RETAIL]: RETAIL,
      [TouchpointIconsEnum.HEALTHCARE]: HEALTHCARE,
      [TouchpointIconsEnum.HUMAN_RESOURCES]: HUMAN_RESOURCES,
    }),
    [],
  );
  const icons: Array<JourneyMapTouchpointIconsType> = useMemo(
    () => (iconsByType[type] as Array<JourneyMapTouchpointIconsType>) || [],
    [iconsByType, type],
  );

  const newIcons = useMemo(() => {
    if (search) {
      return icons.filter((item: JourneyMapTouchpointIconsType) =>
        item?.name?.toLowerCase()?.includes(search.toLowerCase()),
      );
    }
    return icons;
  }, [icons, search]);

  const newTouchPointIcons = useMemo(() => {
    if (search) {
      return touchPointCustomIcons.filter(item =>
        item.name?.toLowerCase()?.includes(search.toLowerCase()),
      );
    }
    return touchPointCustomIcons;
  }, [search, touchPointCustomIcons]);

  const onHandleSelectTouchpoint = (icon: JourneyMapTouchpointIconsType) => {
    setSelectedTouchpoints([...selectedTouchpoints, { ...icon, uuid: uuidv4() }]);
  };

  const onHandleSelectCustomTouchpoint = (icon: AttachmentType) => {
    setSelectedCustomTouchpoints([...selectedCustomTouchpoints, { ...icon, uuid: uuidv4() }]);
  };

  const onHandleToggleCreateTouchpointModal = () => {
    setIsOpenCreateTouchpointModal(false);
    setCurrentAttachmentData(null);
  };

  const options = useMemo(() => {
    return TOUCHPOINT_OPTIONS({
      onHandleEdit: data => {
        setIsOpenCreateTouchpointModal(true);
        setCurrentAttachmentData({
          id: +data.id,
          uuid: uuidv4(),
          url:
            data?.type === 'NOUN_PROJECT_ICON'
              ? data?.url
              : `${import.meta.env.VITE_AWS_URL}/${data?.url}/large${data?.key}`,
          key: data.key,
          name: data.name,
          type: data.type,
          attachmentId: +data?.id,
        });
      },
      onHandleDelete: data => {
        setIsOpenDeleteConfirmationModal(true);
        setCurrentAttachmentData(data);
      },
    });
  }, []);

  return (
    <div className={'touchpoint-icons'}>
      {isOpenCreateTouchpointModal && (
        <CreateTouchpointModal
          touchPointData={currentAttachmentData}
          isOpen={isOpenCreateTouchpointModal}
          onHandleCloseModal={onHandleToggleCreateTouchpointModal}
        />
      )}
      {currentAttachmentData && (
        <DeleteTouchPointConfirmModal
          touchPointAttachment={{
            id: +currentAttachmentData.id,
            url: currentAttachmentData.url || '',
            key: currentAttachmentData.key,
            type: currentAttachmentData?.type || '',
          }}
          isOpen={isOpenDeleteConfirmationModal}
          handleClose={() => {
            setIsOpenDeleteConfirmationModal(false);
          }}
        />
      )}
      <div className={'touchpoint-icons--header'}>
        <CustomInput
          isIconInput={true}
          inputType={'primary'}
          placeholder={`Search touchpoint`}
          type={'text'}
          sxStyles={{
            width: '12.5rem',
          }}
          onChange={e => setSearch(e.target.value)}
        />
        {type === TouchpointIconsEnum.CUSTOM && (
          <button
            className={'touchpoint-icons--add-touchpoint-btn'}
            onClick={() => {
              setIsOpenCreateTouchpointModal(true);
            }}>
            <span
              className={'wm-add'}
              style={{
                color: '#1b87e6',
              }}
            />
            Add Touchpoint
          </button>
        )}
      </div>

      <ul className={'touchpoint-icons--content'} data-testid="touchpoint-icons-context">
        {type === TouchpointIconsEnum.CUSTOM ? (
          <>
            {newTouchPointIcons.length ? (
              newTouchPointIcons.map(icon => {
                const isSelected =
                  selectedCustomTouchpoints.some(el => el.id === icon.id) ||
                  selectedTouchpoints.some(el => el.id === icon.id);
                return (
                  <li
                    key={icon.id}
                    data-testid={`touchpoint-item-test-id-${icon.id}`}
                    className={`touchpoint-icons--icon-block ${
                      isSelected ? 'touchpoint-icons--selected-icon-block' : ''
                    }`}
                    onClick={() => {
                      if (icon.type === 'TOUCHPOINT_ICON') {
                        onHandleSelectCustomTouchpoint(icon as AttachmentType);
                      } else {
                        onHandleSelectTouchpoint(icon as AttachmentType);
                      }
                    }}>
                    <div className={'touchpoint--menu'}>
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
                        item={icon}
                        options={options}
                        sxStyles={{
                          display: 'inline-block',
                          background: 'transparent',
                        }}
                      />
                    </div>
                    <img
                      src={
                        icon.type === 'TOUCHPOINT_ICON'
                          ? `${import.meta.env.VITE_AWS_URL}/${icon?.url}/large${icon?.key}`
                          : icon.url || ''
                      }
                      alt={icon.name || 'img'}
                      style={{
                        width: '1.563rem',
                        height: '1.563rem',
                      }}
                    />
                    <p className={'touchpoint-icons--icon-title'}>{icon.name}</p>
                  </li>
                );
              })
            ) : (
              <EmptyDataInfo message={'No result'} />
            )}
          </>
        ) : (
          <>
            {newIcons.length ? (
              newIcons.map((icon: JourneyMapTouchpointIconsType) => {
                const isSelected = selectedTouchpoints.some(el => el.id === icon.id);
                return (
                  <li
                    key={icon.id}
                    className={`touchpoint-icons--icon-block ${
                      isSelected ? 'touchpoint-icons--selected-icon-block' : ''
                    }`}
                    onClick={() => onHandleSelectTouchpoint(icon)}>
                    <img
                      src={`${import.meta.env.VITE_SVG_URL}custom-touchpoints/${icon.key}`}
                      alt={icon.name || 'Icon'}
                      style={{
                        width: '1.25rem',
                        height: '1.25rem',
                      }}
                    />
                    <p className={'touchpoint-icons--icon-title'}>{icon.name}</p>
                  </li>
                );
              })
            ) : (
              <EmptyDataInfo message={'No result'} />
            )}
          </>
        )}
      </ul>
    </div>
  );
};
export default TouchpointIcons;
