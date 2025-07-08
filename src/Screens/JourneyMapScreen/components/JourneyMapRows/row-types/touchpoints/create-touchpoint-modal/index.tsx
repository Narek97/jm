import React, { FC, useCallback, useState } from 'react';

import './style.scss';

import Image from 'next/image';

import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { useQueryClient } from '@tanstack/react-query';
import { FileUploader } from 'react-drag-drop-files';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import CustomButton from '@/components/atoms/custom-button/custom-button';
import CustomFileUploader from '@/components/atoms/custom-file-uploader/custom-file-uploader';
import CustomFileUploader2 from '@/components/atoms/custom-file-uploader/custom-file-uploader2';
import CustomInput from '@/components/atoms/custom-input/custom-input';
import CustomModal from '@/components/atoms/custom-modal/custom-modal';
import SearchNounProjectIcon from '@/containers/settings-container/outcomes/search-noun-project-icon';
import {
  CreateIconAttachmentMutation,
  useCreateIconAttachmentMutation,
} from '@/gql/mutations/generated/createIconAttachment.generated';
import { useUpdateAttachmentTouchPointMutation } from '@/gql/mutations/generated/updateAttachmentTouchPoint.generated';
import { AttachmentsEnum, MapRowTypeEnum, UpdateAttachmentTouchPointInput } from '@/gql/types';
import { journeyMapState } from '@/store/atoms/journeyMap.atom';
import { userState } from '@/store/atoms/user.atom';
import { validateFile } from '@/utils/helpers/general';
import { UploadFile } from '@/utils/helpers/uploader';
import { FileTypeEnum, TouchpointIconsEnum } from '@/utils/ts/enums/global-enums';
import { ObjectKeysType } from '@/utils/ts/types/global-types';
import { JourneyMapTouchpointIconsType } from '@/utils/ts/types/journey-map/journey-map-types';

import ModalHeader from '../../../../../../components/molecules/modal-header';

interface ICreateTouchpointModal {
  touchPointData?: (JourneyMapTouchpointIconsType & { attachmentId?: number }) | null;
  isOpen: boolean;
  onHandleCloseModal: () => void;
}

