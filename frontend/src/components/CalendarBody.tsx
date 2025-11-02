import { toLocalDateString, normalizeDate } from "../dateUtils/dateUtils";

interface CalendarBodyProps {
  date: Date;
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
  isDarkMode: boolean;
  // 固定費↓
  onSelectDate?: (date: string) => void;
}

const CalendarBody = (props: CalendarBodyProps) => {
  // カレンダー全体の情報
  const thisYear = props.date.getFullYear(); // 現在の年
  const thisMonth = props.date.getMonth(); // 現在の月（インデックス）
  const today = new Date(); // 今日の日付オブジェクト
  const firstDayOfWeek = new Date(thisYear, thisMonth, 1).getDay(); // 現在の年月の初日の曜日(インデックス)
  const lastDateNum = new Date(thisYear, thisMonth + 1, 0).getDate(); // 現在の年月の末日
  const lastDateOfPrevMonthNum = new Date(thisYear, thisMonth, 0).getDate(); // 前月の末日
  const rowNumber = Math.ceil((firstDayOfWeek + lastDateNum) / 7); // カレンダーの行数（（今月初日の曜日 + 今月末日）/ 週の長さ）
  let dayCount = 1; // 日のカウント

  // 固定費と入力金額のその日の合計の関数
  const TotalDateExpenses = (date: Date, dayNum: number) => {
    const dateStr = toLocalDateString(date); // Dateを文字列に直している

    // expensesDay の中には「その日（dateStr）に発生した支出データ」だけが入る。
    const expensesDay = [];
    for (let i = 0; i < props.expenses.length; i++) {
      const expense = props.expenses[i];
      const conversionDate = normalizeDate(expense.date);
      if (conversionDate === dateStr) {
        expensesDay.push(expense);
      }
    }
    // ここから「その日（dateStr）につかった金額（amount）」↓
    let dateStrTotal = 0;
    for (let i = 0; i < expensesDay.length; i++) {
      const expense = expensesDay[i]; // 1件分の支出データを取り出す
      dateStrTotal += expense.amount; // 金額を合計していく
    }
    // ここから固定費として使った金額↓
    // CalendarBody.tsx の固定費合計部分
    const fixedForDay = [];
    for (let i = 0; i < props.fixedExpenses.length; i++) {
      const fixed = props.fixedExpenses[i];
      if ((fixed.paymentDay ?? 0) === dayNum && (fixed.isRecurring ?? true)) {
        fixedForDay.push(fixed);
      }
    }

    // 固定費トータル↓
    let fixedTotal = 0;
    for (let i = 0; i < fixedForDay.length; i++) {
      const fixed = fixedForDay[i]; // 1件分の支出データを取り出す
      fixedTotal += fixed.amount; // 金額を合計していく
      // 以下最終の合計金額計算
    }
    return dateStrTotal + fixedTotal;
  };
  // 💡 金額に応じて背景色を変える関数
  const getColorByAmount = (amount: number) => {
    if (amount >= 10000) {
      return "bg-red-200"; //  1万円以上 → 薄い赤
    } else if (amount >= 5000) {
      return "bg-orange-200"; // 5000円以上 → オレンジ
    } else if (amount > 0) {
      return "bg-yellow-100"; //  少額 → 黄色
    } else {
      return ""; // 0円 → 透明（背景なし）
    }
  };

  return (
    <div
      className={`flex flex-col 
  w-[95%] sm:w-[650px] md:w-[700px]
  h-[450px] sm:h-[550px] md:h-[600px]
  mx-auto mt-6 mb-32
  border rounded-2xl shadow-lg overflow-y-auto
  transition-transform duration-500
  ${props.isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-300"}
  scale-[0.9] sm:scale-95 md:scale-100
`}
    >
      <Week />

      <div className={`grid grid-cols-7 grid-rows-${rowNumber} flex-grow`}>
        {[...Array(rowNumber * 7)].map((_, index) => {
          const borderStyle =
            (index + 1) % 7 === 0
              ? "border-b border-slate-300"
              : "border-b border-slate-300 border-r";

          // 先月末日の日付
          if (index < 7 && index < firstDayOfWeek) {
            const num = lastDateOfPrevMonthNum - firstDayOfWeek + index + 1;
            return (
              <div
                key={index}
                className={`${borderStyle} p-1 text-left text-slate-200`}
              >
                <span className="mb-2 inline-grid h-6 place-items-center">
                  {num}
                </span>
              </div>
            );
            // 来月頭の日付↓
          } else if (dayCount > lastDateNum) {
            const num = dayCount - lastDateNum;
            dayCount++;
            return (
              <div
                key={index}
                className={`p-1 text-left text-slate-200 ${borderStyle}`}
              >
                <span className=" inline-grid h-6 place-items-center">
                  {num}
                </span>
              </div>
            );
            // 今日の日付↓
          } else if (
            today.getFullYear() === thisYear &&
            today.getMonth() === thisMonth &&
            today.getDate() === dayCount
          ) {
            // そのマスの日にちの特有の情報↓
            const num = dayCount; //そのマスの日にち
            const date = new Date(thisYear, thisMonth, num); //そのマスの日付のオブジェクト
            const dateString = toLocalDateString(date); // 日付を「2025-10-03」みたいな文字列に
            const totalForDay = TotalDateExpenses(date, num); //その日に使った合計金額　日付を「2025-10-03」みたいな文字列に
            const hasExpense = totalForDay > 0; // 金額があるか（背景を塗るか
            dayCount++;

            return (
              <div
                key={index}
                className={`${borderStyle} p-1 text-left ${getColorByAmount(totalForDay)}`} // ← 💡ここを変更！
                onClick={() => props.onSelectDate?.(dateString)}
              >
                <span className=" inline-grid h-6 w-6 place-items-center  bg-pink-600 text-white">
                  {num}
                </span>
                {hasExpense && (
                  <div className="text-xs text-pink-600 font-semibold">
                    {totalForDay.toLocaleString()}円
                  </div>
                )}
              </div>
            );
            // 今日以外の今月の日付↓
          } else {
            const num = dayCount;
            const date = new Date(thisYear, thisMonth, num);
            const totalForDay = TotalDateExpenses(date, num); // ← ここも同じ
            const hasExpense = totalForDay > 0;
            const day = date.getDay();
            let textColor =
              day === 0 ? "text-red-500" : day === 6 ? "text-blue-500" : "";
            dayCount++;

            return (
              <div
                key={index}
                onClick={() => props.onSelectDate?.(toLocalDateString(date))}
                className={`
                ${borderStyle}
                p-1 text-left
                ${getColorByAmount(totalForDay)}  // ← ここで関数を呼び出す！
                `}
              >
                <span
                  className={`mb-2 inline-grid h-6 place-items-center ${textColor}`}
                >
                  {num}
                </span>
                {hasExpense && (
                  <div className="text-xs text-pink-600 font-semibold">
                    {totalForDay.toLocaleString()}円
                  </div>
                )}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

const Week = () => {
  const week = ["日", "月", "火", "水", "木", "金", "土"];

  return (
    <div className="grid grid-cols-7 border-b border-slate-300">
      {week.map((day, index) => {
        return (
          <div
            key={index}
            className={`w-full p-1 text-center ${
              index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : ""
            } ${index + 1 === 7 ? "" : "border-r border-slate-300"}`}
          >
            {day}
          </div>
        );
      })}
    </div>
  );
};

export default CalendarBody;
