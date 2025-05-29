import { FC, useMemo } from 'react';

import './style.scss';
import { AiJourneyModelResponse } from '@/api/types.ts';
import QPLogo from '@/assets/public/base/qp-logo.svg';
import CustomLongMenu from '@/Components/Shared/CustomLongMenu';
import { AI_MODEL_CARD_OPTIONS } from '@/Screens/AdminScreen/components/AiModel/constants.tsx';
import { MenuViewTypeEnum } from '@/types/enum.ts';

interface IAiModelCard {
  aiModel: AiJourneyModelResponse;
  onHandleDelete: (aiModel: AiJourneyModelResponse) => void;
  onHandleEdit: (aiModel: AiJourneyModelResponse) => void;
}

const AiModelCard: FC<IAiModelCard> = ({ aiModel, onHandleDelete, onHandleEdit }) => {
  const options = useMemo(() => {
    return AI_MODEL_CARD_OPTIONS({
      onHandleEdit,
      onHandleDelete,
    });
  }, [onHandleDelete, onHandleEdit]);

  return (
    <div className={'ai-model-card'}>
      <div className={'ai-model-card--menu'}>
        <CustomLongMenu
          type={MenuViewTypeEnum.VERTICAL}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          item={aiModel}
          options={options}
          sxStyles={{
            display: 'inline-block',
            background: 'transparent',
          }}
        />
      </div>

      {aiModel.attachmentUrl ? (
        <img
          src={`${import.meta.env.VITE_AWS_URL}/${aiModel.attachmentUrl}`}
          alt="Img"
          style={{ width: '100%', height: '6.25rem', objectFit: 'contain' }}
        />
      ) : (
        <div className={'ai-model-card--logo-block'}>
          <img src={QPLogo} alt="QP Logo" />
        </div>
      )}

      <p className={'ai-model-card--name'} data-testid="ai-model-card-name-test-id">
        {aiModel.name}
      </p>
      <p className={'ai-model-card--prompt'} data-testid="ai-model-card-prompt-test-id">
        {aiModel.prompt}
      </p>
    </div>
  );
};

export default AiModelCard;
