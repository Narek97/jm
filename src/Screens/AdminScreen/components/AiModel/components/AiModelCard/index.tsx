import { FC, useMemo } from 'react';

import { AI_MODEL_CARD_OPTIONS } from '../../constants';
import { AiModelType } from '../../types';

import QPLogo from '@/Assets/public/base/qp-logo.svg';
import BaseWuMenu from '@/Components/Shared/BaseWuMenu';

interface IAiModelCard {
  aiModel: AiModelType;
  onHandleDelete: (aiModel?: AiModelType) => void;
  onHandleEdit: (aiModel?: AiModelType) => void;
}

const AiModelCard: FC<IAiModelCard> = ({ aiModel, onHandleDelete, onHandleEdit }) => {
  const options = useMemo(() => {
    return AI_MODEL_CARD_OPTIONS({
      onHandleEdit,
      onHandleDelete,
    });
  }, [onHandleDelete, onHandleEdit]);

  return (
    <div className={'group card-borders w-[12.5rem] h-[12.5rem] p-1'}>
      <div className={'absolute right-2 top-2 invisible group-hover:visible!'}>
        <BaseWuMenu item={aiModel} options={options} />
      </div>

      {aiModel.attachmentUrl ? (
        <img
          src={`${import.meta.env.VITE_AWS_URL}/${aiModel.attachmentUrl}`}
          alt="Img"
          style={{ width: '100%', height: '6.25rem', objectFit: 'contain' }}
        />
      ) : (
        <img
          src={QPLogo}
          alt="QP Logo"
          style={{ width: '100%', height: '6.25rem', objectFit: 'contain' }}
        />
      )}

      <p
        className={'text-sm leading-5 text-[var(--primary)] mt-4! reduce-text max-w-100%'}
        data-testid="ai-model-card-name-test-id">
        {aiModel.name}
      </p>
      <p className={'text-sm line-clamp-2'} data-testid="ai-model-card-prompt-test-id">
        {aiModel.prompt}
      </p>
    </div>
  );
};

export default AiModelCard;
