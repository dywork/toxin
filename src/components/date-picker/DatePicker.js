import isNumeric from 'validator/lib/isNumeric';

const monthRusTranslate = {
  0: 'Январь',
  1: 'Февраль',
  2: 'Март',
  3: 'Апрель',
  4: 'Май',
  5: 'Июнь',
  6: 'Июль',
  7: 'Август',
  8: 'Сентябрь',
  9: 'Октябрь',
  10: 'Ноябрь',
  11: 'Декабрь',
};

const monthReduction = {
  0: 'янв',
  1: 'фев',
  2: 'мар',
  3: 'апр',
  4: 'мая',
  5: 'июн',
  6: 'июл',
  7: 'авг',
  8: 'сен',
  9: 'окт',
  10: 'ноя',
  11: 'дек',
};

function getHtmlElement(tagName, className, text) {
  const element = document.createElement(tagName);

  if (className) {
    element.classList.add(className);
  }

  if (text) {
    element.textContent = text;
  }

  return element;
}

function getTwoDigitNumberString(number) {
  if (number < 10) {
    return `0${number}`;
  }

  return number;
}

class DatePicker {
  constructor(domInfo = {}) {
    if (domInfo.parentNode) {
      this.parentNode = domInfo.parentNode;
    } else {
      console.error(
        'Expected parentNodeId inside constructor object but not received'
      );
    }

    if (domInfo.arrivalInput) {
      this.arrivalInput = domInfo.arrivalInput;
      this.arrivalInput.addEventListener('click', this._onFocusArrivalInput);
      this.arrivalInput.addEventListener('keydown', evt => {
        const isPressEnter = evt.keyCode === 13;
        if (isPressEnter) {
          evt.preventDefault();
          this._showArrivalMonthCalendar();
          const arrivalInputDate = this.arrivalInput.textContent;
          if (this._hasDataFull(arrivalInputDate)) {
            this.departureInput.focus();
          }
        }
      });
    }

    if (domInfo.departureInput) {
      this.departureInput = domInfo.departureInput;
      this.departureInput.addEventListener(
        'click',
        this._onFocusDepartureInput
      );
      this.departureInput.addEventListener('keydown', evt => {
        const isPressEnter = evt.keyCode === 13;
        if (isPressEnter) {
          evt.preventDefault();
          this._showDepartureMonthCalendar();
        }
      });
    }

    if (domInfo.datePickerInput) {
      this.datePickerInput = domInfo.datePickerInput;
      this.datePickerInput.addEventListener('click', this._showCalendar);
    }

    if (domInfo.arrivalSplitBtn) {
      this.arrivalSplitBtn = domInfo.arrivalSplitBtn;
      this.arrivalSplitBtn.addEventListener(
        'click',
        this._showArrivalMonthCalendar
      );
    }

    if (domInfo.departureSplitBtn) {
      this.departureSplitBtn = domInfo.departureSplitBtn;
      this.departureSplitBtn.addEventListener(
        'click',
        this._showDepartureMonthCalendar
      );
    }

    if (domInfo.inputPlaceholder) {
      this.inputPlaceholder = domInfo.inputPlaceholder;
    }

    if (domInfo.isCellLower) {
      this.isCellLower = domInfo.isCellLower;
    }

    this.currentDate = new Date();
    this.arrivalDate = null;
    this.departureDate = null;
    this.arrivalCell = null;
    this.departureCell = null;
    this.isStartSelect = false;
    this.isEndSelect = false;
  }

  renderCalendar = () => {
    const calendar = this._getCalendar();
    this.parentNode.appendChild(calendar);
  };

  _hasCurrentMonth = date => {
    return date.getMonth() === this.currentDate.getMonth();
  };

