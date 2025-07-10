import React, { FC } from 'react';

import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './style.scss';

interface ISlickCarousel {
  cards: Array<any>;
  renderFunction: (card: any) => React.ReactNode;
  restSettings: {
    dots?: boolean;
    infinite?: boolean;
    speed?: number;
    slidesToShow?: number;
    slidesToScroll?: number;
  };
}

const SlickCarousel: FC<ISlickCarousel> = ({
  cards,
  renderFunction,
  restSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
  },
}) => {
  const settings = {
    ...restSettings,
  };

  return (
    <div className={'slick-carousel'}>
      {cards.length >= 5 ? (
        <Slider {...settings}>
          {cards.map(card => (
            <div key={card.id}>{renderFunction(card)}</div>
          ))}
        </Slider>
      ) : (
        <div className={'slick-carousel--slick-track'}>
          {cards.map(card => (
            <div className={'slick-carousel--slick-slide'} key={card.id}>
              {renderFunction(card)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SlickCarousel;