const CreateTouchpointModal: FC<ICreateTouchpointModal> = ({
  touchPointData,
  isOpen,
  onHandleCloseModal,
}) => {
  const queryClient = useQueryClient();

  const { showToast } = useWuShowToast();

  const user = useRecoilValue(userState);
  const setJourneyMap = useSetRecoilState(journeyMapState);

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [fileName, setFileName] = useState<string>(touchPointData ? touchPointData?.name! : '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileExtension, setFileExtension] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    touchPointData ? touchPointData?.url! : '',
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [iconSearchText, setIconSearchText] = useState<string>('');
  const [isNounProjectIcon, setIsNounProjectIcon] = useState<boolean>(false);

  const updateJourneyMapTouchPoints = useCallback(
    (url: string, newUrl: string, title: string) => {
      setJourneyMap(prev => {
        const rows = prev.rows.map(r => {
          if (r.rowFunction === MapRowTypeEnum.Touchpoints) {
            return {
              ...r,
              boxes: r.boxes?.map(box => {
                return {
                  ...box,
                  touchPoints: box.touchPoints.map(touchPointItem => {
                    if (touchPointItem?.iconUrl === url) {
                      return {
                        ...touchPointItem,
                        iconUrl: newUrl,
                        title,
                      };
                    }
                    return touchPointItem;
                  }),
                };
              }),
            };
          }
          return r;
        });
        return { ...prev, rows };
      });
    },
    [setJourneyMap],
  );

  const refetch = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['GetTouchPointIcons'],
    });
  };

  const { mutate: mutateCreateIconAttachment, isLoading: isLoadingIconAttachment } =
    useCreateIconAttachmentMutation<CreateIconAttachmentMutation, Error>({
      onSuccess: async () => {
        await refetch();
        onHandleCloseModal();
      },
    });

  const { mutate: mutateUpdateAttachmentTouchPoint, isLoading: isLoadingUpdateAttachment } =
    useUpdateAttachmentTouchPointMutation<UpdateAttachmentTouchPointInput, Error>({
      onSuccess: async (_, variables) => {
        updateJourneyMapTouchPoints(
          touchPointData?.url!,
          isNounProjectIcon ? variables?.updateAttachmentTouchPointInput?.newIconId! : imagePreview,
          fileName,
        );
        await refetch();
        onHandleCloseModal();
      },
    });

  const onHandleFileSelect = async (file: File) => {
    if (file) {
      const { valid, extension, allowedExtensions } = await validateFile(file, FileTypeEnum.IMAGE);
      if (!valid || !extension) {
        showToast({
          variant: 'warning',
          message: `Only ${allowedExtensions.join(', ')} files are allowed.`,
        });
        return;
      }
      setSelectedFile(file);
      setFileExtension(extension);
      setIsNounProjectIcon(false);
      const reader = new FileReader();
      reader.onload = event => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file as any);
    }
  };

  const onHandleUploadNounProjectIcon = () => {
    mutateCreateIconAttachment({
      createIconInput: {
        name: fileName || iconSearchText,
        url: imagePreview,
      },
    });
  };

  const handleUploadFiles = async (onFinish: (data: ObjectKeysType) => void) => {
    if (selectedFile && fileExtension) {
      let percentage: number | undefined = undefined;

      const videoUploaderOptions = {
        fileType: fileExtension,
        file: selectedFile,
        relatedId: user.orgID,
        category: TouchpointIconsEnum.CUSTOM,
        fileName,
        type: AttachmentsEnum.TouchpointIcon,
      };
      setIsLoading(true);
      setUploadProgress(1);
      const uploadFile = new UploadFile(videoUploaderOptions);
      uploadFile
        .onProgress(({ percentage: newPercentage }: any) => {
          // to avoid the same percentage to be logged twice
          if (newPercentage !== percentage) {
            percentage = newPercentage;
            setUploadProgress(newPercentage);
          }
        })
        .onFinish(async (data: ObjectKeysType) => {
          onFinish(data);
        })
        .onError(() => {
          setIsLoading(false);
          setUploadProgress(0);
          showToast({
            variant: 'error',
            message: 'File upload failed. Please try again.',
          });
        });

      uploadFile.start();
    }
  };

  const addTouchPointAttachmentWithCustomImage = async () => {
    await handleUploadFiles(() => {
      refetch();
      setFileName('');
      setUploadProgress(0);
      setIsLoading(false);
      onHandleCloseModal();
    });
  };

  const addAttachment = async (isNounProjectIcon: boolean) => {
    if (isNounProjectIcon) {
      onHandleUploadNounProjectIcon();
    } else {
      await addTouchPointAttachmentWithCustomImage();
    }
  };

  const updateTouchPointData = async (data: UpdateAttachmentTouchPointInput) => {
    new Promise(res => {
      mutateUpdateAttachmentTouchPoint(
        {
          updateAttachmentTouchPointInput: data,
        },
        {
          onSuccess: response => {
            res(response);
          },
        },
      );
    });
  };

  const updateAttachment = async (isNounProjectIcon: boolean) => {
    let updateData: ObjectKeysType = {};
    if (touchPointData?.type === 'NOUN_PROJECT_ICON') {
      updateData.iconId = touchPointData.url;
    } else {
      updateData.customIconId = touchPointData?.attachmentId!;
    }
    // updating only name
    if (touchPointData?.name !== fileName && touchPointData?.url === imagePreview) {
      mutateUpdateAttachmentTouchPoint(
        {
          updateAttachmentTouchPointInput: {
            name: fileName,
            attachmentId: touchPointData?.attachmentId!,
            ...updateData,
          },
        },
        {
          onSuccess: () => {
            updateJourneyMapTouchPoints(touchPointData?.url!, touchPointData?.url!, fileName);
            refetch();
            onHandleCloseModal();
          },
        },
      );
    }
    // non-project icon -> non project icon
    else if (
      isNounProjectIcon &&
      ((touchPointData?.type === 'NOUN_PROJECT_ICON' && touchPointData.url !== imagePreview) ||
        touchPointData?.type !== 'NOUN_PROJECT_ICON')
    ) {
      mutateCreateIconAttachment(
        {
          createIconInput: {
            name: fileName || iconSearchText,
            url: imagePreview,
          },
        },
        {
          onSuccess: async data => {
            if (touchPointData?.type === 'NOUN_PROJECT_ICON') {
              updateData.newIconId = imagePreview;
            } else {
              updateData.customIconId = touchPointData?.attachmentId;
              updateData.newIconId = imagePreview;
            }

            await updateTouchPointData({
              name: fileName,
              newAttachmentId: data?.createIconAttachment,
              attachmentId: touchPointData?.attachmentId!,
              ...updateData,
            });
          },
        },
      );
    }
    // AMAZON IMAGE TO -> new image
    else if (!isNounProjectIcon && touchPointData?.url !== imagePreview) {
      await handleUploadFiles(data => {
        const attachmentId = data?.id;
        setImagePreview(`${process.env.NEXT_PUBLIC_AWS_URL}/${data?.key}`);
        updateData.newCustomIconId = attachmentId;

        mutateUpdateAttachmentTouchPoint(
          {
            updateAttachmentTouchPointInput: {
              name: fileName,
              attachmentId: touchPointData?.attachmentId!,
              newAttachmentId: attachmentId,
              ...updateData,
            },
          },
          {
            onSuccess: () => {
              refetch();
              setFileName('');
              setUploadProgress(0);
              setIsLoading(false);
              onHandleCloseModal();
            },
          },
        );
      });
    }
  };

  const handleSelectIcon = useCallback((thumbnailUrl: string, searchText: string) => {
    setImagePreview(thumbnailUrl);
    setIconSearchText(searchText);
    setIsNounProjectIcon(true);
  }, []);

  return (
    <CustomModal
      isOpen={isOpen}
      handleClose={onHandleCloseModal}
      canCloseWithOutsideClick={!isLoading || !isLoadingIconAttachment}>
      <ModalHeader title={'Media library'} />
      <div className={'create-touchpoint-modal'}>
        <div className={'create-touchpoint-modal--content'}>
          <div className={'create-touchpoint-modal--name-block'}>
            <label htmlFor="touchpoint-name">Name</label>
            <CustomInput
              value={fileName}
              onChange={e => setFileName(e.target.value)}
              id={'touchpoint-name'}
              data-testid={'create-touchpoint-name-test-id'}
              sxStyles={{ marginTop: '0.5rem' }}
            />
          </div>
          <div className={'create-touchpoint-modal--icon-block'}>
            <label htmlFor="touchpoint-icon">Icon</label>
            <div className={'create-touchpoint-modal--icon-frame'}>
              <FileUploader
                id={'touchpoint-name'}
                classes={`attachments--file-uploader`}
                multiple={false}
                handleChange={onHandleFileSelect}
                name="file">
                <CustomFileUploader
                  uploadProgress={uploadProgress}
                  content={
                    imagePreview ? (
                      <Image
                        src={imagePreview}
                        data-testid={'create-touchpoint-image'}
                        alt="Selected File Preview"
                        width={100}
                        height={100}
                        style={{ width: '6.25rem', height: '6.25rem' }}
                      />
                    ) : (
                      <CustomFileUploader2 />
                    )
                  }
                />
              </FileUploader>
            </div>
          </div>
          <div className={'create-touchpoint-modal--or-block'}>
            <p>Or</p>
          </div>
          <SearchNounProjectIcon onIconSelect={handleSelectIcon} />
        </div>

        <div className={'base-modal-footer'}>
          <button
            className={'base-modal-footer--cancel-btn'}
            onClick={onHandleCloseModal}
            disabled={isLoading || isLoadingIconAttachment}>
            Cancel
          </button>
          <CustomButton
            startIcon={false}
            data-testid={'create-touchpoint-btn-test-id'}
            sxStyles={{ width: '6.125rem' }}
            onClick={() =>
              touchPointData
                ? updateAttachment(isNounProjectIcon)
                : addAttachment(isNounProjectIcon)
            }
            disabled={isLoading || isLoadingIconAttachment || !imagePreview}
            isLoading={isLoading || isLoadingIconAttachment || isLoadingUpdateAttachment}
            className={imagePreview ? '' : 'disabled-btn'}>
            {touchPointData ? 'Update' : 'Add'}
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default CreateTouchpointModal;
