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
    if (this.settings.isPinShow) {
      this._show();
    } else {
      this.domElements.input.addEventListener('click', this._show);
    }

    if (this._hasHaveStartValue()) {
      this._renderStartCount();
    } else {
      this.domElements.input.textContent = this.settings.placeholder;
    }

    this.domElements.inputSplitBtn.addEventListener('click', this._show);
    const modifiedCountElements = this._getModifiedCountElements();
    this.countElementsGroup.countElements = modifiedCountElements;
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

    this.countElementsGroup.countElements.forEach((element) => {
      const countItem = this._getCountItem(element);
      countListFragment.appendChild(countItem);
    });

    countList.appendChild(countListFragment);
    if (!this.settings.isHideControl) {
      dropDownControl.appendChild(clearBtn);
      dropDownControl.appendChild(acceptBtn);
    }

    dropDownParentWrap.appendChild(countList);

    if (!this.settings.isHideControl) {
      dropDownParentWrap.appendChild(dropDownControl);
    }
    this.domElements.dropDownParent.appendChild(dropDownParentWrap);
    this.domElements.container.appendChild(this.domElements.dropDownParent);

    const isAllCounterZero = this.countElementsGroup.countElements.every(
      (item) => item.counter === 0
    );

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
    const modifiedCountElements = this.countElementsGroup.countElements.map(
      (item, index) => {
        const minValue = item.minValue ? item.minValue : 0;
        const counter = item.startValue ? item.startValue : minValue;
        item.id = `${index}${getRandomNumber(1, 10000)}`;
        item.counter = counter;
        item.minValue = minValue;
        return item;
      }
    );

    return modifiedCountElements;
  };

  _show = () => {
    const isHaveClass = this.domElements.dropDownParent.classList.contains(
      'drop-down-counter_opened'
    );
    if (!isHaveClass) {
      this.domElements.dropDownParent.classList.add('drop-down-counter_opened');
      this.domElements.input.classList.add('drop-down-input__body_active');
      window.addEventListener('mouseup', this._onClickHide);
      window.addEventListener('keyup', this._onPressHide);
    }
  };

  _hide = () => {
    if (this.settings.isPinShow) {
      return;
    }

    const isHaveClass = this.domElements.dropDownParent.classList.contains(
      'drop-down-counter_opened'
    );
    if (isHaveClass) {
      this.domElements.dropDownParent.classList.remove(
        'drop-down-counter_opened'
      );
      this.domElements.input.classList.remove('drop-down-input__body_active');
      window.removeEventListener('mouseup', this._onClickHide);
      window.removeEventListener('keyup', this._onPressHide);
    }
  };

  _hideClearBtn = () => {
    this.domElements.clearBtn.classList.add('drop-down-counter__button_hidden');
  };

  _onClickHide = (evt) => {
    const isInputClick = evt.target === this.domElements.input;
    const isCalendarClick = this.domElements.dropDownParent.contains(
      evt.target
    );
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
    this.domElements.input.textContent = this.settings.placeholder;
  };

  _discardCounter = () => {
    this.countElementsGroup.countElements.forEach((item) => {
      const viewCounter = this.domElements.dropDownParent.querySelector(
        `#view-${item.id}`
      );
      viewCounter.textContent = item.minValue;
      item.counter = item.minValue;
    });

    const minusButtons = this.domElements.dropDownParent.querySelectorAll(
      '.drop-down-counter__counter-btn_minus'
    );
    minusButtons.forEach((item) => {
      item.classList.add('drop-down-counter__counter-btn_disabled');
      item.setAttribute('disabled', 'true');
    });
  };

  _discardViewCounter = () => {
    Object.keys(this.countElementsGroup.countGroupView).forEach((item) => {
      this.countElementsGroup.countGroupView[item].counter = 0;
    });
  };

  _renderViewCount = () => {
    let wordOfNum = '';
    Object.keys(this.countElementsGroup.countGroupView).forEach(
      (item, index) => {
        if (this.countElementsGroup.countGroupView[item].counter > 0) {
          const currentCounterGroup = this.countElementsGroup.countGroupView[
            item
          ];
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
      }
    );

    if (
      wordOfNum.length >= 20 &&
      Object.keys(this.countElementsGroup.countGroupView).length > 2
    ) {
      wordOfNum = wordOfNum.slice(0, 20) + '...';
    }

    this.domElements.input.textContent = wordOfNum;
  };

  _renderStartCount = () => {
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

    this.domElements.input.textContent = wordOfNum;
  };

  _getCountItem = (element) => {
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
      const groupView = this.countElementsGroup.countGroupView[
        element.countGroupName
      ];
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

      const isClearBtnDisabled = this.domElements.clearBtn.classList.contains(
        'drop-down-counter__button_hidden'
      );
      if (isClearBtnDisabled) {
        this.domElements.clearBtn.classList.remove('drop-down-counter__button_hidden');
      }
    });

    countItemMinus.addEventListener('click', () => {
      const groupView = this.countElementsGroup.countGroupView[element.countGroupName];
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
        const isCounterGroupClear = Object.keys(
          this.countElementsGroup.countGroupView
        ).every((item) => {
          return this.countElementsGroup.countGroupView[item].counter === 0;
        });
        if (isCounterGroupClear) {
          this.domElements.input.textContent = this.settings.placeholder;
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