  _compareDate = (firstDate, secondDate) => {
    const firstDay = firstDate.getDate();
    const firstMonth = firstDate.getMonth();
    const firstYear = firstDate.getFullYear();

    const secondDay = secondDate.getDate();
    const secondMonth = secondDate.getMonth();
    const secondYear = secondDate.getFullYear();

    if (firstYear > secondYear) {
      return 1;
    }

    if (firstYear < secondYear) {
      return -1;
    }

    if (firstMonth > secondMonth) {
      return 1;
    }

    if (firstMonth < secondMonth) {
      return -1;
    }

    if (firstDay > secondDay) {
      return 1;
    }

    if (firstDay < secondDay) {
      return -1;
    }

    return 0;
  };

  _hasDataFull = textDate => {
    const textDateSplit = textDate.split('.');
    const isDataFullNumber = textDateSplit.every(item => isNumeric(item));
    return isDataFullNumber;
  };

  _showCalendar = () => {
    const calendar = this.parentNode.querySelector('.date-picker');
    const isHaveShowClass = calendar.classList.contains('date-picker_opened');
    if (!isHaveShowClass) {
      calendar.classList.add('date-picker_opened');
    }
    document.body.addEventListener('mouseup', this._onClickShowCalendar);
    document.addEventListener('keyup', this._onEscUnshowCalendar);
  };

  _unshowCalendar = () => {
    const calendar = this.parentNode.querySelector('.date-picker');
    const isHaveShowClass = calendar.classList.contains('date-picker_opened');
    if (isHaveShowClass) {
      calendar.classList.remove('date-picker_opened');
    }
    document.body.removeEventListener('mouseup', this._onClickShowCalendar);
    document.removeEventListener('keyup', this._onEscUnshowCalendar);
  };

  _showArrivalMonthCalendar = () => {
    const inputDate = this.arrivalInput.textContent;
    const arrivalInputDate = this._getConvertedDateByUserInput(inputDate);
    const dateMoreThisDate =
      this._compareDate(arrivalInputDate, new Date()) >= 0;
    this._showCalendar();
    this._onInputDateArrival();
    if (this.arrivalDate && dateMoreThisDate) {
      this._updateCurrentDate(this.arrivalDate);
    }
  };

  _showDepartureMonthCalendar = () => {
    this._showCalendar();
    this._onInputDateDeparture();
    if (this.departureDate) {
      this._updateCurrentDate(this.departureDate);
    }
  };

  _showErrorAnimation = () => {
    const datePicker = this.parentNode.querySelector('.date-picker');
    datePicker.classList.add('date-picker_erroneous');
    setTimeout(() => {
      datePicker.classList.remove('date-picker_erroneous');
    }, 700);
  };

  _paintingSelectCell = () => {
    const cells = this.parentNode.querySelectorAll('td');
    if (this.arrivalDate && this.departureDate) {
      const arrivalAriaDate = this._getAriaDateByDate(this.arrivalDate);
      const departureAriaDate = this._getAriaDateByDate(this.departureDate);
      const isDoubleSelect = arrivalAriaDate === departureAriaDate;

      cells.forEach(cell => {
        const isCellStart = arrivalAriaDate === cell.getAttribute('aria-date');
        const isCellEnd = departureAriaDate === cell.getAttribute('aria-date');
        const cellDate = new Date(cell.getAttribute('aria-date'));

        if (isCellEnd && !isDoubleSelect) {
          cell.classList.add('date-picker__day_selected-end');
          cell.classList.add('date-picker__day_selected');
        }

        const isCellDateMoreThanArrivalDate =
          this._compareDate(cellDate, this.arrivalDate) > 0;
        const isCellDateLessThanDepartureDate =
          this._compareDate(cellDate, this.departureDate) < 0;
        const isCellDateInRange =
          isCellDateMoreThanArrivalDate && isCellDateLessThanDepartureDate;

        if (isCellDateInRange) {
          cell.classList.add('date-picker__day_selected-space');
        }

        if (isCellStart && departureAriaDate && !isDoubleSelect) {
          cell.classList.add('date-picker__day_selected-start');
          cell.classList.add('date-picker__day_selected');
        } else if (isCellStart) {
          cell.classList.add('date-picker__day_selected');
        }
      });
    } else if (this.arrivalDate) {
      const arrivalAriaDate = this._getAriaDateByDate(this.arrivalDate);

      cells.forEach(cell => {
        const isCellStart = arrivalAriaDate === cell.getAttribute('aria-date');
        if (isCellStart) {
          cell.classList.add('date-picker__day_selected');
        }
      });
    }
  };

