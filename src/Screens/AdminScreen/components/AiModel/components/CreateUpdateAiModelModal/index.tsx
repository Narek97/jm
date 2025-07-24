import { FC, useMemo, useState } from 'react';

import './style.scss';

import { yupResolver } from '@hookform/resolvers/yup';
import { useWuShowToast, WuButton, WuToggle } from '@npm-questionpro/wick-ui-lib';
import { FileUploader } from 'react-drag-drop-files';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';

import { AiModelFormType, AiModelType } from '../../types';

import {
  CreateAiJourneyModelMutation,
  useCreateAiJourneyModelMutation,
} from '@/api/mutations/generated/createAiJourneyModel.generated.ts';
import {
  UpdateAiJourneyModelMutation,
  useUpdateAiJourneyModelMutation,
} from '@/api/mutations/generated/updateAiJourneyModel.generated.ts';
import { GetOrgsQuery, useGetOrgsQuery } from '@/api/queries/generated/getOrgs.generated.ts';
import { AttachmentsEnum } from '@/api/types';
import BaseWuInput from '@/Components/Shared/BaseWuInput';
import BaseWuModal from '@/Components/Shared/BaseWuModal';
import BaseWuSelect from '@/Components/Shared/BaseWuSelect';
import BaseWuTextarea from '@/Components/Shared/BaseWuTextarea';
import CustomFileUploader from '@/Components/Shared/CustomFileUploader';
import CustomFileUploader2 from '@/Components/Shared/CustomFileUploader/index2.tsx';
import { querySlateTime } from '@/Constants';
import {
  AI_MODEL_FILE_TYPES,
  AI_MODEL_FORM_ELEMENTS,
  CREATE_AI_MODEL_VALIDATION_SCHEMA,
} from '@/Screens/AdminScreen/components/AiModel/constants.tsx';
import { useUserStore } from '@/Store/user.ts';
import { UploadFile } from '@/utils/uploader';

interface ICreateUpdateAiModelModal {
  aiModel: AiModelType | null;
  isOpen: boolean;
  onHandleAddNewAiModel: (newInterview: AiModelType) => void;
  onHandleUpdateAiModel: (newInterview: AiModelType) => void;
  handleClose: () => void;
}

