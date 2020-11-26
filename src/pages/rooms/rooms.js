import '../../style/main.scss';
import './rooms.scss';
import '../../components/range-slider/range-slider';
import '../../components/hotel-card/hotel-card';
import '../../components/main-menu/main-menu-init';
import DatePicker from '../../components/date-picker/date-picker';
import DropDown from '../../components/drop-down/drop-down';

const datePickerDomInfo = {
  parentNode: document.querySelector('.js-date-picker-container'),
  datePickerInput: document.querySelector('.js-drop-down-input'),
  isCellLower: true
};

const datePicker = new DatePicker(datePickerDomInfo);
datePicker.renderCalendar();

const dropDownContainer = document.querySelector('.js-drop-down-container');
const inputDropDown = document.querySelector('.js-input-drop-down');

const dropDownOptions = {
  container: dropDownContainer,
  input: inputDropDown,
  countElements: [
    {name: 'Спальни', countGroupName: 'bedrooms', startValue: 2},
    {name: 'Кровати', countGroupName: 'bed', startValue: 2},
    {name: 'Ванные комнаты', countGroupName: 'bath', startValue: 0},
  ],
  countGroupView: {
    bedrooms: {counter: 2, views: ['спальня', 'спальни', 'спален']},
    bed: {counter: 2, views: ['кровать', 'кровати', 'кроватей']},
    bath: {
      counter: 0,
      views: ['ванная комната', 'ванные комнаты', 'ванных комнат'],
    },
  },
  placeholder: 'Удобства номера',
};

const dropDown = new DropDown(dropDownOptions);
dropDown.init();

const dropDownGuestContainer = document.querySelector('.js-drop-down-container-guest');
const inputDropDownGuest = document.querySelector('.js-input-drop-down-guest');

const dropDownGuestOptions = {
  container: dropDownGuestContainer,
  input: inputDropDownGuest,
  countElements: [
    {name: 'Взрослые', countGroupName: 'guest', startValue: 3},
    {name: 'Дети', countGroupName: 'guest', startValue: 0},
    {name: 'Младенцы', countGroupName: 'child', startValue: 1},
  ],
  countGroupView: {
    guest: {counter: 3, views: ['гость', 'гостя', 'гостей']},
    child: {counter: 1, views: ['младенец', 'младенца', 'младенцев']},
  },
  placeholder: 'Cколько гостей',
};

const dropDownGuest = new DropDown(dropDownGuestOptions);
dropDownGuest.init();
