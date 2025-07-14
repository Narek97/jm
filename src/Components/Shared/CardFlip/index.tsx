import React, { FC, MouseEvent, useEffect, useState } from 'react';

import './style.scss';

import { WuTooltip } from '@npm-questionpro/wick-ui-lib';
import ReactCardFlip from 'react-card-flip';

import FlipHoverIcon from '@/public/operations/flip-hover.svg';
import FlipIndicatorHoverIcon from '@/public/operations/flip-indicator-hover.svg';
import FlipIndicatorIcon from '@/public/operations/flip-indicator.svg';
import FlipIcon from '@/public/operations/flip.svg';

interface ICardFlip {
  frontCard: React.ReactNode;
  backCard: React.ReactNode;
  hasFlippedText?: boolean;
  flipDirection?: 'horizontal' | 'vertical';
  cardId: string;
}
const CardFlip: FC<ICardFlip> = ({
  frontCard,
  backCard,
  flipDirection = 'horizontal',
  hasFlippedText,
  cardId,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const onHandleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsFlipped(prev => !prev);
  };

  useEffect(() => {
    if (isFlipped) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 1000); // Match react-card-flip's default animation duration (0.6s)
      return () => clearTimeout(timer);
    }
  }, [isFlipped]);

  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection={flipDirection}>
      <div className={`card-front`}>
        {frontCard}
        <div className={'tooltip-section'}>
          <WuTooltip positionOffset={10} position={'bottom'} content={'Flip'}>
            <button
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={onHandleClick}
              className={`react-card-flip--btn`}
              data-testid={'react-card-flip--btn'}
              id={cardId}
              aria-label={'flip'}>
              <span className={'wm-flip-to-back'} />
            </button>
          </WuTooltip>
        </div>
      </div>

      <div className={`card-back ${isVisible ? 'visible' : 'hidden'}`}>
        {backCard}
        <div className={'tooltip-section'}>
          <WuTooltip positionOffset={10} position={'bottom'} content={'Flip'}>
            <button
              onClick={onHandleClick}
              className={`react-card-flip--btn react-card-flip--back-btn`}
              data-testid={'react-card-flip--btn-back'}
              id={cardId}
              aria-label={'flip'}>
              <span className={'wm-flip-to-front'} />
            </button>
          </WuTooltip>
        </div>
      </div>
    </ReactCardFlip>
  );
};

export default CardFlip;
