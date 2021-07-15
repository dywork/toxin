import {getHtmlElement, getRandomNumber, declOfNum} from './utils';
import classNameMap from './utils/classNameMap';

class DropDownCounter {
  constructor({
    container,
    input,
    inputSplitBtn,
    countElements,
    countGroupView,
    placeholder = 'Выберите элемент',
    isPinShow = false,
    isHideControl = false,
  }) {
    const {dropDownCounter} = classNameMap;
    this.domElements = {
      dropDownParent: getHtmlElement('section', dropDownCounter),
      container,
      input,
      inputSplitBtn,
    };

    this.countElementsGroup = {
      countElements,
      countGroupView,
    };

    this.settings = {
      placeholder,
      isPinShow,
      isHideControl,
    };
  }

  init = () => {
    const {input, inputSplitBtn, dropDownParent, container} = this.domElements;
    const {isPinShow, placeholder, isHideControl} = this.settings;

    if (isPinShow) {
      this._show();
    } else {
      input.addEventListener('click', this._show);
    }

    if (this._hasHaveStartValue()) {
      this._renderStartCount();
    } else {
      input.textContent = placeholder;
    }

    inputSplitBtn.addEventListener('click', this._show);
    this.countElementsGroup.countElements = this._getModifiedCountElements();
    const dropDownParentWrap = getHtmlElement('div', 'drop-down-counter__wrap');
    const countList = getHtmlElement('ul', 'drop-down-counter__count-list');
    const dropDownControl = getHtmlElement('div', 'drop-down-counter__control');
    const clearBtn = getHtmlElement(
      'button',
      'drop-down-counter__button',
      'Очистить'
    );
    this.domElements.clearBtn = clearBtn;
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
    const {countElements} = this.countElementsGroup;

    countElements.forEach((element) => {
      const countItem = this._getCountItem(element);
      countListFragment.appendChild(countItem);
    });

    countList.appendChild(countListFragment);

    if (!isHideControl) {
      dropDownControl.appendChild(clearBtn);
      dropDownControl.appendChild(acceptBtn);
    }

    dropDownParentWrap.appendChild(countList);

    if (!isHideControl) {
      dropDownParentWrap.appendChild(dropDownControl);
    }

    dropDownParent.appendChild(dropDownParentWrap);
    container.appendChild(dropDownParent);

    const isAllCounterZero = countElements.every((item) => item.counter === 0);

    if (isAllCounterZero) this._hideClearBtn();
  };

  _hasHaveStartValue = () => {
    const {countElements} = this.countElementsGroup;
    return countElements.some((item) => {
      if (item.startValue) {
        return item.startValue > 0;
      }
    });
  };

  _getModifiedCountElements = () => {
    const {countElements} = this.countElementsGroup;

    const modifiedCountElements = countElements.map((item, index) => {
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
    const {dropDownParent, input} = this.domElements;

    const isHaveClass = dropDownParent.classList.contains(
      'drop-down-counter_opened'
    );

    if (!isHaveClass) {
      dropDownParent.classList.add('drop-down-counter_opened');
      input.classList.add('drop-down-input__body_active');
      window.addEventListener('mouseup', this._onClickHide);
      window.addEventListener('keyup', this._onPressHide);
    }
  };

  _hide = () => {
    const {dropDownParent, input} = this.domElements;
    const {isPinShow} = this.settings;

    if (isPinShow) {
      return;
    }

    const isHaveClass = dropDownParent.classList.contains(
      'drop-down-counter_opened'
    );

    if (isHaveClass) {
      dropDownParent.classList.remove('drop-down-counter_opened');
      input.classList.remove('drop-down-input__body_active');
      window.removeEventListener('mouseup', this._onClickHide);
      window.removeEventListener('keyup', this._onPressHide);
    }
  };

  _hideClearBtn = () => {
    const {clearBtn} = this.domElements;
    clearBtn.classList.add('drop-down-counter__button_hidden');
  };

  _onClickHide = (evt) => {
    const {dropDownParent, input} = this.domElements;
    const isInputClick = evt.target === input;
    const isCalendarClick = dropDownParent.contains(evt.target);
    const isOutsideClick = !isInputClick && !isCalendarClick;
    if (isOutsideClick) {
      this._hide();
    }
  };

  _onPressHide = (evt) => {
    const isEscPress = evt.keyCode === 27;
    if (isEscPress) {
      this._hide();
    }
  };

  _onClickClear = (evt) => {
    evt.preventDefault();
    this._discardCounter();
    this._discardViewCounter();
    this._hideClearBtn();
    const {input} = this.domElements;
    const {placeholder} = this.settings;
    input.textContent = placeholder;
  };

  _discardCounter = () => {
    const {dropDownParent} = this.domElements;
    const {countElements} = this.countElementsGroup;

    countElements.forEach((item) => {
      const viewCounter = dropDownParent.querySelector(`#view-${item.id}`);
      viewCounter.textContent = item.minValue;
      item.counter = item.minValue;
    });

    const minusButtons = dropDownParent.querySelectorAll(
      '.drop-down-counter__counter-btn_minus'
    );
    minusButtons.forEach((item) => {
      item.classList.add('drop-down-counter__counter-btn_disabled');
      item.setAttribute('disabled', 'true');
    });
  };

  _discardViewCounter = () => {
    const {countGroupView} = this.countElementsGroup;

    Object.keys(countGroupView).forEach((item) => {
      countGroupView[item].counter = 0;
    });
  };

  _renderViewCount = () => {
    const {input} = this.domElements;
    const {countGroupView} = this.countElementsGroup;

    let wordOfNum = '';
    Object.keys(countGroupView).forEach((item, index) => {
      if (countGroupView[item].counter > 0) {
        const currentCounterGroup = countGroupView[item];
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

    if (wordOfNum.length >= 20 && Object.keys(countGroupView).length > 2) {
      wordOfNum = wordOfNum.slice(0, 20) + '...';
    }

    input.textContent = wordOfNum;
  };

  _renderStartCount = () => {
    const {input} = this.domElements;
    const {countElements, countGroupView} = this.countElementsGroup;

    let wordOfNum = '';
    countElements.forEach((item, index) => {
      if (item.startValue > 0) {
        const currentCounterGroup = countGroupView[item.countGroupName];
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

    input.textContent = wordOfNum;
  };

  _getCountItem = (element) => {
    const {input, clearBtn} = this.domElements;
    const {placeholder} = this.settings;
    const {countGroupView} = this.countElementsGroup;

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
      const groupView = countGroupView[element.countGroupName];
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

      const isClearBtnDisabled = clearBtn.classList.contains(
        'drop-down-counter__button_hidden'
      );
      if (isClearBtnDisabled) {
        clearBtn.classList.remove('drop-down-counter__button_hidden');
      }
    });

    countItemMinus.addEventListener('click', () => {
      const groupView = countGroupView[element.countGroupName];
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
        const isCounterGroupClear = Object.keys(countGroupView).every(
          (item) => {
            return countGroupView[item].counter === 0;
          }
        );
        if (isCounterGroupClear) {
          input.textContent = placeholder;
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
