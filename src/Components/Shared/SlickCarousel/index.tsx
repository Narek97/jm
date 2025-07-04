import React, { FC } from 'react';

import Slider, { CustomArrowProps } from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './style.scss';

const CustomPrevArrow: React.FC<CustomArrowProps> = props => {
  const { className, onClick } = props;

  return (
    <div className={className} onClick={onClick}>
      click
      <span className={'wm-arrow-left'} style={{ fontSize: '1.25rem' }} />
    </div>
  );
};

const CustomNextArrow: React.FC<CustomArrowProps> = props => {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
      click
      <span className={'wm-arrow-right'} style={{ fontSize: '1.25rem' }} />
    </div>
  );
};

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
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  return (
    <div className={'slick-carousel'}>
      {cards.length >= 5 ? (
        <Slider {...settings}>
          {cards.map(card => (
            <React.Fragment key={card.id}>{renderFunction(card)}</React.Fragment>
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
