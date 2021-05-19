import noUiSlider from 'nouislider';
import wNumb from 'wnumb';

class RangeSlider {
  static init() {
    const element = this._getElement();
    this._createSlider(element);
  }

  static _createSlider(item) {
    const viewNodes = this._getViewNodes();
    noUiSlider.create(item, {
      start: this._getStartData(),
      connect: true,
      format: wNumb({decimals: 0}),
      step: this._getStepData(),
      range: this._getRangeData(),
      cssClasses: {
        target: 'target',
        base: 'base',
        origin: 'origin',
        handle: 'handle range-slider__handle',
        handleLower: 'handle-lower',
        handleUpper: 'handle-upper',
        touchArea: 'touch-area',
        horizontal: 'horizontal',
        vertical: 'vertical',
        background: 'background',
        connect: 'connect  range-slider__connect',
        connects: 'connects',
        ltr: 'ltr',
        rtl: 'rtl',
        textDirectionLtr: 'txt-dir-ltr',
        textDirectionRtl: 'txt-dir-rtl',
        draggable: 'draggable',
        drag: 'state-drag',
        tap: 'state-tap',
        active: 'active',
        tooltip: 'tooltip',
        pips: 'pips',
        pipsHorizontal: 'pips-horizontal',
        pipsVertical: 'pips-vertical',
        marker: 'marker',
        markerHorizontal: 'marker-horizontal',
        markerVertical: 'marker-vertical',
        markerNormal: 'marker-normal',
        markerLarge: 'marker-large',
        markerSub: 'marker-sub',
        value: 'value',
        valueHorizontal: 'value-horizontal',
        valueVertical: 'value-vertical',
        valueNormal: 'value-normal',
        valueLarge: 'value-large',
        valueSub: 'value-sub',
      },
    });

    item.noUiSlider.on('update', function(values, handle) {
      let viewPrice = values[handle].replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ');
      viewPrice += '₽';
      viewNodes[handle].textContent = viewPrice;
    });
  }

  static _getViewNodes() {
    const lowerViewPrice = document.querySelector('.js-range-slider-lower-value');
    const upperViewPrice = document.querySelector('.js-range-slider-upper-value');
    return [lowerViewPrice, upperViewPrice];
  }

  static _getElement() {
    return document.querySelector('.js-range-slider');
  }

  static _getStartData() {
    const rangeSliderOptions = document.querySelector('.js-range-slider-options');
    const startData = rangeSliderOptions.getAttribute('data-start');
    return startData.split(',').map(item => parseInt(item));
  }

  static _getStepData() {
    const rangeSliderOptions = document.querySelector('.js-range-slider-options');
    const stepData = rangeSliderOptions.getAttribute('data-step');
    return parseInt(stepData);
  }

  static _getRangeData() {
    const rangeSliderOptions = document.querySelector('.js-range-slider-options');
    const min = parseInt(rangeSliderOptions.getAttribute('data-range-min'));
    const max = parseInt(rangeSliderOptions.getAttribute('data-range-max'));
    return {min, max};
  }
}

export default RangeSlider;
