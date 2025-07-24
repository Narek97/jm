import { ChangeEvent, FC, useCallback, useEffect, useMemo, useState } from 'react';

import './style.scss';

import { useWuShowToast, WuButton } from '@npm-questionpro/wick-ui-lib';
import { FileUploader } from 'react-drag-drop-files';
import Skeleton from 'react-loading-skeleton';

import {
  AttachImageToPersonaMutation,
  useAttachImageToPersonaMutation,
} from '@/api/mutations/generated/attachImageToPersona.generated.ts';
import {
  UpdateAttachmentCroppedAreaMutation,
  useUpdateAttachmentCroppedAreaMutation,
} from '@/api/mutations/generated/updateAttachmentCroppedArea.generated.ts';
import {
  GetPersonaGalleryQuery,
  useGetPersonaGalleryQuery,
} from '@/api/queries/generated/getPersonaGallery.generated.ts';
import { ActionEnum, AttachmentsEnum } from '@/api/types.ts';
import BaseWuInput from '@/Components/Shared/BaseWuInput';
import BaseWuModal from '@/Components/Shared/BaseWuModal';
import CustomFileUploader from '@/Components/Shared/CustomFileUploader';
import Pagination from '@/Components/Shared/Pagination';
import { PERSONA_FILE_TYPES } from '@/Constants';
import { BOARDS_LIMIT, PERSONAS_GALLERY_LIMIT } from '@/Constants/pagination.ts';
import { validateFile } from '@/Screens/JourneyMapScreen/helpers/validateFile.ts';
import CropImageModal from '@/Screens/PersonaScreen/components/PersonaLeftMenu/PersonaGalleryModal/CropImageModal';
import PersonaGalleryItem from '@/Screens/PersonaScreen/components/PersonaLeftMenu/PersonaGalleryModal/PersonaGalleryItem';
import { PersonaImageContainedComponentType } from '@/Screens/PersonaScreen/types.ts';
import { useUserStore } from '@/Store/user.ts';
import { AttachmentType, CroppedAreaType } from '@/types';
import { FileTypeEnum } from '@/types/enum.ts';
import { UploadFile } from '@/utils/uploader.ts';

interface IPersonaGalleryModal {
  isOpen: boolean;
  personaId: number;
  currentUpdatedImageComponent: PersonaImageContainedComponentType;
  selectedGalleryItemId: number | null;
  onHandleCloseModal: () => void;
  onHandleChangeAvatar: (
    attachment: AttachmentType,
    croppedArea?: CroppedAreaType,
  ) => Promise<void>;
}

