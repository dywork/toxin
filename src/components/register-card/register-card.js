import Inputmask from '../../libs/InputMask/index';

const dateInput = document.querySelector('.js-date-birth');
Inputmask('99.99.9999').mask(dateInput);

const radioManButton = document.querySelector('.js-gender-man');
const radioInputMan = document.querySelector('.js-gender-man-input');
const radioFemaleButton = document.querySelector('.js-gender-female');
const radioInputFemale = document.querySelector('.js-gender-female-input');

const enterCode = 13;

radioManButton.addEventListener('keydown', (evt) => {
  if (evt.keyCode === enterCode) {
    radioInputMan.checked = true;
  }
});

radioFemaleButton.addEventListener('keydown', (evt) => {
  if (evt.keyCode === enterCode) {
    radioInputFemale.checked = true;
  }
});

const toggleButton = document.querySelector('.js-special-offer');
const toggleInput = document.querySelector('.js-special-offer-input');

const leftArrowCode = 37;
const rightArrowCode = 39;

toggleButton.addEventListener('keydown', (evt) => {
  if (evt.keyCode === rightArrowCode) {
    toggleInput.checked = true;
  }

  if (evt.keyCode === leftArrowCode) {
    toggleInput.checked = false;
  }

  if (evt.keyCode === enterCode) {
    toggleInput.checked = !toggleInput.checked;
  }
});
