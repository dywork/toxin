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

function getRandomNumber(min, max) {
  const randomNumber = Math.floor(Math.random() * (+max - +min)) + +min;
  return randomNumber;
}

function declOfNum(number, titles) {
  const cases = [2, 0, 1, 1, 1, 2];
  return titles[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : cases[number % 10 < 5 ? number % 10 : 5]
  ];
}

class DropDownCounter {
  constructor(options) {
    if (options.container) {
      this.container = options.container;
      const dropDownParent = getHtmlElement('section', 'drop-down-counter');
      this.dropDownParent = dropDownParent;
    } else {
      console.error(
        'Expected container(node) inside constructor object but not received'
      );
    }

    if (options.input) {
      const placeholder = options.placeholder
        ? options.placeholder
        : 'Выберите элемент';
      this.placeholder = placeholder;
      this.input = options.input;
      const isHaveStartValue = this._hasHaveStartValue(options.countElements);
      if (isHaveStartValue) {
        this._renderStartCount(options);
      } else {
        this.input.textContent = placeholder;
      }

      if (!options.isPinShow) {
        this.input.addEventListener('click', this._show);
      } else {
        this._show();
      }
    } else {
      console.error(
        'Expected input(node) inside constructor object but not received'
      );
    }

    if (options.inputSplitBtn) {
      this.inputSplitBtn = options.inputSplitBtn;
      this.inputSplitBtn.addEventListener('click', this._show);
    } else {
      console.error(
        'Expected inputSplitBtn(node) inside constructor object but not received'
      );
    }

    if (options.countElements) {
      this.countElements = options.countElements;
      this.inputViews = [];
    } else {
      console.error(
        'Expected countElements(Array) inside constructor object but not received'
      );
    }

    if (options.countGroupView) {
      this.countGroupView = options.countGroupView;
    } else {
      console.error(
        'Expected countGroupView(Array) inside constructor object but not received'
      );
    }

    if (options.isHideControl) {
      this.isHideControl = options.isHideControl;
    }

    if (options.isPinShow) {
      this.isPinShow = options.isPinShow;
    }
  }

  init = () => {
    const modifiedCountElements = this._getModifiedCountElements();
    this.countElements = modifiedCountElements;
    const dropDownParentWrap = getHtmlElement('div', 'drop-down-counter__wrap');
    const countList = getHtmlElement('ul', 'drop-down-counter__count-list');
    const dropDownControl = getHtmlElement('div', 'drop-down-counter__control');
    const clearBtn = getHtmlElement(
      'button',
      'drop-down-counter__button',
      'Очистить'
    );
    this.clearBtn = clearBtn;
    clearBtn.type = 'button';
    clearBtn.addEventListener('click', this._onClickClear);
    const acceptBtn = getHtmlElement(
      'button',
      'drop-down-counter__button',
      'Применить'
    );
    acceptBtn.type = 'button';
    acceptBtn.classList.add('drop-down-counter__button_accentuating');
    acceptBtn.addEventListener('click', this._hide);
    const countListFragment = document.createDocumentFragment();

    this.countElements.forEach(element => {
      const countItem = this._getCountItem(element);
      countListFragment.appendChild(countItem);
    });

    countList.appendChild(countListFragment);
    if (!this.isHideControl) {
      dropDownControl.appendChild(clearBtn);
      dropDownControl.appendChild(acceptBtn);
    }

    dropDownParentWrap.appendChild(countList);

    if (!this.isHideControl) {
      dropDownParentWrap.appendChild(dropDownControl);
    }
    this.dropDownParent.appendChild(dropDownParentWrap);
    this.container.appendChild(this.dropDownParent);

    const isAllCounterZero = this.countElements.every(
      item => item.counter === 0
    );

    if (isAllCounterZero) this._hideClearBtn();
  };

  _hasHaveStartValue = countElements => {
    return countElements.some(item => {
      if (item.startValue) {
        return item.startValue > 0;
      }
    });
  };

