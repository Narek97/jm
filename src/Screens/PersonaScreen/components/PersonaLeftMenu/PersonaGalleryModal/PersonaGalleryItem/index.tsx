import { FC, useCallback, useEffect, useRef, useState } from 'react';

import './style.scss';
import {
  DeleteAttachmentMutation,
  useDeleteAttachmentMutation,
} from '@/api/mutations/generated/deleteFile.generated.ts';
import {
  UpdateAttachmentNameMutation,
  useUpdateAttachmentNameMutation,
} from '@/api/mutations/generated/updateAttachmentName.generated.ts';
import BaseWuInput from '@/Components/Shared/BaseWuInput';
import { IMAGE_ASPECT } from '@/Constants';
import { debounced400 } from '@/Hooks/useDebounce.ts';
import { PersonaDemographicInfoType } from '@/Screens/JourneyMapScreen/types.ts';
import { AttachmentType } from '@/types';
import { getResizedFileName } from '@/utils/getResizedFileName.ts';

interface IPersonaGalleryItem {
  item: AttachmentType;
  selectedPersonaImgId: number | null;
  onDeleteSuccess: (id: number) => void;
  onHandleUpdateCroppedArea: (item: AttachmentType) => void;
}

const PersonaGalleryItem: FC<IPersonaGalleryItem> = ({
  item,
  selectedPersonaImgId,
  onDeleteSuccess,
  onHandleUpdateCroppedArea,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isEditTitleModeOn, setIsEditTitleModeOn] = useState<boolean>(false);
  const [galleryName, setGalleryName] = useState<string>(item?.name || '');

  const { mutate: mutateDeleteAttachment } = useDeleteAttachmentMutation<
    Error,
    DeleteAttachmentMutation
  >({
    onSuccess: response => {
      onDeleteSuccess(response.deleteAttachment);
    },
  });

  const { mutate: updateAttachmentName } = useUpdateAttachmentNameMutation<
    Error,
    UpdateAttachmentNameMutation
  >();

  const onHandleRename = useCallback(() => {
    setIsEditTitleModeOn(true);
  }, []);

  const onHandleDelete = useCallback(
    (item: PersonaDemographicInfoType) => {
      mutateDeleteAttachment({ id: item.id });
    },
    [mutateDeleteAttachment],
  );

  const onChangeName = useCallback(
    (title: string) => {
      setGalleryName(title);
      debounced400(() => {
        updateAttachmentName({
          updateAttachmentNameInput: { name: title, attachmentId: item?.id },
        });
      });
    },
    [item?.id, updateAttachmentName],
  );

  useEffect(() => {
    if (isEditTitleModeOn && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditTitleModeOn]);

  useEffect(() => {
    setGalleryName(item?.name || '');
  }, [item?.name]);

  return (
    <figure
      key={item.id}
      data-testid={`persona-gallery-test-id-${item.id}`}
      className={`persona-gallery-modal--gallery--item ${
        selectedPersonaImgId === item.id
          ? 'persona-gallery-modal--gallery--item--selected-item'
          : ''
      }`}
      onClick={() => {
        onHandleUpdateCroppedArea(item);
      }}>
      <div className={'persona-gallery-modal--gallery--item--image-box'}>
        <img
          src={`${
            item.url
              ? `${import.meta.env.VITE_AWS_URL}/${item.url}/large${item?.hasResizedVersions ? getResizedFileName(item.key, IMAGE_ASPECT) : item.key}`
              : `${import.meta.env.VITE_AWS_URL}/${item?.hasResizedVersions ? getResizedFileName(item.key, IMAGE_ASPECT) : item.key}`
          }`}
          width={200}
          height={200}
          alt={item.name || 'img'}
        />
      </div>
      {isEditTitleModeOn ? (
        <BaseWuInput
          data-testid="gallery-image-item-name-test-id"
          style={{
            background: 'none',
            paddingLeft: '0.625rem',
          }}
          aria-label={galleryName}
          className={'board-card--name-block-input'}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
          inputRef={inputRef}
          value={galleryName}
          onChange={e => {
            onChangeName(e?.target?.value);
          }}
          onBlur={() => {
            setIsEditTitleModeOn(false);
          }}
          onKeyDown={event => {
            if (event.keyCode === 13) {
              event.preventDefault();
              (event.target as HTMLElement).blur();
            }
          }}
        />
      ) : (
        <figcaption className={'persona-gallery-modal--gallery--item--image-title'}>
          {galleryName}
        </figcaption>
      )}
      <div className={'persona-gallery-modal--gallery--item--menu'}>
        {/*// Menu should be WuMenu (currently we have conflict between WuModal and Material's menu)*/}
        {/*<CustomLongMenu*/}
        {/*  type={MenuViewTypeEnum.VERTICAL}*/}
        {/*  anchorOrigin={{*/}
        {/*    vertical: 'bottom',*/}
        {/*    horizontal: 'right',*/}
        {/*  }}*/}
        {/*  transformOrigin={{*/}
        {/*    vertical: 'top',*/}
        {/*    horizontal: 'right',*/}
        {/*  }}*/}
        {/*  options={options}*/}
        {/*  item={item}*/}
        {/*  buttonColor={'#00000'}*/}
        {/*  sxStyles={{*/}
        {/*    display: 'inline-block',*/}
        {/*    background: 'transparent',*/}
        {/*  }}*/}
        {/*  rootStyles={{*/}
        {/*    marginLeft: '0',*/}
        {/*  }}*/}
        {/*/>*/}
      </div>
    </figure>
  );
};

export default PersonaGalleryItem;
