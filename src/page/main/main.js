import "../../style/index.scss";
import "./main.scss";
import DatePicker from "../../components/date-picker/date-picker";
import DropDown from "../../components/drop-down/drop-down";
import MainMenu from "../../components/main-menu/main-menu";

const datePickerDomInfo = {
  parentNodeId: "date-picker-container",
  arrivalInputId: "arrival-input",
  arrivalSplitBtnId: "arrival-split-btn",
  departureInputId: "departure-input",
  departureSplitBtnId: "departure-split-btn"
};

const datePicker = new DatePicker(datePickerDomInfo);
datePicker.renderCalendar();

const dropDownContainer = document.querySelector("#drop-down-container");
const inputDropDown = document.querySelector("#number-guests-input");

const dropDownOptions = {
  container: dropDownContainer,
  input: inputDropDown,
  countElements: [
    { name: "Взрослые", countGroupName: "guest" },
    { name: "Дети", countGroupName: "guest" },
    { name: "Младенцы", countGroupName: "child" }
  ],
  countGroupView: {
    guest: { counter: 0, views: ["гость", "гостя", "гостей"] },
    child: { counter: 0, views: ["младенец", "младенца", "младенцев"] }
  },
  placeholder: "Cколько гостей"
};

const dropDown = new DropDown(dropDownOptions);
dropDown.init();

const mainMenuDomNode = {
  mainMenu: document.querySelector("#mainMenu"),
  burgerButton: document.querySelector("#mainMenuBurgerIcon"),
  authList: document.querySelector("#authListId"),
  profileButton: document.querySelector("#authButton")
};
new MainMenu(mainMenuDomNode);