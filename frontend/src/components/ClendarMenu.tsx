import { useState } from "react";
import ExpenseForm from "./ExpenseForm";
import FixedForm from "./FixedForm";

interface CalendarMenuProps {
  isDarkMode: boolean;
  setExpenses: React.Dispatch<
    React.SetStateAction<
      {
        amount: number;
        category: string;
        date: string;
        memo?: string;
      }[]
    >
  >;
  setFixedExpenses: React.Dispatch<
    React.SetStateAction<
      {
        amount: number;
        category: string;
        paymentDay: number;
        isRecurring: boolean;
        memo?: string;
      }[]
    >
  >;
}

const CalendarMenu = ({
  isDarkMode,
  setExpenses,
  setFixedExpenses,
}: CalendarMenuProps) => {
  // const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  const [isFixedFormOpen, setIsFixedFormOpen] = useState(false);

  const handleSaveExpense = (savedExpense: {
    id?: number;
    amount: number;
    category: string;
    date: string;
    memo: string;
  }) => {
    // ExpenseForm ですでに DB に保存されているので、
    // ここでは state に追加するだけでOK
    setExpenses((prev) => [...prev, savedExpense]);
  };

  // 固定費保存ボタンを押したときどこに保存されるか、DBへおくる
  const handleSaveFixed = async (fixedData: {
    amount: number;
    category: string;
    paymentDay: number;
    isRecurring: boolean;
    memo: string;
  }) => {
    try {
      const res = await fetch(
        "https://kakeibokari.onrender.com/api/fixed_expenses",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fixedData),
        }
      );

      if (!res.ok) throw new Error("固定費の保存に失敗");

      // ここでサーバーからのレスポンスを待つ
      await res.json();

      // POSTが成功したら最新データを取得し直す
      const refreshed = await fetch(
        "https://kakeibokari.onrender.com/api/fixed_expenses"
      );
      const newFixeds = await refreshed.json();

      //  これで即時反映
      setFixedExpenses(newFixeds);
    } catch (error) {
      console.error("固定費保存エラー:", error);
      alert("サーバーへの保存に失敗しました");
    }
  };

  return (
    <div
      className={`
    flex flex-row justify-around items-center
    gap-6 p-5 text-base md:text-xl transition-all duration-500   
    ${isDarkMode ? "bg-gray-800 text-white" : "bg-purple-100 text-black"}
    fixed bottom-0 left-0 w-full md:static md:w-full

  `}
    >
      {/* 支出入力 */}
      <button
        className="btn bg-purple-400 hover:bg-purple-500 text-white rounded-lg px-4 py-2"
        onClick={() => setIsExpenseFormOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m9 7.5 3 4.5m0 0 3-4.5M12 12v5.25M15 12H9m6 3H9m12-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        支出
      </button>

      {isExpenseFormOpen && (
        <ExpenseForm
          onClick={() => setIsExpenseFormOpen(false)}
          onSave={handleSaveExpense}
        />
      )}

      {/* 固定費入力 */}

      <button
        className="btn bg-purple-400 hover:bg-purple-500 text-white rounded-lg px-4 py-2"
        onClick={() => setIsFixedFormOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
        固定費登録
      </button>

      {isFixedFormOpen && (
        <FixedForm
          onClick={() => setIsFixedFormOpen(false)}
          onSave={handleSaveFixed}
        />
      )}
      <a
        href="https://zukan.pokemon.co.jp/detail/0025"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-2 right-2"
      >
        <img
          src="/pikazennsinn.png"
          alt="ピカチュウ"
          className="
          w-16 h-16 sm:bottom-4 sm:right-4 sm:w-20 sm:h-20 md:w-24 md:h-24
      opacity-90 select-none transition-transform duration-300 hover:scale-105
          hide-pikachu"
        />
      </a>
    </div>
  );
};

export default CalendarMenu;