const PersonaGalleryModal: FC<IPersonaGalleryModal> = ({
  isOpen,
  personaId,
  currentUpdatedImageComponent,
  selectedGalleryItemId,
  onHandleCloseModal,
  onHandleChangeAvatar,
}) => {
  const { user } = useUserStore();
  const { showToast } = useWuShowToast();

  const [cropModalData, setCropModalData] = useState<null | {
    source: string;
    isOpenCropModal: boolean;
    mode: ActionEnum.Add | ActionEnum.Update;
    id?: number;
    croppedArea: CroppedAreaType | null;
  }>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [selectedPersonaImgId, setSelectedPersonaImgId] = useState<number | null>(
    selectedGalleryItemId || null,
  );
  const [newGallery, setNewGallery] = useState<Array<AttachmentType>>([]);
  const [allGallery, setAllGallery] = useState<Array<AttachmentType>>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [offset, setOffset] = useState<number>(0);

  const {
    isLoading: isLoadingPersonaGallery,
    data: dataPersonaGallery,
    refetch,
  } = useGetPersonaGalleryQuery<GetPersonaGalleryQuery, Error>({
    getPersonaGalleryInput: {
      offset: PERSONAS_GALLERY_LIMIT * offset,
      limit: PERSONAS_GALLERY_LIMIT,
      search,
    },
  });

  const { mutate: updateAttachmentCroppedArea } = useUpdateAttachmentCroppedAreaMutation<
    Error,
    UpdateAttachmentCroppedAreaMutation
  >();

  const { mutate: mutateAttachImageToPersona, isPending: isLoadingAttachImageToPersona } =
    useAttachImageToPersonaMutation<Error, AttachImageToPersonaMutation>();

  const onHandleAttachImageToPersona = useCallback(
    (croppedArea?: CroppedAreaType) => {
      const galleryItem =
        allGallery?.find(itm => itm?.id === selectedPersonaImgId) ||
        newGallery?.find(itm => itm?.id === selectedPersonaImgId);
      if (selectedPersonaImgId) {
        switch (currentUpdatedImageComponent.type) {
          case 'avatar':
            mutateAttachImageToPersona(
              {
                attachImageInput: {
                  personaId: +personaId,
                  attachmentId: selectedPersonaImgId,
                },
              },
              {
                onSuccess: () => {
                  if (galleryItem) {
                    onHandleChangeAvatar(galleryItem, croppedArea).then(() => {
                      onHandleCloseModal();
                    });
                  }
                },
              },
            );
            break;
          case 'personaField':
            if (galleryItem) {
              onHandleChangeAvatar(galleryItem, croppedArea).then(() => {
                onHandleCloseModal();
              });
            }
            break;
        }
      } else {
        onHandleCloseModal();
      }
    },
    [
      allGallery,
      currentUpdatedImageComponent.type,
      mutateAttachImageToPersona,
      newGallery,
      onHandleChangeAvatar,
      onHandleCloseModal,
      personaId,
      selectedPersonaImgId,
    ],
  );

  const updateAttachmentCropArea = useCallback(
    (croppedArea: CroppedAreaType, componentType: 'avatar' | 'personaField') => {
      if (cropModalData?.id) {
        updateAttachmentCroppedArea(
          {
            updateAttachmentCroppedAreaInput: {
              attachmentId: cropModalData.id,
              ...(componentType === 'avatar'
                ? {
                    personaId: +personaId,
                  }
                : {
                    demographicFieldId: currentUpdatedImageComponent.itemId!,
                  }),
              ...croppedArea,
            },
          },
          {
            onSuccess: () => {
              onHandleAttachImageToPersona(croppedArea);
            },
          },
        );
      }

      setCropModalData((prev: any) => ({
        ...prev,
        croppedArea,
      }));
      setAllGallery(prev => {
        return prev.map(item => (item.id === cropModalData?.id ? { ...item, croppedArea } : item));
      });
    },
    [
      cropModalData?.id,
      currentUpdatedImageComponent.itemId,
      onHandleAttachImageToPersona,
      personaId,
      updateAttachmentCroppedArea,
    ],
  );

  const handleUploadFiles = useCallback(
    async (file: File) => {
      if (!file) return;

      const { valid, extension, allowedExtensions } = await validateFile(file, FileTypeEnum.IMAGE);
      if (!valid || !extension) {
        showToast({
          variant: 'warning',
          message: `Only ${allowedExtensions.join(', ')} files are allowed.`,
        });
        return;
      }

      let percentage: number | undefined = undefined;

      const videoUploaderOptions = {
        fileType: extension,
        file,
        relatedId: user?.orgID,
        type: AttachmentsEnum.PersonaGallery,
      };

      setUploadProgress(1);
      const uploadFile = new UploadFile(videoUploaderOptions);

      uploadFile
        .onProgress(({ percentage: newPercentage }: any) => {
          if (newPercentage !== percentage) {
            percentage = newPercentage;
            setUploadProgress(newPercentage);
          }
        })
        .onFinish((uploadFilesData: any) => {
          setCurrentPage(1);
          const [url, fileName] = uploadFilesData.key.split('/large/');
          const data = {
            croppedArea: null,
            hasResizedVersions: true,
            id: uploadFilesData.id,
            key: `/${fileName}`,
            name: uploadFilesData?.name,
            url,
          };

          setNewGallery(prev => [{ ...data }, ...prev]); // No cropping
          if ((dataPersonaGallery?.getPersonaGallery.count || 0) > PERSONAS_GALLERY_LIMIT) {
            setAllGallery(allGallery.slice(0, allGallery.length - 1));
          }
          setUploadProgress(0);
        })
        .onError(() => {
          showToast({
            variant: 'error',
            message: 'File upload failed. Please try again.',
          });
          setUploadProgress(0);
        });

      uploadFile.start();
    },
    [allGallery, dataPersonaGallery?.getPersonaGallery.count, showToast, user?.orgID],
  );

  const onHandleSaveCropImage = useCallback(
    (croppedArea: CroppedAreaType) => {
      if (cropModalData?.mode === ActionEnum.Update) {
        updateAttachmentCropArea(croppedArea, currentUpdatedImageComponent.type!);
      }
    },
    [cropModalData?.mode, currentUpdatedImageComponent.type, updateAttachmentCropArea],
  );

  const personaGallery = useMemo(
    () => dataPersonaGallery?.getPersonaGallery.attachments || [],
    [dataPersonaGallery?.getPersonaGallery.attachments],
  );

  const gallery = useMemo(
    () => (allGallery.length ? [...newGallery, ...allGallery] : [...newGallery, ...personaGallery]),
    [allGallery, newGallery, personaGallery],
  );
  const galleryCount = useMemo(
    () => dataPersonaGallery?.getPersonaGallery.count || 0,
    [dataPersonaGallery?.getPersonaGallery.count],
  );

  const onHandleChangePage = useCallback(
    (newPage: number) => {
      if (dataPersonaGallery?.getPersonaGallery && gallery.length < galleryCount) {
        setOffset(newPage - 1);
      }
      if (
        gallery.length >= newPage * BOARDS_LIMIT ||
        gallery.length + BOARDS_LIMIT > galleryCount
      ) {
        setNewGallery([]);
        setCurrentPage(newPage);
      }
    },
    [dataPersonaGallery?.getPersonaGallery, gallery.length, galleryCount],
  );

  const onDeleteSuccess = useCallback(
    async (deleteAttachmentId: number) => {
      if (currentPage !== 1 && gallery.length === 1) {
        setCurrentPage(prev => prev - 1);
      }
      setNewGallery(prev => prev.filter(el => el.id !== deleteAttachmentId));
      setAllGallery(prev => prev.filter(el => el.id !== deleteAttachmentId));
      await refetch();
    },
    [currentPage, gallery.length, refetch],
  );

  const onHandleUpdateCroppedArea = (item: any) => {
    setSelectedPersonaImgId(item.id);
    const source = item.url
      ? `${import.meta.env.VITE_AWS_URL}/${item.url}/large${item.key}`
      : ` ${import.meta.env.VITE_AWS_URL}/${item.key}`;

    setCropModalData({
      source,
      isOpenCropModal: true,
      mode: ActionEnum.Update,
      id: item?.id,
      croppedArea: item?.croppedArea,
    });
  };

  useEffect(() => {
    if (dataPersonaGallery?.getPersonaGallery) {
      setNewGallery([]);
      setAllGallery(dataPersonaGallery.getPersonaGallery.attachments);
    }
  }, [dataPersonaGallery?.getPersonaGallery]);

  return (
    <BaseWuModal
      headerTitle={'Media library'}
      headerIcon={
        <WuButton
          Icon={<span className={'wm-question-mark text-xs'} />}
          data-testid="question-mark-test-id"
          color="primary"
          iconPosition="left"
          className={'bg-blue-200 rounded-full w-4 h-4 p-2'}
          onClick={() =>
            window.open(
              "'https://www.questionpro.com/help/add-image.html'",
              '',
              'width=600,height=400',
            )
          }
          size="md"
          variant="iconOnly"
        />
      }
      isOpen={isOpen}
      handleClose={onHandleCloseModal}
      canCloseWithOutsideClick={!isLoadingAttachImageToPersona}
      modalSize={'lg'}>
      <div>
        <div className={'persona-gallery-modal'}>
          <div className={'persona-gallery-modal--header'}>
            <div className={'persona-gallery-modal--header--search-block'}>
              <BaseWuInput
                isIconInput={true}
                placeholder="search..."
                name={'search'}
                value={search}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              />
            </div>
            {galleryCount > PERSONAS_GALLERY_LIMIT && (
              <Pagination
                currentPage={currentPage}
                allCount={galleryCount}
                perPage={PERSONAS_GALLERY_LIMIT}
                changePage={onHandleChangePage}
              />
            )}
          </div>
          <div className={'persona-gallery-modal--gallery'}>
            {isLoadingPersonaGallery ? (
              <>
                {Array(14)
                  .fill('')
                  .map((_, index) => (
                    <div className={'persona-gallery-modal--gallery--item'} key={index}>
                      <Skeleton width={160} height={160} />
                    </div>
                  ))}
              </>
            ) : (
              <>
                <div className={'persona-gallery-modal--gallery--item'}>
                  <FileUploader
                    classes={`attachments--file-uploader`}
                    multiple={false}
                    handleChange={handleUploadFiles}
                    name="file"
                    types={PERSONA_FILE_TYPES}>
                    <CustomFileUploader
                      uploadProgress={uploadProgress}
                      icon={
                        <span
                          className={'wm-add'}
                          style={{
                            fontSize: '4rem',
                            color: '#1B87E6',
                          }}
                        />
                      }
                      showText={false}
                    />
                  </FileUploader>
                </div>
                {gallery.map(item => (
                  <PersonaGalleryItem
                    key={item?.id}
                    item={item}
                    selectedPersonaImgId={selectedPersonaImgId}
                    onHandleUpdateCroppedArea={onHandleUpdateCroppedArea}
                    onDeleteSuccess={onDeleteSuccess}
                  />
                ))}
              </>
            )}
          </div>

          <div className={'persona-gallery-modal--footer'}>
            <p>To upload, drag files on the upload box.</p>
          </div>
        </div>
      </div>
      {cropModalData?.source && (
        <CropImageModal
          mode={cropModalData?.mode}
          imageFile={cropModalData?.source}
          onHandleSaveCropImage={onHandleSaveCropImage}
          isOpenCropModal={cropModalData?.isOpenCropModal}
          closeModal={() => {
            setCropModalData((prev: any) => ({
              ...prev,
              isOpenCropModal: false,
            }));
          }}
        />
      )}
    </BaseWuModal>
  );
};

export default PersonaGalleryModal;
