import Glide from '@glidejs/glide';

class HotelsCard {
  static init() {
    const elements = this._getElements();
    elements.forEach(this._createSlider);
  }

  static _createSlider(item) {
    new Glide(item, {
      type: 'carousel',
      classes: {activeNav: 'hotel-card__bullet-active'},
    }).mount();
  }

  static _getElements() {
    return document.querySelectorAll('.js-hotel-card-glide');
  }
}

HotelsCard.init();
