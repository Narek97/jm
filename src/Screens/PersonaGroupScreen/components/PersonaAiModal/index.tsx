import { FC, useRef, useState } from 'react';

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
import ProgressBar from './ProgressBar';
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
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

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
      if (progressRef.current) {
        clearInterval(progressRef.current);
      }
      setGenerationProgress(100);
      navigate({
        to: `/workspace/${workspaceId}/persona/${response.createPersonaByAi}`,
      }).then();
    },
    onError: () => {
      if (progressRef.current) {
        clearInterval(progressRef.current);
      }
      setShowProgressBar(false);
      setGenerationProgress(0);
      showToast({
        message: 'Failed to create AI persona.',
        variant: 'error',
        duration: 2000,
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
    const hasImageGeneration = data.templateCards.includes(AiCardsEnum.ProfilePicture);
    const intervalSpeed = hasImageGeneration ? 2500 : 400;

    setShowProgressBar(true);
    setGenerationProgress(0);

    progressRef.current = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, intervalSpeed);

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
        {showProgressBar && <ProgressBar generationProgress={generationProgress} />}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative !px-8 !py-4 transition-opacity duration-300 ease-in-out [&.blurred]:opacity-40 [&.blurred]:pointer-events-none">
          <div className="!mb-4">
            <div className="flex items-center">
              <WuIcon icon="wc-ai" className="text-[2rem] !mr-1" />
              <h4 className="text-md !mr-4 font-semibold">QuestionPro AI</h4>
              <InfoIcon />
            </div>
            <p className="!ml-9">Define the context of the user persona</p>
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
                className="w-full p-3 min-h-24 max-h-24 max-w-[43.25rem]"
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

          <div className="flex items-center justify-between !mt-6">
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
        <span className="text-xs">
          QuestionPro AI may make mistakes. Your organization's data is not used to train AI models.
        </span>
      </WuModalFooter>
    </WuModal>
  );
};

export default PersonaAIModal;
