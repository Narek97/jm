import './style.scss';

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
      <div className="template-cards-header">
        <WuIcon icon="wm-cards" />
        <h4 data-testid="template-cards">Template cards</h4>
      </div>
      <div className="template-cards-container">
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
