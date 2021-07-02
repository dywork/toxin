import calendarClassName from './utils/calendarClassName';
import TopControlView from './components/TopControlView';
import BotControlView from './components/BotControlView';
import CalendarTableView from './components/CalendarTableView';
import {getHtmlElement, getTwoDigitNumberString, compareDate} from './utils';
import {monthRusTranslate, monthReduction, keyCodes} from './utils/constants';

class DatePicker {
  constructor({
    parentNode,
    arrivalInput,
    arrivalSplitBtn,
    departureInput,
    departureSplitBtn,
    datePickerInput,
    datePickerSplitBtn,
    inputPlaceholder = 'ДД.ММ.ГГГГ',
    isCellLower = false,
  }) {
    this.domElements = {
      parentNode,
      arrivalInput,
      arrivalSplitBtn,
      departureInput,
      departureSplitBtn,
      datePickerInput,
      datePickerSplitBtn,
      arrivalCell: null,
      departureCell: null,
    };

    this.dateInfo = {
      currentDate: new Date(),
      arrivalDate: null,
      departureDate: null,
    };

    this.settings = {
      inputPlaceholder,
      isStartSelect: false,
      isEndSelect: false,
      isCellLower,
    };
  }

  init = () => {
    this._renderCalendar();
    this._saveDom();
    this._setListeners();
  };

  _renderCalendar = () => {
    const {parentNode} = this.domElements;
    const calendar = this._getCalendar();
    parentNode.appendChild(calendar);
  };

  _getCalendar = () => {
    const {datePicker, wrap} = calendarClassName;
    const {currentDate} = this.dateInfo;
    const {isCellLower} = this.settings;
    const datePickerHtmlSection = getHtmlElement(
      'section',
      `${datePicker} js-${datePicker}`
    );
    const datePickerHtmlWrap = getHtmlElement('div', wrap);
    const datePickerHtmlControl = TopControlView.getHtmlNode(currentDate);
    const datePickerHtmlTable = CalendarTableView.getHtmlNode(
      currentDate,
      isCellLower
    );
    const datePickerHtmlBotControl = BotControlView.getHtmlNode();
    datePickerHtmlWrap.appendChild(datePickerHtmlControl);
    datePickerHtmlWrap.appendChild(datePickerHtmlTable);
    datePickerHtmlWrap.appendChild(datePickerHtmlBotControl);
    datePickerHtmlSection.appendChild(datePickerHtmlWrap);

    return datePickerHtmlSection;
  };

  _saveDom = () => {
    const {parentNode} = this.domElements;
    const {
      datePicker,
      title,
      sliderButtonPrev,
      sliderButtonNext,
      calendar,
      calendarBody,
      jsButtonClear,
      jsButtonAccept,
    } = calendarClassName;

    this.domElements.datePicker = parentNode.querySelector(`.js-${datePicker}`);
    this.domElements.sliderButtonPrev = parentNode.querySelector(
      `.js-${sliderButtonPrev}`
    );
    this.domElements.sliderTitle = parentNode.querySelector(`.js-${title}`);
    this.domElements.sliderButtonNext = parentNode.querySelector(
      `.js-${sliderButtonNext}`
    );
    this.domElements.table = parentNode.querySelector(`.js-${calendar}`);
    this.domElements.tableBody = parentNode.querySelector(
      `.js-${calendarBody}`
    );
    this.domElements.buttonClear = parentNode.querySelector(
      `.${jsButtonClear}`
    );
    this.domElements.buttonAccept = parentNode.querySelector(
      `.${jsButtonAccept}`
    );
  };