  _getModifiedCountElements = () => {
    const modifiedCountElements = this.countElements.map((item, index) => {
      const minValue = item.minValue ? item.minValue : 0;
      const counter = item.startValue ? item.startValue : minValue;
      item.id = `${index}${getRandomNumber(1, 10000)}`;
      item.counter = counter;
      item.minValue = minValue;
      return item;
    });

    return modifiedCountElements;
  };

  _show = () => {
    const isHaveClass = this.dropDownParent.classList.contains(
      'drop-down-counter_opened'
    );
    if (!isHaveClass) {
      this.dropDownParent.classList.add('drop-down-counter_opened');
      this.input.classList.add('drop-down-input__body_active');
      window.addEventListener('mouseup', this._onClickHide);
      window.addEventListener('keyup', this._onPressHide);
    }
  };

  _hide = () => {
    if (this.isPinShow) {
      return;
    }

    const isHaveClass = this.dropDownParent.classList.contains(
      'drop-down-counter_opened'
    );
    if (isHaveClass) {
      this.dropDownParent.classList.remove('drop-down-counter_opened');
      this.input.classList.remove('drop-down-input__body_active');
      window.removeEventListener('mouseup', this._onClickHide);
      window.removeEventListener('keyup', this._onPressHide);
    }
  };

  _hideClearBtn = () => {
    this.clearBtn.classList.add('drop-down-counter__button_hidden');
  };

  _onClickHide = evt => {
    const isInputClick = evt.target === this.input;
    const isCalendarClick = this.dropDownParent.contains(evt.target);
    const isOutsideClick = !isInputClick && !isCalendarClick;
    if (isOutsideClick) {
      this._hide();
    }
  };

  _onPressHide = evt => {
    const isEscPress = evt.keyCode === 27;
    if (isEscPress) {
      this._hide();
    }
  };

  _onClickClear = evt => {
    evt.preventDefault();
    this._discardCounter();
    this._discardViewCounter();
    this._hideClearBtn();
    this.input.textContent = this.placeholder;
  };

  _discardCounter = () => {
    this.countElements.forEach(item => {
      const viewCounter = this.dropDownParent.querySelector(`#view-${item.id}`);
      viewCounter.textContent = item.minValue;
      item.counter = item.minValue;
    });

    const minusButtons = this.dropDownParent.querySelectorAll(
      '.drop-down-counter__counter-btn_minus'
    );
    minusButtons.forEach(item => {
      item.classList.add('drop-down-counter__counter-btn_disabled');
      item.setAttribute('disabled', 'true');
    });
  };

  _discardViewCounter = () => {
    Object.keys(this.countGroupView).forEach(item => {
      this.countGroupView[item].counter = 0;
    });
  };

  _renderViewCount = () => {
    let wordOfNum = '';
    Object.keys(this.countGroupView).forEach((item, index) => {
      if (this.countGroupView[item].counter > 0) {
        const currentCounterGroup = this.countGroupView[item];
        const currentCounter = currentCounterGroup.counter;
        const currentWord = declOfNum(
          currentCounter,
          currentCounterGroup.views
        );
        if (index > 0 && wordOfNum.length > 1) {
          wordOfNum += ', ';
        }
        wordOfNum += `${currentCounter} ${currentWord}`;
      }
    });

    if (wordOfNum.length >= 20 && Object.keys(this.countGroupView).length > 2) {
      wordOfNum = wordOfNum.slice(0, 20) + '...';
    }

    this.input.textContent = wordOfNum;
  };

