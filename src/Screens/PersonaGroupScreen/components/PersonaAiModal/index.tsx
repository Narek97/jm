import { FC } from 'react';

import './style.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  WuIcon,
  WuTextarea,
  WuButton,
  WuModalHeader,
  WuModal,
  WuModalContent,
  WuModalFooter,
  useWuShowToast,
} from '@npm-questionpro/wick-ui-lib';
import { useNavigate } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';

import DemographicInfo from './DemographicInfo';
import InfoIcon from './InfoIcon';
import TemplateCards from './TemplateCards';

import { useCreatePersonaByAiMutation } from '@/api/mutations/generated/createPersonaByAI.generated';
import { CreatePersonaByAiMutation } from '@/api/mutations/generated/createPersonaByAI.generated.ts';
import { AiCardsEnum } from '@/api/types.ts';
import { PERSONA_AI_VALIDATION_SCHEMA } from '@/Screens/PersonaGroupScreen/constnats.tsx';

interface IPersonaAIModal {
  personaGroupId: number;
  workspaceId: number;
}

const PersonaAIModal: FC<IPersonaAIModal> = ({ personaGroupId, workspaceId }) => {
  const navigate = useNavigate();
  const { showToast } = useWuShowToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(PERSONA_AI_VALIDATION_SCHEMA),
    defaultValues: {
      personaInfo: '',
      templateCards: [],
      needDemographicData: false,
    },
  });

  const { mutate, isPending } = useCreatePersonaByAiMutation<Error, CreatePersonaByAiMutation>({
    onSuccess: response => {
      navigate({
        to: `/workspace/${workspaceId}/persona/${response.createPersonaByAi}`,
      }).then();
    },
    onError: error => {
      showToast({
        variant: 'error',
        message: error?.message,
      });
    },
  });

  const onSubmit = (data: {
    personaInfo: string;
    needDemographicData: boolean;
    templateCards: AiCardsEnum[];
  }) => {
    showToast({
      variant: 'info',
      message: 'AI  persona creation is in progress. It may take a few seconds.',
    });
    mutate({
      createPersonaByAiInput: {
        ...data,
        personaGroupId,
      },
    });
  };

  return (
    <WuModal
      maxHeight="44rem"
      maxWidth="60rem"
      Trigger={
        <WuButton
          data-testid={'open-persona-ai-modal-btn-test-id'}
          className="wc-ai"
          variant="iconOnly"
        />
      }>
      <WuModalHeader data-testid="modal-header-title-test-id">QuestionPro AI</WuModalHeader>
      <WuModalContent>
        <form onSubmit={handleSubmit(onSubmit)} className="ai-container">
          <div className="ai-container--header">
            <div className="ai-container--info">
              <WuIcon icon="wc-ai" />
              <h4>QuestionPro AI</h4>
              <InfoIcon />
            </div>
            <p>Define the context of the user persona</p>
          </div>
          <Controller
            control={control}
            name="personaInfo"
            render={({ field }) => (
              <WuTextarea
                {...field}
                data-testid={'ai-user-input'}
                placeholder="Type persona content"
                variant="flat"
                className="ai-container--user-input"
              />
            )}
          />
          {errors.personaInfo && (
            <span className="validation-error">{errors.personaInfo.message}</span>
          )}

          <Controller
            control={control}
            name="templateCards"
            render={({ field: { onChange, value } }) => (
              <TemplateCards
                templateCards={value as AiCardsEnum[]}
                onToggleCard={updatedCards => onChange(updatedCards)}
              />
            )}
          />

          <div className="ai-container--demographic-create-section">
            <Controller
              control={control}
              name="needDemographicData"
              render={({ field: { onChange, value } }) => (
                <DemographicInfo needDemographicData={value} onChange={onChange} />
              )}
            />
            <WuButton
              data-testid="create-persona-ai-btn-test-id"
              variant="primary"
              size="md"
              color="primary"
              type="submit"
              loading={isPending}
              disabled={isPending}>
              Create
            </WuButton>
          </div>
        </form>
      </WuModalContent>
      <WuModalFooter>
        <span className="ai-persona-footer">
          QuestionPro AI may make mistakes. Your organization's data is not used to train AI models.
        </span>
      </WuModalFooter>
    </WuModal>
  );
};

export default PersonaAIModal;