  _clearSelectCell = () => {
    const cells = this.parentNode.querySelectorAll('td');
    cells.forEach(cell => {
      const isCellSelect = cell.classList.contains('date-picker__day_selected');
      const isCellSelectSpace = cell.classList.contains(
        'date-picker__day_selected-space'
      );
      const isCellStartSelect = cell.classList.contains(
        'date-picker__day_selected-start'
      );
      const isCellEndSelect = cell.classList.contains(
        'date-picker__day_selected-end'
      );

      if (isCellSelectSpace) {
        cell.classList.remove('date-picker__day_selected-space');
      }

      if (isCellSelect) {
        cell.classList.remove('date-picker__day_selected');
      }

      if (isCellStartSelect) {
        cell.classList.remove('date-picker__day_selected-start');
      }

      if (isCellEndSelect) {
        cell.classList.remove('date-picker__day_selected-end');
      }
    });
  };

  _printReductionDate = selectDate => {
    const selectDay = getTwoDigitNumberString(selectDate.getDate());
    const selectMonth = monthReduction[selectDate.getMonth()];
    const printMessage = `${selectDay} ${selectMonth}`;
    if (this.datePickerInput) {
      if (this.isEndSelect) {
        this.datePickerInput.textContent += ` - ${printMessage}`;
      } else {
        this.datePickerInput.textContent = printMessage;
      }
    }
  };

  _onClickShowCalendar = evt => {
    const calendar = this.parentNode.querySelector('.date-picker');
    const isInputClick =
      evt.target === this.arrivalInput || evt.target === this.departureInput;
    const isCalendarClick = calendar.contains(evt.target);
    const isOutsideClick = !isInputClick && !isCalendarClick;
    if (isOutsideClick) {
      this._unshowCalendar();
    }
  };

  _onEscUnshowCalendar = evt => {
    const isEscPress = evt.keyCode === 27;
    if (isEscPress) {
      this._unshowCalendar();
      if (this.arrivalInput) {
        this.arrivalInput.blur();
      }
      if (this.departureInput) {
        this.departureInput.blur();
      }
    }
  };

  _onFocusArrivalInput = () => {
    const inputDate = this.arrivalInput.textContent;
    const isInputDateFull = this._hasDataFull(inputDate);
    if (isInputDateFull) {
      const arrivalInputDate = this._getConvertedDateByUserInput(inputDate);
      const dateMoreThisDate =
        this._compareDate(arrivalInputDate, new Date()) >= 0;
      if (dateMoreThisDate) {
        this._showArrivalMonthCalendar();
      }
    } else {
      this._showCalendar();
    }
  };

  _onFocusDepartureInput = () => {
    const inputDate = this.departureInput.textContent;
    const isInputDateFull = this._hasDataFull(inputDate);
    if (isInputDateFull) {
      this._showDepartureMonthCalendar();
    } else {
      this._showCalendar();
    }
  };