  _renderStartCount = options => {
    const countElements = options.countElements;
    let wordOfNum = '';
    countElements.forEach((item, index) => {
      if (item.startValue > 0) {
        const currentCounterGroup = options.countGroupView[item.countGroupName];
        const currentCounter = currentCounterGroup.counter;
        const currentWord = declOfNum(
          currentCounter,
          currentCounterGroup.views
        );
        if (index > 0 && wordOfNum.length > 1) {
          wordOfNum += ', ';
        }
        wordOfNum += `${currentCounter} ${currentWord}`;
      }
    });

    if (wordOfNum.length >= 20 && countElements.length > 2) {
      wordOfNum = wordOfNum.slice(0, 20) + '...';
    }

    const splitWordOfNum = wordOfNum.split(',');
    if (splitWordOfNum.length > 1) {
      if (splitWordOfNum[0].trim() === splitWordOfNum[1].trim()) {
        wordOfNum = splitWordOfNum[0];
      }
    }

    this.input.textContent = wordOfNum;
  };

  _getCountItem = element => {
    const countItem = getHtmlElement('li', 'drop-down-counter__count-item');
    const countItemName = getHtmlElement(
      'p',
      'drop-down-counter__count-item-name',
      element.name
    );
    const counterMenu = getHtmlElement(
      'div',
      'drop-down-counter__counter-menu'
    );
    const countItemMinus = getHtmlElement(
      'button',
      'drop-down-counter__counter-btn'
    );
    countItemMinus.classList.add('drop-down-counter__counter-btn_minus');
    if (element.startValue) {
      if (element.startValue === element.minValue) {
        countItemMinus.classList.add('drop-down-counter__counter-btn_disabled');
        countItemMinus.setAttribute('disabled', 'true');
      }
    } else {
      countItemMinus.classList.add('drop-down-counter__counter-btn_disabled');
      countItemMinus.setAttribute('disabled', 'true');
    }
    countItemMinus.type = 'button';
    const countItemView = getHtmlElement('p', 'drop-down-counter__select-view');
    countItemView.textContent = element.counter;
    countItemView.id = `view-${element.id}`;
    const countItemPlus = getHtmlElement(
      'button',
      'drop-down-counter__counter-btn'
    );
    countItemPlus.classList.add('drop-down-counter__counter-btn_plus');
    countItemPlus.type = 'button';

    countItemPlus.addEventListener('click', () => {
      const groupView = this.countGroupView[element.countGroupName];
      element.counter++;
      groupView.counter++;
      countItemView.textContent = element.counter;
      this._renderViewCount();
      const isMinusDisabled = countItemMinus.classList.contains(
        'drop-down-counter__counter-btn_disabled'
      );
      if (isMinusDisabled) {
        countItemMinus.classList.remove(
          'drop-down-counter__counter-btn_disabled'
        );
        countItemMinus.removeAttribute('disabled');
      }

      const isClearBtnDisabled = this.clearBtn.classList.contains(
        'drop-down-counter__button_hidden'
      );
      if (isClearBtnDisabled) {
        this.clearBtn.classList.remove('drop-down-counter__button_hidden');
      }
    });

    countItemMinus.addEventListener('click', () => {
      const groupView = this.countGroupView[element.countGroupName];
      element.counter--;
      groupView.counter--;
      countItemView.textContent = element.counter;
      const nextDecrementCounter = element.counter - 1;
      if (nextDecrementCounter < element.minValue) {
        countItemMinus.classList.add('drop-down-counter__counter-btn_disabled');
        countItemMinus.setAttribute('disabled', 'true');
      }
      this._renderViewCount();
      if (groupView.counter === 0) {
        const isCounterGroupClear = Object.keys(this.countGroupView).every(
          item => {
            return this.countGroupView[item].counter === 0;
          }
        );
        if (isCounterGroupClear) {
          this.input.textContent = this.placeholder;
          this._hideClearBtn();
        }
      }
    });

    counterMenu.appendChild(countItemMinus);
    counterMenu.appendChild(countItemView);
    counterMenu.appendChild(countItemPlus);
    countItem.appendChild(countItemName);
    countItem.appendChild(counterMenu);
    return countItem;
  };
}

export default DropDownCounter;
