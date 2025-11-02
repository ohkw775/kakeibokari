"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CalendarHeader = (props) => {
    const thisYear = props.date.getFullYear(); // 現在の年
    const thisMonth = props.date.getMonth(); // 現在の月（インデックス）
    const handleChangeCalendar = (pager) => {
        if (pager === "prev") {
            props.setDate(new Date(thisYear, thisMonth - 1));
        }
        else if (pager === "next") {
            props.setDate(new Date(thisYear, thisMonth + 1));
        }
    };
    // 今日に戻るボタン↓
    const handleGoToday = () => {
        props.setDate(new Date());
    };
    return (<header className="flex items-center justify-between bg-pink-500 px-4 py-5">
      <div className="flex items-center gap-3">
        <button className="text-slate-50" onClick={() => handleChangeCalendar("prev")}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
          </svg>
        </button>

        <h1 className="text-3xl font-bold text-slate-50 text-center ">
          {thisYear}年{thisMonth + 1}月
        </h1>

        <button className="w-5 text-slate-50" onClick={() => handleChangeCalendar("next")}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
          </svg>
        </button>
      </div>

      {/* 今日に戻るボタン */}
      <button onClick={handleGoToday} className="text-slate-50 flex ">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"/>
        </svg>
      </button>
    </header>);
};
exports.default = CalendarHeader;
