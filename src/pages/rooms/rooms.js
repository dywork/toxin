import '../../style/main.scss';
import './rooms.scss';
import '../../components/main-menu/MainMenuInit';
import './sections/filter/filter-init';
import initialRangeSlider from '../../components/range-slider/range-slider';
import initialHotelCard from '../../components/hotel-card/hotel-card';

const domInfo = {
  rangeSlider: {
    root: 'js-range-slider',
    options: 'js-range-slider-options',
    lowValue: 'js-range-slider-lower-value',
    upperValue: 'js-range-slider-upper-value',
    handle: 'range-slider__handle',
    connect: 'range-slider__connect',
  },
  hotelCard: {
    hotelCard: 'js-hotel-card-glide',
    activeBullet: 'hotel-card__bullet-active',
  },
};

const {rangeSlider, hotelCard} = domInfo;

initialRangeSlider(rangeSlider);
initialHotelCard(hotelCard);