  _setListeners = () => {
    const {
      datePickerInput,
      datePickerSplitBtn,
      sliderButtonPrev,
      sliderButtonNext,
      tableBody,
      buttonClear,
      buttonAccept,
    } = this.domElements;

    if (datePickerInput) {
      datePickerInput.addEventListener(
        'click',
        this._handleDatePickerInputClick
      );
      datePickerSplitBtn.addEventListener(
        'click',
        this._handleDatePickerInputClick
      );
    } else {
      const {
        arrivalInput,
        arrivalSplitBtn,
        departureInput,
        departureSplitBtn,
      } = this.domElements;

      arrivalInput.addEventListener('click', this._handleArrivalInputClick);
      arrivalSplitBtn.addEventListener('click', this._handleArrivalInputClick);
      departureInput.addEventListener('click', this._handleDepartureInputClick);
      departureSplitBtn.addEventListener(
        'click',
        this._handleDepartureInputClick
      );
    }
    sliderButtonPrev.addEventListener(
      'click',
      this._handleSliderButtonPrevClick
    );
    sliderButtonNext.addEventListener(
      'click',
      this._handleSliderButtonNextClick
    );
    tableBody.addEventListener('click', this._handleTableBodyClick);
    buttonClear.addEventListener('click', this._handleButtonClearClick);
    buttonAccept.addEventListener('click', this._handleButtonAcceptClick);
  };

  _handleBodyOutsideClick = (evt) => {
    const {datePicker, arrivalInput, departureInput} = this.domElements;
    const isInputClick =
      evt.target === arrivalInput || evt.target === departureInput;
    const isDatePickerClick = datePicker.contains(evt.target);
    const isOutsideClick = !isInputClick && !isDatePickerClick;
    if (isOutsideClick) {
      this._closeCalendar();
    }
  };

  _handleBodyOutsideKeyup = (evt) => {
    if (evt.keyCode === keyCodes.esc) {
      this._closeCalendar();
    }
  };

  _handleDatePickerInputClick = (evt) => {
    evt.preventDefault();
    this._showCalendar();
  };

  _handleArrivalInputClick = (evt) => {
    evt.preventDefault();
    this._showCalendar();
  };

  _handleDepartureInputClick = (evt) => {
    evt.preventDefault();
    this._showCalendar();
  };

  _handleSliderButtonPrevClick = (evt) => {
    evt.preventDefault();
    const {currentDate} = this.dateInfo;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = 1;
    const prevMonthDate = new Date(year, month - 1, day);
    this._updateCurrentDate(prevMonthDate);
  };

  _handleSliderButtonNextClick = (evt) => {
    evt.preventDefault();
    const {currentDate} = this.dateInfo;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = 1;
    const nextMonthDate = new Date(year, month + 1, day);
    this._updateCurrentDate(nextMonthDate);
  };

  _handleTableBodyClick = (evt) => {
    evt.preventDefault();
    const isTdTag = evt.target.tagName.toLowerCase() === 'td';

    if (isTdTag) {
      const {
        arrivalCell,
        departureCell,
        arrivalInput,
        departureInput,
      } = this.domElements;
      const {arrivalDate} = this.dateInfo;
      const {isStartSelect, isEndSelect} = this.settings;

      if (isEndSelect) {
        this._clearSelectCell();
        this._clearSelectRangeDate();
      }

      const td = evt.target;
      const selectDate = new Date(td.getAttribute('aria-date'));
      const selectDay = getTwoDigitNumberString(selectDate.getDate());
      const selectMonth = getTwoDigitNumberString(selectDate.getMonth() + 1);
      const selectYear = selectDate.getFullYear();
      const selectDateInputText = `${selectDay}.${selectMonth}.${selectYear}`;

      const hasClickOnSelectedCell = td === arrivalCell || td === departureCell;
      const isDateLessThisDate = compareDate(selectDate, new Date()) < 0;

      if (isDateLessThisDate) {
        this._showErrorAnimation(td);
      } else if (isStartSelect && !hasClickOnSelectedCell) {
        const isDateSelectLess = compareDate(selectDate, arrivalDate) < 0;
        if (isDateSelectLess) {
          this._showErrorAnimation(td);
        } else {
          this._endSelectRangeDate(td, selectDate);
          if (departureInput) {
            departureInput.textContent = selectDateInputText;
          } else {
            this._printReductionDate(selectDate);
          }
          this._paintingSelectCell();
          this._updateCurrentDate(selectDate);
        }
      } else if (hasClickOnSelectedCell && !isEndSelect) {
        this._endSelectRangeDate(td, selectDate);
        if (departureInput) {
          departureInput.textContent = selectDateInputText;
        } else {
          this._printReductionDate(selectDate);
        }
        this._updateCurrentDate(selectDate);
      } else {
        this._startSelectRangeDate(td, selectDate);
        if (arrivalInput) {
          arrivalInput.textContent = selectDateInputText;
        } else {
          this._printReductionDate(selectDate);
        }
        this._updateCurrentDate(selectDate);
      }
    }
  };

