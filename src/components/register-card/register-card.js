import Inputmask from '../../libs/InputMask/index';

const dateInput = document.querySelector('.js-date-birth');
Inputmask('99.99.9999').mask(dateInput);
