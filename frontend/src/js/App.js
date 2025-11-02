"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
require("./css/style.css");
const CalendarHeader_1 = __importDefault(require("./components/CalendarHeader"));
const CalendarBody_1 = __importDefault(require("./components/CalendarBody"));
const App = () => {
    const [date, setDate] = (0, react_1.useState)(new Date());
    return (<>
      <div className="flex h-dvh flex-col">
        <CalendarHeader_1.default date={date} setDate={setDate}/>
        <CalendarBody_1.default date={date}/>
      </div>
      {/* モーダルのコンポーネントの呼び出し */}
    </>);
};
exports.default = App;
