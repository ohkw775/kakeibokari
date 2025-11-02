import { toLocalDateString, normalizeDate } from "../dateUtils/dateUtils";
import { VscTriangleLeft } from "react-icons/vsc";
import { VscTriangleRight } from "react-icons/vsc";
import { GoIssueReopened } from "react-icons/go";

interface CalendarHeaderProps {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  isDarkMode: boolean;
  toggleMode: () => void;
  expenses: {
    amount: number;
    category: string;
    date: string;
    memo?: string;
  }[];
  fixedExpenses: {
    amount: number;
    category: string;
    paymentDay: number;
    isRecurring: boolean;
    memo?: string;
  }[];
}

const CalendarHeader = (props: CalendarHeaderProps) => {
  const thisYear = props.date.getFullYear(); // 現在の年
  const thisMonth = props.date.getMonth(); // 現在の月（インデックス）

  // 今月の支出合計（通常支出＋固定費）を計算する
  let normalTotal = 0; // 通常の支出
  let fixedTotal = 0; // 固定費
  // 今月の最初の日と最後の日を文字列で用意
  const startStr = toLocalDateString(new Date(thisYear, thisMonth, 1)); // 例: "2025-11-01"
  const endStr = toLocalDateString(new Date(thisYear, thisMonth + 1, 0)); // 例: "2025-11-30"
  // 通常支出を1つずつ取り出して、今月分だけ合計する
  for (let i = 0; i < props.expenses.length; i++) {
    const oneExpense = props.expenses[i]; // 1件分の支出
    const fixedDate = normalizeDate(oneExpense.date); // 日付を "YYYY-MM-DD" に整える
    // その日付が「今月の範囲」に入っていたら合計に足す
    if (fixedDate >= startStr && fixedDate <= endStr) {
      normalTotal = normalTotal + oneExpense.amount;
    }
  }
  // 今月の固定費の合計を出す
  const daysInMonth = new Date(thisYear, thisMonth + 1, 0).getDate(); // 今月の日数（例: 30日）
  for (let i = 0; i < props.fixedExpenses.length; i++) {
    const oneFixed = props.fixedExpenses[i]; // 1件分の固定費
    // 支払い日が1〜今月末の間なら合計に加える
    if (oneFixed.paymentDay >= 1 && oneFixed.paymentDay <= daysInMonth) {
      fixedTotal = fixedTotal + oneFixed.amount;
    }
  }
  // 通常支出と固定費を足して「今月の合計」を出す
  const totalThisMonth = normalTotal + fixedTotal;

  const handleChangeCalendar = (pager: string) => {
    if (pager === "prev") {
      props.setDate(new Date(thisYear, thisMonth - 1));
    } else if (pager === "next") {
      props.setDate(new Date(thisYear, thisMonth + 1));
    }
  };
  // 今日に戻るボタン↓
  const handleGoToday = () => {
    props.setDate(new Date());
  };

  return (
    <header
      className={`
      flex flex-col items-center
      bg-transparent
      ${props.isDarkMode ? "text-white" : "text-gray-800"}
      px-6 py-6 md:px-10 md:py-8
      font-cute
    `}
    >
      {/*  上の段： ナイトモードと 合計 */}
      <div className="w-full flex justify-between items-center mb-6">
        {/* ナイトモードボタン */}
        <label className="swap swap-rotate cursor-pointer text-gray-500">
          <input
            type="checkbox"
            onChange={props.toggleMode}
            checked={props.isDarkMode}
          />
          {/* moon icon（swap-on） */}
          <svg
            className="swap-on h-7 w-7 fill-current text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>

          {/* sun icon（swap-off） */}
          <svg
            className="swap-off h-7 w-7 fill-current text-pink-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>
        </label>

        {/* 月の合計金額 */}
        <div
          className={`
          text-2xl md:text-3xl font-bold tracking-wide
          px-4 py-2 rounded-xl
          ${
            props.isDarkMode
              ? "bg-gradient-to-r from-purple-900 to-purple-800 text-gray-300 shadow-md"
              : "bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-md"
          }
        `}
        >
          合計: {totalThisMonth.toLocaleString()}円
        </div>
      </div>

      {/* 🔹 下の段：年月ナビ（中央） */}
      <div className="flex justify-center items-center gap-4">
        {/* ← 前月 */}
        <button
          className="text-gray-300 hover:text-pink-500 transition"
          onClick={() => handleChangeCalendar("prev")}
        >
          <VscTriangleLeft />
        </button>
        {/* 年月表示 */}
        <h1
          className={`
    text-2xl md:text-3xl font-bold tracking-wide
    ${props.isDarkMode ? "text-purple-300" : "text-pink-600"}
  `}
        >
          {thisYear}年{thisMonth + 1}月
        </h1>

        {/* → 次月 */}
        <button
          className="text-gray-300 hover:text-pink-500 transition"
          onClick={() => handleChangeCalendar("next")}
        >
          <VscTriangleRight />
        </button>
        {/* 今日ボタン */}
        <button
          onClick={handleGoToday}
          className="ml-6 text-sm text-gray-200 hover:text-pink-500 transition"
        >
          今日
        </button>

        <button
          className="ml-6 text-4xl text-gray-200 hover:text-pink-500 transition"
          onClick={() => window.location.reload()}
        >
          <GoIssueReopened />
        </button>
      </div>
    </header>
  );
};

export default CalendarHeader;