  _onInputDateArrival = () => {
    const pickDate = this.arrivalInput.textContent;
    const isDataFull = this._hasDataFull(pickDate);
    if (isDataFull) {
      const convertedPickDate = this._getConvertedDateByUserInput(pickDate);
      const ariaDate = this._getAriaDateByDate(convertedPickDate);
      const pickCell = this._getCellByAriaDate(ariaDate);
      let isArrivalDateMore = false;
      if (this.departureDate) {
        isArrivalDateMore =
          this._compareDate(convertedPickDate, this.departureDate) > 0;
      }
      const pickDateLessThisDate =
        this._compareDate(convertedPickDate, new Date()) < 0;
      if (pickDateLessThisDate) {
        this._showErrorAnimation();
        if (pickCell) {
          pickCell.classList.add('date-picker__day_with-error');
          setTimeout(() => {
            pickCell.classList.remove('date-picker__day_with-error');
          }, 700);
        }
        this.arrivalInput.textContent = '';
        this._clearSelectCell();
      } else {
        if (pickCell) {
          let isArrivalCell = false;

          if (this.arrivalDate) {
            isArrivalCell =
              convertedPickDate.toDateString() ===
              this.arrivalDate.toDateString();
          }

          if (!isArrivalCell) {
            let isArrDateLessDepDate = false;

            if (this.departureDate) {
              isArrDateLessDepDate =
                this._compareDate(convertedPickDate, this.departureDate) < 0;
            }

            if (isArrDateLessDepDate) {
              this._clearSelectCell();
              this._onStartSelectRangeDate(pickCell, convertedPickDate);
              this._paintingSelectCell();
            } else if (isArrivalDateMore) {
              this._clearSelectCell();
              this._onClearSelectRangeDate();
              this.departureInput.textContent = '';
            } else if (this.isEndSelect || this.isStartSelect) {
              this._clearSelectCell();
              this._onClearSelectRangeDate();
            }
          }
        } else if (isArrivalDateMore) {
          this._clearSelectCell();
          this._onClearSelectRangeDate();
          this.departureInput.textContent = '';
        }

        this._onStartSelectRangeDate(pickCell, convertedPickDate);
      }
    }
  };

  _onInputDateDeparture = () => {
    const inputArrivalDate = this.arrivalInput.textContent;
    const isArrivalDateFull = this._hasDataFull(inputArrivalDate);
    const pickDate = this.departureInput.textContent;
    const isPickDateFull = this._hasDataFull(pickDate);
    if (!isArrivalDateFull && isPickDateFull) {
      this._showErrorAnimation();
      this.arrivalInput.focus();
    } else {
      if (isArrivalDateFull) {
        this._onInputDateArrival();
      }

      if (isPickDateFull) {
        const convertedPickDate = this._getConvertedDateByUserInput(pickDate);
        const ariaDate = this._getAriaDateByDate(convertedPickDate);
        const pickCell = this._getCellByAriaDate(ariaDate);
        if (pickCell) {
          const isDateSelectLess =
            this._compareDate(convertedPickDate, this.arrivalDate) < 0;
          if (isDateSelectLess) {
            this._showErrorAnimation();
            pickCell.classList.add('date-picker__day_with-error');
            setTimeout(() => {
              pickCell.classList.remove('date-picker__day_with-error');
            }, 700);
            this.departureInput.textContent = '';
          } else {
            const isDepartureCell = this.departureCell === pickCell;
            if (!isDepartureCell) {
              if (this.isEndSelect) {
                this._clearSelectCell();
              }

              this._onEndSelectRangeDate(pickCell, convertedPickDate);
              this._paintingSelectCell();
            }
          }
        } else {
          const isDateSelectLess =
            this._compareDate(convertedPickDate, this.arrivalDate) < 0;
          if (isDateSelectLess) {
            this._showErrorAnimation();
            this.departureInput.textContent = '';
          } else {
            this._clearSelectCell();
            this._onEndSelectRangeDate(pickCell, convertedPickDate);
            this._paintingSelectCell();
          }
        }
      }
    }
  };

  _onStartSelectRangeDate = (cell, startDate) => {
    if (cell) {
      this.arrivalCell = cell;
      cell.classList.add('date-picker__day_selected');
    }

    this.isStartSelect = true;
    this.isEndSelect = false;
    this.arrivalDate = startDate;
  };

  _onEndSelectRangeDate = (cell, dateEnd) => {
    if (cell) {
      this.departureCell = cell;
      cell.classList.add('date-picker__day_selected');
    }

    this.isStartSelect = false;
    this.isEndSelect = true;
    this.departureDate = dateEnd;
  };

  _onClearSelectRangeDate = () => {
    this.arrivalDate = null;
    this.departureDate = null;
    this.arrivalCell = null;
    this.departureCell = null;
    this.isStartSelect = false;
    this.isEndSelect = false;
  };

