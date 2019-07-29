const monthMap = {
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

class DatePicker {
  currentDate = new Date(2019, 6, 1);

  parentNode = document.body;

  hasCurrentMonth = date => {
    return date.getMonth() === this.currentDate.getMonth();
  };

  hasCurrentDate = date => {
    const compaireDay = date.getDate();
    const compaireMonth = date.getMonth();
    const compaireYear = date.getFullYear();

    const currentDay = this.currentDate.getDate();
    const currentMonth = this.currentDate.getMonth();
    const currentYear = this.currentDate.getFullYear();

    return (
      compaireDay === currentDay && compaireMonth === currentMonth && compaireYear === currentYear
    );
  };

  getCalendarTopControl = () => {
    const datePickerHtmlControl = getHtmlElement('div', 'date-picker__control');
    const datePickerHtmlSliderBtnPrev = getHtmlElement(
      'button',
      'date-picker__slider-btn',
      'Назад',
    );
    datePickerHtmlSliderBtnPrev.classList.add('date-picker__slider-btn--prev');
    datePickerHtmlSliderBtnPrev.type = 'button';

    const datePickerHtmlSliderBtnNext = getHtmlElement(
      'button',
      'date-picker__slider-btn',
      'Вперед',
    );
    datePickerHtmlSliderBtnNext.classList.add('date-picker__slider-btn--next');
    datePickerHtmlSliderBtnNext.type = 'button';

    const monthName = monthMap[this.currentDate.getMonth()];
    const yearName = this.currentDate.getFullYear();

    const datePickerHtmlTitle = getHtmlElement(
      'h2',
      'date-picker__title',
      `${monthName} ${yearName}`,
    );

    datePickerHtmlTitle.id = 'date-picker-main-title';

    datePickerHtmlControl.appendChild(datePickerHtmlSliderBtnPrev);
    datePickerHtmlControl.appendChild(datePickerHtmlTitle);
    datePickerHtmlControl.appendChild(datePickerHtmlSliderBtnNext);

    return datePickerHtmlControl;
  };

  getCalendarTableDate = () => {
    const tableFragment = document.createDocumentFragment();

    const currentYear = this.currentDate.getFullYear();
    const currentMonth = this.currentDate.getMonth();
    const lastWeekDayPrevMonth = new Date(currentYear, currentMonth, 0).getDay();
    const lastDayPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    let numberDay;

    if (lastWeekDayPrevMonth === 0) {
      numberDay = lastDayPrevMonth - 7;
    } else {
      numberDay = lastDayPrevMonth - lastWeekDayPrevMonth;
    }

    for (let i = 0; i < 5; i++) {
      const tableTr = getHtmlElement('tr');

      for (let j = 0; j < 7; j++) {
        const viewDate = new Date(currentYear, currentMonth - 1, ++numberDay);
        const tableTd = getHtmlElement('td', 'date-picker__day', viewDate.getDate());

        if (!this.hasCurrentMonth(viewDate)) {
          tableTd.classList.add('date-picker__day--not-current');
        }

        if (this.hasCurrentDate(viewDate)) {
          tableTd.classList.add('date-picker__day--current');
        }

        // const isTdSelected = viewDate.getDate() === 19 || viewDate.getDate() === 23;

        // if (isTdSelected) {
        //   tableTd.classList.add('date-picker__day--select');
        // }

        // if (viewDate.getDate() === 19) {
        //   tableTd.classList.add('date-picker__day--select-start');
        // }

        // if (viewDate.getDate() === 23) {
        //   tableTd.classList.add('date-picker__day--select-end');
        // }

        // const isTdSpaceSelected = viewDate.getDate() >= 20 && viewDate.getDate() <= 22;

        // if (isTdSpaceSelected) {
        //   tableTd.classList.add('date-picker__day--select-space');
        // }

        tableTr.appendChild(tableTd);
      }

      tableFragment.appendChild(tableTr);
    }

    return tableFragment;
  };

  getCalendarTable = () => {
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
    const tableDate = this.getCalendarTableDate();
    tBody.appendChild(tableDate);

    calendarTable.appendChild(tHead);
    calendarTable.appendChild(tBody);
    return calendarTable;
  };

  getCalendarBotControl = () => {
    const datePickerHtmlControl = getHtmlElement('div', 'date-picker__control');
    const datePickerButtons = [
      { text: 'Очистить', isAccent: false },
      { text: 'Применить', isAccent: true },
    ];

    datePickerButtons.forEach(item => {
      const btn = getHtmlElement('button', 'date-picker__button', item.text);
      btn.type = 'button';

      if (item.isAccent) {
        btn.classList.add('date-picker__button--accent');
      }

      datePickerHtmlControl.appendChild(btn);
    });

    return datePickerHtmlControl;
  };

  getCalendar = () => {
    const datePickerHtmlSection = getHtmlElement('section', 'date-picker');
    const datePickerHtmlWrap = getHtmlElement('div', 'date-picker__wrap');
    const datePickerHtmlControl = this.getCalendarTopControl();
    const datePickerHtmlTable = this.getCalendarTable();
    const datePickerHtmlBotControl = this.getCalendarBotControl();
    datePickerHtmlWrap.appendChild(datePickerHtmlControl);
    datePickerHtmlWrap.appendChild(datePickerHtmlTable);
    datePickerHtmlWrap.appendChild(datePickerHtmlBotControl);
    datePickerHtmlSection.appendChild(datePickerHtmlWrap);

    return datePickerHtmlSection;
  };

  updateCurrentDate = date => {
    this.currentDate = date;
    this.updateCalendar();
  };

  updateCalendar = () => {
    this.updateCalendarTitle();
  };

  updateCalendarTitle = () => {
    const title = document.querySelector('#date-picker-main-title');
    const monthName = monthMap[this.currentDate.getMonth()];
    const yearName = this.currentDate.getFullYear();
    title.textContent = `${monthName} ${yearName}`;
  };

  updateCalendarTable = () => {
    const calendarTable = this.parentNode.querySelector('table');
    const calendarTableBody = calendarTable.querySelector('tbody');
    calendarTable.removeChild(calendarTableBody);
    const tableDate = this.getCalendarTableDate();
    calendarTable.appendChild(tableDate);
  };

  renderCalendar = (parentNode = document.body) => {
    this.parentNode = parentNode;
    const calendar = this.getCalendar();
    this.parentNode.appendChild(calendar);
  };
}

export default DatePicker;
