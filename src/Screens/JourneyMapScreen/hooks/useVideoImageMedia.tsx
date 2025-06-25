import { ChangeEvent, useCallback, useState } from 'react';

import { useRecoilValue, useSetRecoilState } from 'recoil';

import { useCrudMapBoxElement } from '@/containers/journey-map-container/hooks/useCRUDMapBoxElement';
import { useAddBoxElementMutation } from '@/gql/mutations/generated/addBoxElement.generated';
import { useRemoveBoxElementMutation } from '@/gql/mutations/generated/removeBoxElement.generated';
import { useUpdateBoxElementMutation } from '@/gql/mutations/generated/updateBoxElement.generated';
import { AttachmentsEnum } from '@/gql/types';
import { selectedJourneyMapPersona } from '@/store/atoms/journeyMap.atom';
import { snackbarState } from '@/store/atoms/snackbar.atom';
import { validateFile } from '@/utils/helpers/general';
import { UploadFile } from '@/utils/helpers/uploader';
import { ActionsEnum, FileTypeEnum } from '@/utils/ts/enums/global-enums';
import { ObjectKeysType } from '@/utils/ts/types/global-types';
import { BoxItemType } from '@/utils/ts/types/journey-map/journey-map-types';

const useVideoImageMedia = ({ rowId, rowItem }: { rowItem: BoxItemType; rowId: number }) => {
  const { crudBoxElement } = useCrudMapBoxElement();

  const setSnackbar = useSetRecoilState(snackbarState);

  const selectedPerson = useRecoilValue(selectedJourneyMapPersona);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isViewModalOpen, setIsOpenViewModal] = useState<boolean>(false);
  const [currentUrl, setCurrentUrl] = useState<any>({});

  const { mutate: addBoxElement } = useAddBoxElementMutation({
    onSuccess: response => {
      crudBoxElement(response.addBoxElement, ActionsEnum.CREATE);
      setIsUploading(false);
    },
  });

  const { mutate: updateBoxElement } = useUpdateBoxElementMutation({
    onSuccess: response => {
      crudBoxElement(response?.updateBoxElement, ActionsEnum.UPDATE);
    },
  });

  const { mutate: removeBoxElement } = useRemoveBoxElementMutation({
    onSuccess: response => {
      crudBoxElement(response?.removeBoxElement, ActionsEnum.DELETE);
    },
  });

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
        setSnackbar(prev => ({
          ...prev,
          open: true,
          type: 'warning',
          message: `Only ${allowedExtensions.join(', ')} files are allowed.`,
        }));
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
          setSnackbar(prev => ({
            ...prev,
            open: true,
            type: 'error',
            message: 'File upload failed. Please try again.',
          }));
          reject(new Error('File upload failed'));
        });
      });
    },
    [rowId, setSnackbar],
  );

  const addItem = useCallback(
    async (e: ChangeEvent<HTMLInputElement>, stepId: number, type: FileTypeEnum) => {
      setIsUploading(true);
      const uploadFilesData = await handleFileUpload(e, type);
      if (uploadFilesData) {
        addBoxElement({
          addBoxElementInput: {
            rowId: rowId,
            imageId: uploadFilesData?.id,
            columnId: rowItem?.columnId!,
            text: uploadFilesData?.key,
            personaId: selectedPerson?.id || null,
            stepId,
          },
        });
      }
      setIsUploading(false);
    },
    [addBoxElement, handleFileUpload, rowId, rowItem?.columnId, selectedPerson?.id],
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
              attachmentId: uploadFilesData?.id,
              boxElementId,
              text: uploadFilesData?.key,
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