  _onFullClearCalendar = () => {
    this._onClearSelectRangeDate();
    this._clearSelectCell();
    if (this.arrivalInput) this.arrivalInput.textContent = 'ДД.ММ.ГГГГ';
    if (this.departureInput) this.departureInput.textContent = 'ДД.ММ.ГГГГ';
    if (this.datePickerInput) {
      this.datePickerInput.textContent = this.inputPlaceholder
        ? this.inputPlaceholder
        : 'ДД.ММ.ГГГГ';
    }
    this._updateCurrentDate(new Date());
  };

  _onSelectDate = evt => {
    evt.preventDefault();
    const isTdTag = evt.target.tagName.toLowerCase() === 'td';
    if (isTdTag) {
      if (this.isEndSelect) {
        this._clearSelectCell();
        this._onClearSelectRangeDate();
      }

      const td = evt.target;
      const selectDate = new Date(td.getAttribute('aria-date'));
      const selectDay = getTwoDigitNumberString(selectDate.getDate());
      const selectMonth = getTwoDigitNumberString(selectDate.getMonth() + 1);
      const selectYear = selectDate.getFullYear();
      const selectDateText = `${selectDay}.${selectMonth}.${selectYear}`;
      const isCellDoubleSelect =
        td === this.arrivalCell || td === this.departureCell;
      const isDateLessThisDate = this._compareDate(selectDate, new Date()) < 0;
      if (isDateLessThisDate) {
        this._showErrorAnimation();
        td.classList.add('date-picker__day_with-error');
        setTimeout(() => {
          td.classList.remove('date-picker__day_with-error');
        }, 700);
      } else if (this.isStartSelect && !isCellDoubleSelect) {
        const isDateSelectLess =
          this._compareDate(selectDate, this.arrivalDate) < 0;
        if (isDateSelectLess) {
          this._showErrorAnimation();
          td.classList.add('date-picker__day_with-error');
          setTimeout(() => {
            td.classList.remove('date-picker__day_with-error');
          }, 700);
        } else {
          this._onEndSelectRangeDate(td, selectDate);
          if (this.departureInput) {
            this.departureInput.textContent = selectDateText;
          } else {
            this._printReductionDate(selectDate);
          }
          this._paintingSelectCell();
          this._updateCurrentDate(selectDate);
        }
      } else if (isCellDoubleSelect && !this.isEndSelect) {
        this._onEndSelectRangeDate(td, selectDate);
        if (this.departureInput) {
          this.departureInput.textContent = selectDateText;
        } else {
          this._printReductionDate(selectDate);
        }
        this._updateCurrentDate(selectDate);
      } else {
        this._onStartSelectRangeDate(td, selectDate);
        if (this.arrivalInput) {
          this.arrivalInput.textContent = selectDateText;
        } else {
          this._printReductionDate(selectDate);
        }
        this._updateCurrentDate(selectDate);
      }
    }
  };

  _getAriaDateByDate = date => {
    let ariaDay = date.getDate();
    if (ariaDay >= 1 && ariaDay <= 9) {
      ariaDay = `0${ariaDay}`;
    }
    let ariaMonth = date.getMonth() + 1;
    if (ariaMonth >= 1 && ariaMonth <= 9) {
      ariaMonth = `0${ariaMonth}`;
    }
    const ariaYear = date.getFullYear();
    const ariaDate = `${ariaYear}-${ariaMonth}-${ariaDay}`;
    return ariaDate;
  };

  _getConvertedDateByUserInput = userDate => {
    const splitUserDate = userDate.split('.');
    const day = splitUserDate[0];
    const month = splitUserDate[1];
    const year = splitUserDate[2];
    return new Date(year, month - 1, day);
  };

