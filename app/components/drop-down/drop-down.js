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

class DropDown {
  constructor(options) {
    if (options.container) {
      this.container = options.container;
    } else {
      console.error('Expected container(node) inside constructor object but not received');
    }

    if (options.input) {
      this.input = options.input;
    } else {
      console.error('Expected input(node) inside constructor object but not received');
    }

    if (options.countElements) {
      this.countElements = options.countElements;
    } else {
      console.error('Expected countElements(Array) inside constructor object but not received');
    }
  }

  init = () => {
    const dropDownParent = getHtmlElement('section', 'drop-down');
    const dropDownParentWrap = getHtmlElement('div', 'drop-down__wrap');
    const countList = getHtmlElement('ul', 'drop-down__count-list');
    const dropDownControl = getHtmlElement('div', 'drop-down__control');
    const clearBtn = getHtmlElement('button', 'drop-down__button', 'Очистить');
    clearBtn.type = 'button';
    const acceptBtn = getHtmlElement('button', 'drop-down__button', 'Применить');
    acceptBtn.type = 'button';
    acceptBtn.classList.add('drop-down__button--accent');
    const countListFragment = document.createDocumentFragment();
    this.countElements.forEach(element => {
      const countItem = getHtmlElement('li', 'drop-down__count-item');
      const countItemName = getHtmlElement('p', 'drop-down__count-item-name', element.name);
      const counterMenu = getHtmlElement('div', 'drop-down__counter-menu');
      const countItemMinus = getHtmlElement('button', 'drop-down__counter-btn');
      countItemMinus.classList.add('drop-down__counter-btn--plus');
      const countItemView = getHtmlElement('p', 'drop-down__select-view', '0');
      const countItemPlus = getHtmlElement('button', 'drop-down__counter-btn');
      countItemPlus.classList.add('drop-down__counter-btn--minus');
      countItemMinus.type = 'button';
      countItemPlus.type = 'button';
      counterMenu.appendChild(countItemPlus);
      counterMenu.appendChild(countItemView);
      counterMenu.appendChild(countItemMinus);
      countItem.appendChild(countItemName);
      countItem.appendChild(counterMenu);
      countListFragment.appendChild(countItem);
    });
    countList.appendChild(countListFragment);
    dropDownControl.appendChild(clearBtn);
    dropDownControl.appendChild(acceptBtn);
    dropDownParentWrap.appendChild(countList);
    dropDownParentWrap.appendChild(dropDownControl);
    dropDownParent.appendChild(dropDownParentWrap);
    this.container.appendChild(dropDownParent);
  };
}

export default DropDown;