const CreateUpdateAiModelModal: FC<ICreateUpdateAiModelModal> = ({
  aiModel,
  isOpen,
  onHandleAddNewAiModel,
  onHandleUpdateAiModel,
  handleClose,
}) => {
  const [deletedOrgIds, setDeletedOrgIds] = useState<Array<number>>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(aiModel?.attachmentUrl || null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const { showToast } = useWuShowToast();

  const { user } = useUserStore();

  const { data: orgsData, isLoading: isLoadingOrgsData } = useGetOrgsQuery<GetOrgsQuery, Error>(
    {
      getOrgsInput: {
        search: '',
      },
    },
    {
      staleTime: querySlateTime,
    },
  );

  const { mutate: creteAiJourneyModel, isPending: isLoadingCreateAiJourneyModel } =
    useCreateAiJourneyModelMutation<Error, CreateAiJourneyModelMutation>({
      onSuccess: response => {
        onHandleAddNewAiModel(response.createAiJourneyModel);
        handleClose();
      },
      onError: error => {
        showToast({
          variant: 'error',
          message: error?.message,
        });
      },
    });

  const { mutate: updateAiJourneyModel, isPending: isLoadingUpdateAiJourneyModel } =
    useUpdateAiJourneyModelMutation<Error, UpdateAiJourneyModelMutation>({
      onSuccess: response => {
        onHandleUpdateAiModel(response.updateAiJourneyModel);
        handleClose();
      },
      onError: error => {
        showToast({
          variant: 'error',
          message: error?.message,
        });
      },
    });

  const onHandleCreateOrUpdateAiModel = (
    formData: AiModelFormType,
    attachmentId?: number | null,
  ) => {
    if (aiModel) {
      const input = {
        name: formData.name,
        universal: formData.universal,
        aiModelId: aiModel.id,
        attachmentId,
        deleteOrgIds: [...new Set(deletedOrgIds)],
        createOrgIds: [...new Set(formData.orgIds)],
        prompt: formData.prompt.replace(/\[Interview transcript]/g, '').trim(),
        transcriptPlace: formData.prompt.split('[Interview transcript]')[0].length,
      };
      updateAiJourneyModel({
        updateAiJourneyInput: input,
      });
    } else {
      creteAiJourneyModel({
        createAiJourneyInput: {
          ...formData,
          attachmentId,
          orgIds: [...new Set(formData.orgIds)],
          transcriptPlace: formData.prompt.split('[Interview transcript]')[0].length,
          prompt: formData.prompt.replace(/\[Interview transcript]/g, '').trim(),
        },
      });
    }
  };

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<AiModelFormType>({
    resolver: yupResolver(CREATE_AI_MODEL_VALIDATION_SCHEMA),
    defaultValues: {
      name: aiModel?.name || '',
      prompt:
        (aiModel?.prompt || '').slice(0, aiModel?.transcriptPlace) +
          '[Interview transcript]' +
          (aiModel?.prompt || '').slice(aiModel?.transcriptPlace) || '[Interview transcript]',
      universal: aiModel?.universal || false,
      orgIds: aiModel?.selectedOrgIds || [],
    },
  });

  const universal = watch('universal');

  const { replace } = useFieldArray({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    name: 'orgIds',
    control,
  });

  const onHandleDelete = () => {
    setAttachmentUrl(null);
    setFile(null);
    setSelectedImage(null);
  };

  const onHandleUploadFile = async (formData: AiModelFormType) => {
    if (file) {
      let percentage: number | undefined = undefined;
      const indexLastsSlash = file.type.lastIndexOf('/');
      const fType = file.type.substring(indexLastsSlash + 1);
      const videoUploaderOptions = {
        fileType: fType,
        file: file,
        relatedId: user?.orgID,
        type: AttachmentsEnum.AiModel,
      };
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
        .onFinish((uploadFilesData: any) => {
          setAttachmentUrl(uploadFilesData.key);
          setUploadProgress(0);
          onHandleCreateOrUpdateAiModel(formData, uploadFilesData.id);
        })
        .onError(() => {
          setUploadProgress(0);
          onHandleCreateOrUpdateAiModel(formData);
        });

      uploadFile.start();
    }
  };

  const onHandleSelectFiles = async (newFile: File | null) => {
    if (newFile) {
      setSelectedImage(URL.createObjectURL(newFile));
      setFile(newFile);
    }
  };

  const onHandleSaveLink = async (formData: AiModelFormType) => {
    if (file) {
      await onHandleUploadFile(formData);
    } else {
      if (attachmentUrl) {
        onHandleCreateOrUpdateAiModel(formData);
      } else {
        onHandleCreateOrUpdateAiModel(formData, null);
      }
    }
  };

  const menuItems = useMemo(
    () =>
      orgsData?.getOrgs.map(org => ({
        id: org.id,
        name: org.name?.trim() || 'Untitled',
      })) || [],
    [orgsData?.getOrgs],
  );

  const defaultSelectedItems = useMemo(
    () => menuItems.filter(item => (aiModel?.selectedOrgIds || []).includes(+item.id)),
    [aiModel?.selectedOrgIds, menuItems],
  );

  return (
    <BaseWuModal
      headerTitle={`${aiModel ? 'Edit' : 'Create'} AI model`}
      maxHeight={'800'}
      modalSize={'lg'}
      isOpen={isOpen}
      isProcessing={
        isLoadingCreateAiJourneyModel || isLoadingUpdateAiJourneyModel || !!uploadProgress
      }
      handleClose={handleClose}
      canCloseWithOutsideClick={true}
      ModalConfirmButton={
        <WuButton
          type="submit"
          data-testid={'submit-interview-btn-test-id'}
          disabled={
            isLoadingCreateAiJourneyModel || isLoadingUpdateAiJourneyModel || !!uploadProgress
          }>
          {aiModel ? 'Update' : 'Create'}
        </WuButton>
      }>
      <div className={'create-update-ai-model-modal'} data-testid={'create-update-ai-model-modal'}>
        <form
          className={'create-update-ai-model-modal--form'}
          onSubmit={handleSubmit(onHandleSaveLink)}
          id="interviewform">
          {AI_MODEL_FORM_ELEMENTS.map(element => (
            <div
              className={`create-update-ai-model-modal--content-input ${element.name}`}
              key={element.name}>
              <label
                className={'create-update-ai-model-modal--content-input--label'}
                htmlFor="name">
                {element.title}
              </label>
              <div className={'create-update-ai-model-modal--prompt-info'}>
                {element.name === 'prompt' &&
                  '* please add prompt text before or after the [interview transcript] and never delete it so that the model works as expected.'}
              </div>
              <Controller
                name={element.name}
                control={control}
                render={({ field: { onChange, value } }) =>
                  element.name === 'name' ? (
                    <BaseWuInput
                      data-testid={`create-ai-model-${element.name}-input-test-id`}
                      className={
                        errors[element.name]?.message ? 'create-ai-model--error-input' : ''
                      }
                      maxLength={50}
                      placeholder={element.placeholder}
                      id={element.name}
                      type={element.type}
                      onChange={onChange}
                      disabled={isLoadingCreateAiJourneyModel || isLoadingUpdateAiJourneyModel}
                      value={value || ''}
                      isIconInput={false}
                    />
                  ) : (
                    <BaseWuTextarea
                      data-testid={`create-ai-model-${element.name}-input-test-id`}
                      placeholder={element.placeholder}
                      id={element.name}
                      onChange={onChange}
                      disabled={isLoadingCreateAiJourneyModel || isLoadingUpdateAiJourneyModel}
                      value={value || ''}
                      rows={4}
                    />
                  )
                }
              />
              <span className={'validation-error'}>
                {(errors && errors[element.name]?.message) || ''}
              </span>
            </div>
          ))}

          <div className={'create-update-ai-model-modal--file-upload'}>
            {attachmentUrl && (
              <button
                className={'create-update-ai-model-modal--delete-file-icon'}
                aria-label={'Delete'}
                onClick={onHandleDelete}>
                <span className={'wm-delete'} />
              </button>
            )}
            <FileUploader
              id={'touchpoint-name'}
              classes={`attachments--file-uploader`}
              handleChange={onHandleSelectFiles}
              name="file"
              types={AI_MODEL_FILE_TYPES}>
              <CustomFileUploader
                uploadProgress={uploadProgress}
                content={
                  selectedImage ? (
                    <div
                      data-testid={'ai-model-selected-image'}
                      className={'create-update-ai-model-modal--file-container'}>
                      <img
                        src={selectedImage}
                        alt="Img"
                        style={{
                          width: '11.25rem',
                          height: '5.625rem',
                        }}
                      />
                    </div>
                  ) : attachmentUrl ? (
                    <div className={'create-update-ai-model-modal--file-container'}>
                      <img
                        src={`${import.meta.env.VITE_AWS_URL}/${attachmentUrl}`}
                        alt="Img"
                        style={{
                          width: '11.25rem',
                          height: '5.625rem',
                        }}
                      />
                    </div>
                  ) : (
                    <CustomFileUploader2 title={'Choose image'} />
                  )
                }
              />
            </FileUploader>
          </div>

          <Controller
            name={'universal'}
            control={control}
            render={({ field: { onChange, value } }) => (
              <WuToggle
                label="Universal"
                labelPosition="left"
                id={'universal'}
                data-testid={'create-update-ai-model-modal-switch-test-id'}
                checked={value}
                disabled={isLoadingCreateAiJourneyModel || isLoadingUpdateAiJourneyModel}
                onChange={onChange}
                className="wu-toggle-container wu-toggle-label"
              />
            )}
          />
          {universal ? null : (
            <>
              {isLoadingOrgsData ? (
                <Skeleton height={50} />
              ) : (
                <>
                  <BaseWuSelect
                    data={menuItems}
                    onSelect={data => {
                      const orgIds = (data as typeof menuItems).map(item => item.id);
                      replace(orgIds);
                      setDeletedOrgIds(orgIds);
                    }}
                    defaultValue={defaultSelectedItems}
                    multiple={true}
                    accessorKey={{
                      label: 'name',
                      value: 'id',
                    }}
                  />
                  <span className={'validation-error'}>
                    {(errors && errors.orgIds?.message) || ''}
                  </span>
                </>
              )}
            </>
          )}
        </form>
      </div>
    </BaseWuModal>
  );
};

export default CreateUpdateAiModelModal;
