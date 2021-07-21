import '../../style/main.scss';
import './cards.scss';
import initialHotelCard from '../../components/hotel-card/hotel-card';

const domInfo = {
  hotelCard: 'js-hotel-card-glide',
  activeBullet: 'hotel-card__bullet-active',
};

initialHotelCard(domInfo);