  _handleButtonClearClick = (evt) => {
    const {inputPlaceholder} = this.settings;
    const {arrivalInput, departureInput, datePickerInput} = this.domElements;
    evt.preventDefault();
    this._clearSelectRangeDate();
    this._clearSelectCell();
    if (arrivalInput) arrivalInput.textContent = inputPlaceholder;
    if (departureInput) departureInput.textContent = inputPlaceholder;
    if (datePickerInput) {
      datePickerInput.textContent = inputPlaceholder;
    }
    this._updateCurrentDate(new Date());
  };

  _handleButtonAcceptClick = (evt) => {
    evt.preventDefault();
    this._closeCalendar();
  }

  _showCalendar = () => {
    const {datePicker} = this.domElements;
    const {datePickerOpened} = calendarClassName;
    const isHaveShowClass = datePicker.classList.contains(datePickerOpened);
    if (!isHaveShowClass) {
      datePicker.classList.add(datePickerOpened);
    }
    document.body.addEventListener('mouseup', this._handleBodyOutsideClick);
    document.addEventListener('keyup', this._handleBodyOutsideKeyup);
  };

  _closeCalendar = () => {
    const {datePicker} = this.domElements;
    const {datePickerOpened} = calendarClassName;
    const isHaveShowClass = datePicker.classList.contains(datePickerOpened);
    if (isHaveShowClass) {
      datePicker.classList.remove(datePickerOpened);
    }
    document.body.removeEventListener('mouseup', this._handleBodyOutsideClick);
    document.removeEventListener('keyup', this._handleBodyOutsideKeyup);
  };

  _updateCurrentDate = (date) => {
    this.dateInfo.currentDate = date;
    this._updateCalendar();
    this._paintingSelectCell();
  };

  _updateCalendar = () => {
    this._updateCalendarTitle();
    this._updateCalendarTable();
  };

  _updateCalendarTitle = () => {
    const {sliderTitle} = this.domElements;
    const {currentDate} = this.dateInfo;
    const monthName = monthRusTranslate[currentDate.getMonth()];
    const yearName = currentDate.getFullYear();
    sliderTitle.textContent = `${monthName} ${yearName}`;
  };

  _updateCalendarTable = () => {
    const {table, tableBody} = this.domElements;
    const {calendarBody} = calendarClassName;
    const {currentDate} = this.dateInfo;
    const {isCellLower} = this.settings;
    table.removeChild(tableBody);
    const tBody = getHtmlElement('tbody', `${calendarBody} js-${calendarBody}`);
    const tableDate = CalendarTableView.getCalendarTableDate(
      currentDate,
      isCellLower
    );
    tBody.addEventListener('click', this._handleTableBodyClick);
    tBody.appendChild(tableDate);
    table.appendChild(tBody);
    this.domElements.tableBody = tBody;
  };

  _showErrorAnimation = (cell) => {
    const {datePicker} = this.domElements;
    const {datePickerWithError, calendarDayWithError} = calendarClassName;
    datePicker.classList.add(datePickerWithError);
    setTimeout(() => {
      datePicker.classList.remove(datePickerWithError);
    }, 700);
    cell.classList.add(calendarDayWithError);
    setTimeout(() => {
      cell.classList.remove(calendarDayWithError);
    }, 700);
  };

  _startSelectRangeDate = (cell, startDate) => {
    if (cell) {
      const {calendarDaySelected} = calendarClassName;
      this.domElements.arrivalCell = cell;
      cell.classList.add(calendarDaySelected);
    }

    this.settings.isStartSelect = true;
    this.settings.isEndSelect = false;
    this.dateInfo.arrivalDate = startDate;
  };

  _endSelectRangeDate = (cell, dateEnd) => {
    if (cell) {
      const {calendarDaySelected} = calendarClassName;
      this.domElements.departureCell = cell;
      cell.classList.add(calendarDaySelected);
    }

    this.settings.isStartSelect = false;
    this.settings.isEndSelect = true;
    this.dateInfo.departureDate = dateEnd;
  };

