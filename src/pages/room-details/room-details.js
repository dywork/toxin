import '../../style/main.scss';
import './room-details.scss';
import '../../components/main-menu/MainMenuInit';
import '../../components/total-card';
import DatePicker from '../../components/date-picker/DatePicker';
import DropDownCounter from '../../components/drop-down-counter/DropDownCounter';
import initialPieChart from '../../components/pie-chart/pie-chart';

const pieChartDomInfo = {
  root: 'js-doughnut-chart',
  diagram: 'js-pie-diagram',
};

initialPieChart(pieChartDomInfo);

const datePickerDomInfo = {
  parentNode: document.querySelector('.js-date-picker-container'),
  arrivalInput: document.querySelector('.js-arrival-input'),
  arrivalSplitBtn: document.querySelector('.js-arrival-input-split-btn'),
  departureInput: document.querySelector('.js-departure-input'),
  departureSplitBtn: document.querySelector('.js-departure-input-split-btn'),
};

const datePicker = new DatePicker(datePickerDomInfo);
datePicker.init();

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
