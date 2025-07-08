import React, { FC, useMemo, useState } from 'react';

import Image from 'next/image';

import { Box } from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';
import { v4 as uuidv4 } from 'uuid';

import CustomInput from '@/components/atoms/custom-input/custom-input';
import CustomLongMenu from '@/components/atoms/custom-long-menu/custom-long-menu';
import EmptyDataInfoTemplate from '@/components/templates/empty-data-info-template';
import CreateTouchpointModal from '@/containers/journey-map-container/journey-map-rows/row-types/touchpoints/create-touchpoint-modal';
import DeleteTouchPointConfirmModal from '@/containers/journey-map-container/journey-map-rows/row-types/touchpoints/touchpoint-drawer/delete-touchpoint-confirm-modal';
import PlusIcon from '@/public/operations/plus.svg';
import {
  selectedCustomTouchpointsState,
  selectedTouchpointsState,
} from '@/store/atoms/selectedTouchpoints.atom';
import { touchPointCustomIconsState } from '@/store/atoms/touchPointCustomIcons.atom';
import { TOUCHPOINT_OPTIONS } from '@/utils/constants/options';
import {
  COMMUNICATION,
  FINANCE,
  HEALTHCARE,
  HUMAN_RESOURCES,
  RETAIL,
  SALES_MARKETING,
  SOCIAL_MEDIA,
} from '@/utils/constants/touchpoints';
import { menuViewTypeEnum, TouchpointIconsEnum } from '@/utils/ts/enums/global-enums';
import { ObjectKeysType } from '@/utils/ts/types/global-types';
import { JourneyMapTouchpointIconsType } from '@/utils/ts/types/journey-map/journey-map-types';
import { PersonaGalleryType } from '@/utils/ts/types/persona/persona-types';
import './style.scss';

interface ITouchpointIcons {
  type: TouchpointIconsEnum;
}

const TouchpointIcons: FC<ITouchpointIcons> = ({ type }) => {
  const [currentAttachmentData, setCurrentAttachmentData] = useState<
    (JourneyMapTouchpointIconsType & { attachmentId?: number }) | null
  >(null);
  const [isOpenDeleteConfirmationModal, setIsOpenDeleteConfirmationModal] =
    useState<boolean>(false);
  const [isOpenCreateTouchpointModal, setIsOpenCreateTouchpointModal] = useState<boolean>(false);
  const [search, setSearch] = useState('');

  const [selectedTouchpoint, setSelectedTouchpoints] = useRecoilState(selectedTouchpointsState);
  const [selectedCustomTouchpoints, setSelectedCustomTouchpoints] = useRecoilState(
    selectedCustomTouchpointsState,
  );
  const touchPointCustomIcons = useRecoilValue(touchPointCustomIconsState);

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
  const icons = useMemo(() => iconsByType[type] || [], [iconsByType, type]);

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
    setSelectedTouchpoints(prev => [...prev, { ...icon, uuid: uuidv4() }]);
  };

  const onHandleSelectCustomTouchpoint = (icon: PersonaGalleryType) => {
    setSelectedCustomTouchpoints(prev => [...prev, { ...icon, uuid: uuidv4() }]);
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
          id: +data.id!,
          uuid: uuidv4(),
          url:
            data?.type === 'NOUN_PROJECT_ICON'
              ? data?.url!
              : `${process.env.NEXT_PUBLIC_AWS_URL}/${data?.url}/large${data?.key}`,
          key: data.key,
          name: data.name,
          type: data.type,
          attachmentId: +data?.id!,
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
            id: +currentAttachmentData.id!,
            url: currentAttachmentData.url!,
            key: currentAttachmentData.key,
            type: currentAttachmentData?.type!,
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
            <PlusIcon fill={'#1b87e6'} /> Add Touchpoint
          </button>
        )}
      </div>

      <ul className={'touchpoint-icons--content'} data-testid="touchpoint-icons-context">
        {type === TouchpointIconsEnum.CUSTOM ? (
          <>
            {newTouchPointIcons.length ? (
              newTouchPointIcons?.map(icon => {
                const isSelected =
                  selectedCustomTouchpoints.some(el => el.id === icon.id) ||
                  selectedTouchpoint.some(el => el.id === icon.id);
                return (
                  <li
                    key={icon.id}
                    data-testid={`touchpoint-item-test-id-${icon.id}`}
                    className={`touchpoint-icons--icon-block ${
                      isSelected ? 'touchpoint-icons--selected-icon-block' : ''
                    }`}
                    onClick={() => {
                      icon.type === 'TOUCHPOINT_ICON'
                        ? onHandleSelectCustomTouchpoint(icon as PersonaGalleryType)
                        : onHandleSelectTouchpoint(icon as PersonaGalleryType);
                    }}>
                    <div className={'touchpoint--menu'}>
                      <CustomLongMenu
                        type={menuViewTypeEnum.VERTICAL}
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
                    <Image
                      src={
                        icon.type === 'TOUCHPOINT_ICON'
                          ? `${process.env.NEXT_PUBLIC_AWS_URL}/${icon?.url}/large${icon?.key}`
                          : icon.url || ''
                      }
                      alt={icon.name || 'img'}
                      width={100}
                      height={100}
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
              <EmptyDataInfoTemplate icon={<Box />} message={'No result'} />
            )}
          </>
        ) : (
          <>
            {newIcons.length ? (
              newIcons.map((icon: JourneyMapTouchpointIconsType) => {
                const isSelected = selectedTouchpoint.some(el => el.id === icon.id);
                return (
                  <li
                    key={icon.id}
                    className={`touchpoint-icons--icon-block ${
                      isSelected ? 'touchpoint-icons--selected-icon-block' : ''
                    }`}
                    onClick={() => onHandleSelectTouchpoint(icon)}>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SVG_URL}custom-touchpoints/${icon.key}`}
                      alt={icon.name}
                      width={100}
                      height={100}
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
              <EmptyDataInfoTemplate icon={<Box width={80} height={80} />} message={'No result'} />
            )}
          </>
        )}
      </ul>
    </div>
  );
};
export default TouchpointIcons;
