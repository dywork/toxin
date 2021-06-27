import '../../style/main.scss';
import './room-details.scss';
import '../../components/pie-chart/pie-chart';
import '../../components/main-menu/MainMenuInit';
import DatePicker from '../../components/date-picker/DatePicker';
import DropDownCounter from '../../components/drop-down-counter/DropDownCounter';
import TotalCard from '../../components/total-card/TotalCard';

const datePickerDomInfo = {
  parentNode: document.querySelector('.js-date-picker-container'),
  arrivalInput: document.querySelector('.js-arrival-input'),
  arrivalSplitBtn: document.querySelector('.js-arrival-input-split-btn'),
  departureInput: document.querySelector('.js-departure-input'),
  departureSplitBtn: document.querySelector('.js-departure-input-split-btn'),
};

const datePicker = new DatePicker(datePickerDomInfo);
datePicker.renderCalendar();

const dropDownContainer = document.querySelector(
  '.js-drop-down-counter-container'
);
const inputDropDown = document.querySelector('.js-input-drop-down');
const inputSplitBtn = document.querySelector('.js-input-drop-down-split-btn');

const dropDownOptions = {
  container: dropDownContainer,
  input: inputDropDown,
  inputSplitBtn,
  countElements: [
    {name: 'Взрослые', countGroupName: 'guest'},
    {name: 'Дети', countGroupName: 'guest'},
    {name: 'Младенцы', countGroupName: 'child'},
  ],
  countGroupView: {
    guest: {counter: 0, views: ['гость', 'гостя', 'гостей']},
    child: {counter: 0, views: ['младенец', 'младенца', 'младенцев']},
  },
  placeholder: 'Cколько гостей',
};

const dropDown = new DropDownCounter(dropDownOptions);
dropDown.init();

const totalCard = new TotalCard({
  arrivalInput: document.querySelector('.js-arrival-input'),
  departureInput: document.querySelector('.js-departure-input'),
  priceView: document.querySelector('.js-total-price'),
  amountDayView: document.querySelector('.js-amount-day'),
  costPerDaysView: document.querySelector('.js-cost-per-days'),
  placeholder: 'ДД.ММ.ГГГГ',
  priceForDay: 9990,
  discount: 2179,
  priceForAddServices: 300,
});

totalCard.init();
