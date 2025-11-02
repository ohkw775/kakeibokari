"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CalendarBody = (props) => {
    const thisYear = props.date.getFullYear(); // 現在の年
    const thisMonth = props.date.getMonth(); // 現在の月（インデックス）
    const today = new Date(); // 今日の日付オブジェクト
    const firstDayOfWeek = new Date(thisYear, thisMonth, 1).getDay(); // 現在の年月の初日の曜日(インデックス)
    const lastDateNum = new Date(thisYear, thisMonth + 1, 0).getDate(); // 現在の年月の末日
    const lastDateOfPrevMonthNum = new Date(thisYear, thisMonth, 0).getDate(); // 前月の末日
    const rowNumber = Math.ceil((firstDayOfWeek + lastDateNum) / 7); // カレンダーの行数（（今月初日の曜日 + 今月末日）/ 週の長さ）
    let dayCount = 1; // 日のカウント
    return (<div className="flex flex-grow flex-col">
      <Week />
      <div className={`grid grid-cols-7 grid-rows-${rowNumber} flex-grow`}>
        {[...Array(rowNumber * 7)].map((_, index) => {
            const borderStyle = (index + 1) % 7 === 0
                ? "border-b border-slate-300"
                : "border-b border-slate-300 border-r";
            // 先月末日の日付
            if (index < 7 && index < firstDayOfWeek) {
                const num = lastDateOfPrevMonthNum - firstDayOfWeek + index + 1;
                return (<div key={index} className={`${borderStyle} p-1 text-left text-slate-200`}>
                <span className="mb-2 inline-grid h-6 place-items-center">
                  {num}
                </span>
              </div>);
                // 来月頭の日付↓
            }
            else if (dayCount > lastDateNum) {
                const num = dayCount - lastDateNum;
                dayCount++;
                return (<div key={index} className={`p-1 text-left text-slate-200 ${borderStyle}`}>
                <span className=" inline-grid h-6 place-items-center">
                  {num}
                </span>
              </div>);
                // 今日の日付↓
            }
            else if (today.getFullYear() === thisYear &&
                today.getMonth() === thisMonth &&
                today.getDate() === dayCount) {
                const num = dayCount;
                dayCount++;
                return (<div key={index} className={`${borderStyle} p-1 text-left`}>
                <span className=" inline-grid h-6 w-6 place-items-center  bg-pink-600 text-white">
                  {num}
                </span>
              </div>);
                // 今日以外の今月の日付↓
            }
            else {
                const num = dayCount;
                const date = new Date(thisYear, thisMonth, num);
                const day = date.getDay();
                let textColor = day === 0 ? "text-red-500" : day === 6 ? "text-blue-500" : "";
                dayCount++;
                return (<div key={index} className={`${borderStyle} p-1 text-left`}>
                <span className={`mb-2 inline-grid h-6 place-items-center ${textColor}`}>
                  {num}
                </span>
              </div>);
            }
        })}
      </div>
    </div>);
};
const Week = () => {
    const week = ["日", "月", "火", "水", "木", "金", "土"];
    return (<div className="grid grid-cols-7 border-b border-slate-300">
      {week.map((day, index) => {
            return (<div key={index} className={`w-full p-1 text-center ${index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : ""} ${index + 1 === 7 ? "" : "border-r border-slate-300"}`}>
            {day}
          </div>);
        })}
    </div>);
};
exports.default = CalendarBody;
