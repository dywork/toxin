import {getHtmlElement} from '../utils/';
import calendarClassName from '../utils/calendarClassName';

class BotControlView {
  static getHtmlNode = () => {
    const {control, button, buttonAccent} = calendarClassName;
    const datePickerHtmlControl = getHtmlElement('div', control);
    const datePickerButtons = [
      {text: 'Очистить'},
      {text: 'Применить', isAccent: true},
    ];

    datePickerButtons.forEach((item) => {
      const {text, isAccent} = item;
      const btn = getHtmlElement('button', button, text);
      btn.type = 'button';

      if (isAccent) {
        btn.classList.add(buttonAccent);
      }

      datePickerHtmlControl.appendChild(btn);
    });

    return datePickerHtmlControl;
  };
}

export default BotControlView;
