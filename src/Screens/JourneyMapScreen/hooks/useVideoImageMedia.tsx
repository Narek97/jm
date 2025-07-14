import { ChangeEvent, useCallback, useState } from 'react';

import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';

import {
  AddBoxElementMutation,
  useAddBoxElementMutation,
} from '@/api/mutations/generated/addBoxElement.generated';
import {
  RemoveBoxElementMutation,
  useRemoveBoxElementMutation,
} from '@/api/mutations/generated/removeBoxElement.generated.ts';
import {
  UpdateBoxElementMutation,
  useUpdateBoxElementMutation,
} from '@/api/mutations/generated/updateBoxElement.generated.ts';
import { AttachmentsEnum } from '@/api/types.ts';
import { validateFile } from '@/Screens/JourneyMapScreen/helpers/validateFile.ts';
import { useCrudMapBoxElement } from '@/Screens/JourneyMapScreen/hooks/useCRUDMapBoxElement.tsx';
import { BoxType } from '@/Screens/JourneyMapScreen/types.ts';
import { useJourneyMapStore } from '@/store/journeyMap.ts';
import { ObjectKeysType } from '@/types';
import { ActionsEnum, FileTypeEnum } from '@/types/enum.ts';
import { UploadFile } from '@/utils/uploader.ts';

const useVideoImageMedia = ({ boxItem, rowId }: { boxItem: BoxType; rowId: number }) => {
  const { crudBoxElement } = useCrudMapBoxElement();
  const { showToast } = useWuShowToast();

  const { selectedJourneyMapPersona } = useJourneyMapStore();

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isViewModalOpen, setIsOpenViewModal] = useState<boolean>(false);
  const [currentUrl, setCurrentUrl] = useState<string>('');

  const { mutate: addBoxElement } = useAddBoxElementMutation<Error, AddBoxElementMutation>({
    onSuccess: response => {
      crudBoxElement(response.addBoxElement, ActionsEnum.CREATE);
      setIsUploading(false);
    },
    onError: error => {
      showToast({
        variant: 'error',
        message: error?.message,
      });
    },
  });

  const { mutate: updateBoxElement } = useUpdateBoxElementMutation<Error, UpdateBoxElementMutation>(
    {
      onSuccess: response => {
        crudBoxElement(response?.updateBoxElement, ActionsEnum.UPDATE);
      },
      onError: error => {
        showToast({
          variant: 'error',
          message: error?.message,
        });
      },
    },
  );

  const { mutate: removeBoxElement } = useRemoveBoxElementMutation<Error, RemoveBoxElementMutation>(
    {
      onSuccess: response => {
        crudBoxElement(response?.removeBoxElement, ActionsEnum.DELETE);
      },
      onError: error => {
        showToast({
          variant: 'error',
          message: error?.message,
        });
      },
    },
  );

  const deleteItem = useCallback(
    (boxElementId: number) => {
      removeBoxElement({
        removeBoxElementInput: {
          boxElementId,
        },
      });
    },
    [removeBoxElement],
  );

  const viewItem = useCallback((imageUrl: string) => {
    setCurrentUrl(imageUrl);
    setIsOpenViewModal(true);
  }, []);

  const closeViewModal = useCallback(() => {
    setIsOpenViewModal(false);
  }, []);

  const handleFileUpload = useCallback(
    async (
      e: ChangeEvent<HTMLInputElement>,
      fileType: FileTypeEnum,
    ): Promise<ObjectKeysType | undefined> => {
      const file = e?.target?.files?.[0];
      if (!file) return;

      const { valid, extension, allowedExtensions } = await validateFile(file, fileType);

      if (!valid || !extension) {
        showToast({
          variant: 'warning',
          message: `Only ${allowedExtensions.join(', ')} files are allowed.`,
        });
        return;
      }

      return new Promise((resolve, reject) => {
        const uploadFile = new UploadFile({
          fileType: extension,
          file,
          relatedId: rowId,
          type: AttachmentsEnum.MapRow,
        });

        uploadFile.start();

        uploadFile.onFinish((data: ObjectKeysType) => {
          resolve(data);
        });

        uploadFile.onError(() => {
          setIsUploading(false);
          showToast({
            variant: 'error',
            message: `'File upload failed. Please try again.'`,
          });
          reject(new Error('File upload failed'));
        });
      });
    },
    [rowId, showToast],
  );

  const addItem = useCallback(
    async (e: ChangeEvent<HTMLInputElement>, stepId: number, type: FileTypeEnum) => {
      setIsUploading(true);
      const uploadFilesData = await handleFileUpload(e, type);
      if (uploadFilesData) {
        addBoxElement({
          addBoxElementInput: {
            rowId: rowId,
            imageId: uploadFilesData.id as number,
            text: (uploadFilesData.key as string) || '',
            columnId: boxItem.columnId,
            personaId: selectedJourneyMapPersona?.id || null,
            stepId,
          },
        });
      }
      setIsUploading(false);
    },
    [addBoxElement, handleFileUpload, rowId, boxItem.columnId, selectedJourneyMapPersona?.id],
  );

  const updateItem = useCallback(
    async (
      e: ChangeEvent<HTMLInputElement>,
      {
        boxElementId,
        callback,
        imageId,
      }: { boxElementId: number; callback: () => void; imageId?: number },
      fileType: FileTypeEnum,
    ) => {
      const uploadFilesData = await handleFileUpload(e, fileType);
      if (uploadFilesData) {
        updateBoxElement(
          {
            updateBoxDataInput: {
              attachmentId: uploadFilesData.id as number,
              text: (uploadFilesData.key as string) || '',
              boxElementId,
              imageId,
            },
          },
          {
            onSuccess: () => {
              callback();
            },
            onError: () => {
              callback();
            },
          },
        );
      } else {
        callback();
      }
    },
    [handleFileUpload, updateBoxElement],
  );

  return {
    deleteItem,
    addItem,
    viewItem,
    updateItem,
    isUploading,
    isViewModalOpen,
    currentUrl,
    closeViewModal,
  };
};

export default useVideoImageMedia;