  _getNumberRow = () => {
    const currentYear = this.currentDate.getFullYear();
    const currentMonth = this.currentDate.getMonth();
    const lastDayCurrentMonth = new Date(
      currentYear + 1,
      currentMonth + 1,
      0
    ).getDate();
    const lastWeekDayPrevMonth = new Date(
      currentYear,
      currentMonth,
      0
    ).getDay();
    const isLastWeekDaySaturday = lastWeekDayPrevMonth === 6;
    const isLastWeekDayFriday = lastWeekDayPrevMonth === 5;
    const isLastWeekDaySunday = lastWeekDayPrevMonth === 0;
    let numberRow = 5;

    if (isLastWeekDaySaturday && lastDayCurrentMonth >= 30) {
      numberRow = 6;
    }

    if (isLastWeekDayFriday && lastDayCurrentMonth === 31) {
      numberRow = 6;
    }

    if (isLastWeekDaySunday && lastDayCurrentMonth === 28) {
      numberRow = 4;
    }
    return numberRow;
  };

  _getCalendarTableDate = () => {
    const tableFragment = document.createDocumentFragment();
    const nowDate = new Date();
    const currentYear = this.currentDate.getFullYear();
    const currentMonth = this.currentDate.getMonth();
    const lastWeekDayPrevMonth = new Date(
      currentYear,
      currentMonth,
      0
    ).getDay();
    const lastDayPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    const numberColumn = 7;
    const numberRow = this._getNumberRow();

    let viewMonth;
    let numberDay;

    const isLastWeekDaySunday = lastWeekDayPrevMonth === 0;

    if (isLastWeekDaySunday) {
      numberDay = 0;
      viewMonth = currentMonth;
    } else {
      numberDay = lastDayPrevMonth - lastWeekDayPrevMonth;
      viewMonth = currentMonth - 1;
    }

    for (let i = 0; i < numberRow; i++) {
      const tableTr = getHtmlElement('tr');

      for (let j = 0; j < numberColumn; j++) {
        const viewDate = new Date(currentYear, viewMonth, ++numberDay);
        const tableTd = getHtmlElement(
          'td',
          'date-picker__day',
          viewDate.getDate()
        );
        const isNowDate = this._compareDate(viewDate, nowDate) === 0;

        if (this.isCellLower) {
          tableTd.classList.add('date-picker__day_lower');
        }

        if (!this._hasCurrentMonth(viewDate) && !isNowDate) {
          tableTd.classList.add('date-picker__day_not-current');
        }

        if (isNowDate) {
          tableTd.classList.add('date-picker__day_current');
        }

        const viewDateAtr = this._getAriaDateByDate(viewDate);
        tableTd.setAttribute('aria-date', viewDateAtr);
        tableTr.appendChild(tableTd);
      }

      tableFragment.appendChild(tableTr);
    }

    return tableFragment;
  };

  _getCellByAriaDate = ariaDate => {
    const cells = this.parentNode.querySelectorAll('td');
    let cell;
    cells.forEach(item => {
      const ariaDateItem = item.getAttribute('aria-date');
      if (ariaDateItem === ariaDate) cell = item;
    });
    return cell;
  };

  _getCalendar = () => {
    const datePickerHtmlSection = getHtmlElement('section', 'date-picker');
    const datePickerHtmlWrap = getHtmlElement('div', 'date-picker__wrap');
    const datePickerHtmlControl = this._getCalendarTopControl();
    const datePickerHtmlTable = this._getCalendarTable();
    const datePickerHtmlBotControl = this._getCalendarBotControl();
    datePickerHtmlWrap.appendChild(datePickerHtmlControl);
    datePickerHtmlWrap.appendChild(datePickerHtmlTable);
    datePickerHtmlWrap.appendChild(datePickerHtmlBotControl);
    datePickerHtmlSection.appendChild(datePickerHtmlWrap);

    return datePickerHtmlSection;
  };