  _paintingSelectCell = () => {
    const {parentNode} = this.domElements;
    const {arrivalDate, departureDate} = this.dateInfo;
    const {
      calendarDaySelected,
      calendarDaySelectedStart,
      calendarDaySelectedEnd,
      calendarDaySelectedSpace,
    } = calendarClassName;
    const cells = parentNode.querySelectorAll('td');
    if (arrivalDate && departureDate) {
      const arrivalAriaDate = CalendarTableView.getAriaDateByDate(arrivalDate);
      const departureAriaDate = CalendarTableView.getAriaDateByDate(
        departureDate
      );
      const isDoubleSelect = arrivalAriaDate === departureAriaDate;

      cells.forEach((cell) => {
        const isCellStart = arrivalAriaDate === cell.getAttribute('aria-date');
        const isCellEnd = departureAriaDate === cell.getAttribute('aria-date');
        const cellDate = new Date(cell.getAttribute('aria-date'));

        if (isCellEnd && !isDoubleSelect) {
          cell.classList.add(calendarDaySelectedEnd);
          cell.classList.add(calendarDaySelected);
        }

        const isCellDateMoreThanArrivalDate =
          compareDate(cellDate, arrivalDate) > 0;
        const isCellDateLessThanDepartureDate =
          compareDate(cellDate, departureDate) < 0;
        const isCellDateInRange =
          isCellDateMoreThanArrivalDate && isCellDateLessThanDepartureDate;

        if (isCellDateInRange) {
          cell.classList.add(calendarDaySelectedSpace);
        }

        if (isCellStart && departureAriaDate && !isDoubleSelect) {
          cell.classList.add(calendarDaySelectedStart);
          cell.classList.add(calendarDaySelected);
        } else if (isCellStart) {
          cell.classList.add(calendarDaySelected);
        }
      });
    } else if (arrivalDate) {
      const arrivalAriaDate = CalendarTableView.getAriaDateByDate(arrivalDate);

      cells.forEach((cell) => {
        const isCellStart = arrivalAriaDate === cell.getAttribute('aria-date');
        if (isCellStart) {
          cell.classList.add(calendarDaySelected);
        }
      });
    }
  };

  _printReductionDate = (selectDate) => {
    const {datePickerInput} = this.domElements;
    const {isEndSelect} = this.settings;
    const selectDay = getTwoDigitNumberString(selectDate.getDate());
    const selectMonth = monthReduction[selectDate.getMonth()];
    const printMessage = `${selectDay} ${selectMonth}`;
    if (datePickerInput) {
      if (isEndSelect) {
        datePickerInput.textContent += ` - ${printMessage}`;
      } else {
        datePickerInput.textContent = printMessage;
      }
    }
  };

  _clearSelectRangeDate = () => {
    this.dateInfo.arrivalDate = null;
    this.dateInfo.departureDate = null;
    this.domElements.arrivalCell = null;
    this.domElements.departureCell = null;
    this.settings.isStartSelect = false;
    this.settings.isEndSelect = false;
  };

  _clearSelectCell = () => {
    const {parentNode} = this.domElements;
    const {
      calendarDaySelected,
      calendarDaySelectedStart,
      calendarDaySelectedEnd,
      calendarDaySelectedSpace,
    } = calendarClassName;

    const cells = parentNode.querySelectorAll('td');

    cells.forEach((cell) => {
      const isCellSelect = cell.classList.contains(calendarDaySelected);
      const isCellSelectSpace = cell.classList.contains(
        calendarDaySelectedSpace
      );
      const isCellStartSelect = cell.classList.contains(
        calendarDaySelectedStart
      );
      const isCellEndSelect = cell.classList.contains(calendarDaySelectedEnd);

      if (isCellSelectSpace) {
        cell.classList.remove(calendarDaySelectedSpace);
      }

      if (isCellSelect) {
        cell.classList.remove(calendarDaySelected);
      }

      if (isCellStartSelect) {
        cell.classList.remove(calendarDaySelectedStart);
      }

      if (isCellEndSelect) {
        cell.classList.remove(calendarDaySelectedEnd);
      }
    });
  };
}

export default DatePicker;
