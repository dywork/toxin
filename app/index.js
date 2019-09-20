/* eslint-disable global-require */
import './styles/main.scss';
import DatePicker from './components/date-picker/date-picker';
import DropDown from './components/drop-down/drop-down';

if (process.env.NODE_ENV !== 'production') {
  require('./index.pug');
  require('./pages/about.pug');
}

const datePickerDomInfo = {
  parentNodeId: 'date-picker-container',
  arrivalInputId: 'arrival-input',
  arrivalSplitBtnId: 'arrival-split-btn',
  departureInputId: 'departure-input',
  departureSplitBtnId: 'departure-split-btn',
};

const datePicker = new DatePicker(datePickerDomInfo);
datePicker.renderCalendar();

const dropDownContainer = document.querySelector('#drop-down-container');
const inputDropDown = document.querySelector('#number-guests-input');

const dropDownOptions = {
  container: dropDownContainer,
  input: inputDropDown,
  countElements: [
    { name: 'Взрослые', minValue: 1 },
    { name: 'Дети', minValue: 0 },
    { name: 'Младенцы', minValue: 0 },
  ],
};

const dropDown = new DropDown(dropDownOptions);
dropDown.init();