  _getCalendarTopControl = () => {
    const datePickerHtmlControl = getHtmlElement('div', 'date-picker__control');
    const datePickerHtmlSliderBtnPrev = getHtmlElement(
      'button',
      'date-picker__slider-btn',
      'Назад'
    );
    datePickerHtmlSliderBtnPrev.classList.add('date-picker__slider-btn_prev');
    datePickerHtmlSliderBtnPrev.type = 'button';

    datePickerHtmlSliderBtnPrev.addEventListener('click', evt => {
      evt.preventDefault();
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      const day = 1;
      const prevMonthDate = new Date(year, month - 1, day);
      this._updateCurrentDate(prevMonthDate);
    });

    const datePickerHtmlSliderBtnNext = getHtmlElement(
      'button',
      'date-picker__slider-btn',
      'Вперед'
    );
    datePickerHtmlSliderBtnNext.classList.add('date-picker__slider-btn_next');
    datePickerHtmlSliderBtnNext.type = 'button';

    datePickerHtmlSliderBtnNext.addEventListener('click', evt => {
      evt.preventDefault();
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      const day = 1;
      const prevMonthDate = new Date(year, month + 1, day);
      this._updateCurrentDate(prevMonthDate);
    });

    const monthName = monthRusTranslate[this.currentDate.getMonth()];
    const yearName = this.currentDate.getFullYear();

    const datePickerHtmlTitle = getHtmlElement(
      'h2',
      'date-picker__title',
      `${monthName} ${yearName}`
    );

    datePickerHtmlTitle.id = 'date-picker-main-title';

    datePickerHtmlControl.appendChild(datePickerHtmlSliderBtnPrev);
    datePickerHtmlControl.appendChild(datePickerHtmlTitle);
    datePickerHtmlControl.appendChild(datePickerHtmlSliderBtnNext);

    return datePickerHtmlControl;
  };

  _getCalendarTable = () => {
    const calendarTable = getHtmlElement('table', 'date-picker__calendar');
    const tHead = getHtmlElement('thead');
    const tBody = getHtmlElement('tbody');
    const tableTrHead = getHtmlElement('tr');
    const tableHead = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    tableHead.forEach(item => {
      const th = getHtmlElement('th', 'date-picker__th', item);
      tableTrHead.appendChild(th);
    });

    tHead.appendChild(tableTrHead);
    const tableDate = this._getCalendarTableDate();

    tBody.appendChild(tableDate);
    tBody.addEventListener('click', this._onSelectDate);

    calendarTable.appendChild(tHead);
    calendarTable.appendChild(tBody);
    return calendarTable;
  };

  _getCalendarBotControl = () => {
    const datePickerHtmlControl = getHtmlElement('div', 'date-picker__control');
    const datePickerButtons = [
      {
        text: 'Очистить',
        isAccent: false,
        clickHandler: this._onFullClearCalendar,
      },
      {text: 'Применить', isAccent: true, clickHandler: this._unshowCalendar},
    ];

    datePickerButtons.forEach(item => {
      const btn = getHtmlElement('button', 'date-picker__button', item.text);
      btn.type = 'button';

      if (item.isAccent) {
        btn.classList.add('date-picker__button_accentuating');
      }

      if (item.clickHandler) {
        btn.addEventListener('click', evt => {
          evt.preventDefault();
          item.clickHandler();
        });
      }

      datePickerHtmlControl.appendChild(btn);
    });

    return datePickerHtmlControl;
  };

  _updateCurrentDate = date => {
    this.currentDate = date;
    this._updateCalendar();
    this._paintingSelectCell();
  };

  _updateCalendar = () => {
    this._updateCalendarTitle();
    this._updateCalendarTable();
  };

  _updateCalendarTitle = () => {
    const title = document.querySelector('#date-picker-main-title');
    const monthName = monthRusTranslate[this.currentDate.getMonth()];
    const yearName = this.currentDate.getFullYear();
    title.textContent = `${monthName} ${yearName}`;
  };

  _updateCalendarTable = () => {
    const calendarTable = this.parentNode.querySelector('table');
    const calendarTableBody = calendarTable.querySelector('tbody');
    calendarTable.removeChild(calendarTableBody);
    const tBody = getHtmlElement('tbody');
    const tableDate = this._getCalendarTableDate();
    tBody.addEventListener('click', this._onSelectDate);
    tBody.appendChild(tableDate);
    calendarTable.appendChild(tBody);
  };
}

export default DatePicker;
