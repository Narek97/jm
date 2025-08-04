import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  DeleteAttachmentMutation,
  useDeleteAttachmentMutation,
} from '@/api/mutations/generated/deleteFile.generated.ts';
import {
  UpdateAttachmentNameMutation,
  useUpdateAttachmentNameMutation,
} from '@/api/mutations/generated/updateAttachmentName.generated.ts';
import BaseWuInput from '@/Components/Shared/BaseWuInput';
import BaseWuMenu from '@/Components/Shared/BaseWuMenu';
import { IMAGE_ASPECT } from '@/Constants';
import { debounced400 } from '@/Hooks/useDebounce.ts';
import { GALLERY_IMAGE_OPTIONS } from '@/Screens/PersonaScreen/constants';
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
    (item?: AttachmentType) => {
      mutateDeleteAttachment({ id: item!.id });
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

  const options = useMemo(() => {
    return GALLERY_IMAGE_OPTIONS({
      onHandleRename,
      onHandleDelete,
    });
  }, [onHandleDelete, onHandleRename]);

  useEffect(() => {
    if (isEditTitleModeOn && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditTitleModeOn]);

  useEffect(() => {
    setGalleryName(item?.name || '');
  }, [item?.name]);
  console.log(selectedPersonaImgId,'selectedPersonaImgId');
  console.log(item.id,'item.id');
  return (
    <figure
      data-testid={`persona-gallery-test-id-${item.id}`}
      className={`group flex flex-col justify-between  relative w-40 h-40 overflow-hidden cursor-pointer ${
        selectedPersonaImgId === item.id
          ? 'bg-[var(--soft-gray)] border border-solid border-[var(--primary)]!'
          : 'bg-[var(--light-gray)] border border-solid border-transparent!'
      }`}
      onClick={() => {
        onHandleUpdateCroppedArea(item);
      }}>
      <div className={'w-full h-[8rem] overflow-hidden'}>
        <img
          className={"w-full h-full object-cover"}
          src={`${
            item.url
              ? `${import.meta.env.VITE_AWS_URL}/${item.url}/large${item?.hasResizedVersions ? getResizedFileName(item.key, IMAGE_ASPECT) : item.key}`
              : `${import.meta.env.VITE_AWS_URL}/${item?.hasResizedVersions ? getResizedFileName(item.key, IMAGE_ASPECT) : item.key}`
          }`}

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
        <figcaption className={'reduce-text w-full text-[0.75rem] px-[10px]!'}>
          {galleryName}
        </figcaption>
      )}
      <div className={'flex items-center justify-center w-[32px] h-[32px] absolute top-2 right-2 invisible group-hover:visible! hover:bg-black/20'}>
        <BaseWuMenu options={options} item={item} trigger={ <span className={'wm-more-vert cursor-pointer text-white'} />} />
      </div>
    </figure>
  );
};

export default PersonaGalleryItem;
