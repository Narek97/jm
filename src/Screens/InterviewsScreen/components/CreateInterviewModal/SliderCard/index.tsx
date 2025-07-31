import { FC } from 'react';

import QPLogo from '@/Assets/public/base/qp-logo.svg';

interface ISliderCard {
  card: {
    id: number;
    name: string;
    prompt: string;
    aiJourneyModelId: number | null;
    attachmentUrl: string | null;
  };
  selectedSliderCardId: number | null;
  onHandleSelectAiModel: (id: number) => void;
}

const SliderCard: FC<ISliderCard> = ({ card, selectedSliderCardId, onHandleSelectAiModel }) => {
  return (
    <div
      className={`w-[11.25rem] h-[11.25rem] border border-solid border-gray-200 p-2.5 cursor-pointer p-2 ${
        card.id === selectedSliderCardId ? 'border border-solid border-[var(--primary)]!' : ''
      }`}
      key={card.id}
      onClick={() => {
        onHandleSelectAiModel(card.id);
      }}>
      {card.attachmentUrl ? (
        <img
          className={'object-contain mx-auto my-auto max-h-1/2 h-1/2'}
          src={`${import.meta.env.VITE_AWS_URL}/${card.attachmentUrl}`}
          alt="Img"
        />
      ) : (
        <div className={'h-1/2 flex items-center justify-center'}>
          <img className={'object-contain'} src={QPLogo} alt="QP Logo" />
        </div>
      )}

      <p className={'reduce-text text-[var(--primary)] text-[0.875rem] mt-2! '}>{card.name}</p>
      <p className={'line-clamp-2 text-[0.875rem]'}>
        {card.prompt}
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maiores modi molestiae nulla quia
        quibusdam, sit tempore. Beatae corporis dolorem doloribus error et exercitationem, facere
        fuga nostrum saepe sed sunt vero.
      </p>
    </div>
  );
};

export default SliderCard;
