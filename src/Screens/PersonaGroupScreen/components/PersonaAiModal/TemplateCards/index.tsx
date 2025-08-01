import { useCallback } from 'react';

import { WuIcon } from '@npm-questionpro/wick-ui-lib';

import Card from './card';

import { AiCardsEnum } from '@/api/types.ts';
import { AI_CARD_OPTIONS } from '@/Screens/PersonaGroupScreen/constnats';

const TemplateCards = ({
  templateCards,
  onToggleCard,
}: {
  templateCards: AiCardsEnum[];
  onToggleCard: (updated: AiCardsEnum[]) => void;
}) => {
  const handleToggle = useCallback(
    (cardKey: AiCardsEnum) => {
      const updated = templateCards.includes(cardKey)
        ? templateCards.filter(c => c !== cardKey)
        : [...templateCards, cardKey];

      onToggleCard(updated);
    },
    [templateCards, onToggleCard],
  );

  return (
    <>
      <div className="flex gap-1 !my-8">
        <WuIcon icon="wm-cards" className="text-[3rem]" />
        <h4 className="text-md font-semibold" data-testid="template-cards">
          Template cards
        </h4>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {AI_CARD_OPTIONS.map(({ key, title, description }) => (
          <Card
            id={key}
            title={title}
            description={description}
            isChecked={templateCards.includes(key as AiCardsEnum)}
            onToggle={() => handleToggle(key as AiCardsEnum)}
          />
        ))}
      </div>
    </>
  );
};

export default TemplateCards;
