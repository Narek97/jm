import React, { FC, MouseEvent, useEffect, useState } from 'react';

import './style.scss';

import { WuTooltip } from '@npm-questionpro/wick-ui-lib';
import ReactCardFlip from 'react-card-flip';

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
            {hasFlippedText ? (
              <div
                className={
                  'absolute w-[6px] h-[6px] rounded-[50px] bg-[#1B87E6] top-[2px] left-[2px]'
                }
              />
            ) : null}
            <button
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={onHandleClick}
              className={`react-card-flip--btn`}
              data-testid={'react-card-flip--btn'}
              id={cardId}
              aria-label={'flip'}>
              <span
                className={'wm-flip-to-back'}
                style={{
                  color: isHovered ? '#1B3380' : '#545E6B',
                }}
              />
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
              <span
                className={'wm-flip-to-front'}
                style={{
                  color: isHovered ? '#1B3380' : '#545E6B',
                }}
              />
            </button>
          </WuTooltip>
        </div>
      </div>
    </ReactCardFlip>
  );
};

export default CardFlip;
