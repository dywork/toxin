import noUiSlider from 'nouislider';
import wNumb from 'wnumb';

const stepSlider = document.querySelector('.js-range-slider');
const lowerViewPrice = document.querySelector('.js-range-slider-lower-value');
const upperViewPrice = document.querySelector('.js-range-slider-upper-value');
const viewNodes = [lowerViewPrice, upperViewPrice];

noUiSlider.create(stepSlider, {
  start: [5000, 10000],
  connect: true,
  format: wNumb({decimals: 0}),
  step: 100,
  range: {
    min: [300],
    max: 15700,
  },
  cssClasses: {
    target: "target",
    base: "base",
    origin: "origin",
    handle: "handle range-slider__handle",
    handleLower: "handle-lower",
    handleUpper: "handle-upper",
    touchArea: "touch-area",
    horizontal: "horizontal",
    vertical: "vertical",
    background: "background",
    connect: "connect  range-slider__connect",
    connects: "connects",
    ltr: "ltr",
    rtl: "rtl",
    textDirectionLtr: "txt-dir-ltr",
    textDirectionRtl: "txt-dir-rtl",
    draggable: "draggable",
    drag: "state-drag",
    tap: "state-tap",
    active: "active",
    tooltip: "tooltip",
    pips: "pips",
    pipsHorizontal: "pips-horizontal",
    pipsVertical: "pips-vertical",
    marker: "marker",
    markerHorizontal: "marker-horizontal",
    markerVertical: "marker-vertical",
    markerNormal: "marker-normal",
    markerLarge: "marker-large",
    markerSub: "marker-sub",
    value: "value",
    valueHorizontal: "value-horizontal",
    valueVertical: "value-vertical",
    valueNormal: "value-normal",
    valueLarge: "value-large",
    valueSub: "value-sub"
  },
});

stepSlider.noUiSlider.on('update', function(values, handle) {
  let viewPrice = values[handle].replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ');
  viewPrice += '₽';
  viewNodes[handle].textContent = viewPrice;
});