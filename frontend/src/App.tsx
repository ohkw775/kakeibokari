import { useState, useEffect } from "react";
import { FaShieldDog } from "react-icons/fa6";

import "./css/style.css";

import CalendarHeader from "./components/CalendarHeader";
import CalendarBody from "./components/CalendarBody";
import CalendarMenu from "./components/ClendarMenu";
import ExpenseListByDate from "./components/ExpenseListByDate";
import { normalizeDate } from "./dateUtils/dateUtils";

const App = () => {
  const [date, setDate] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 支出
  const [expenses, setExpenses] = useState<
    {
      id?: number;
      amount: number;
      category: string;
      date: string;
      memo?: string;
    }[]
  >([]);

  // 固定費
  const [fixedExpenses, setFixedExpenses] = useState<
    {
      id?: number;
      amount: number;
      category: string;
      paymentDay: number;
      isRecurring: boolean;
      memo?: string;
    }[]
  >([]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // ✅ 初期データ取得（支出）
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch(
          "https://kakeibokari.onrender.com/api/expenses"
        );
        const data = await res.json();
        setExpenses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("支出取得エラー:", err);
      }
    };
    fetchExpenses();
  }, []);

  // ✅ 初期データ取得（固定費）
  useEffect(() => {
    const fetchFixedExpenses = async () => {
      try {
        const res = await fetch(
          "https://kakeibokari.onrender.com/api/fixed_expenses"
        );
        const data = await res.json();
        setFixedExpenses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("固定費取得エラー:", err);
      }
    };
    fetchFixedExpenses();
  }, []);

  // ✅ ダークモード切り替え
  const toggleMode = () => setIsDarkMode(!isDarkMode);

  // ✅ UI
  return (
    <div
      className={`min-h-screen transition-colors duration-500 bg-pattern ${
        isDarkMode
          ? "bg-gradient-to-b from-purple-900 to-gray-900 text-white"
          : "bg-gradient-to-b from-pink-100 to-pink-200 text-gray-800"
      }`}
    >
      <div className="flex flex-col">
        <h1 className="flex items-center justify-center gap-2 text-4xl font-bold mt-6 mb-8 text-pink-700">
          <FaShieldDog />
          MY 家計簿
          <FaShieldDog />
        </h1>

        <CalendarHeader
          date={date}
          setDate={setDate}
          isDarkMode={isDarkMode}
          toggleMode={toggleMode}
          expenses={expenses}
          fixedExpenses={fixedExpenses}
        />

        <CalendarBody
          date={date}
          expenses={expenses}
          fixedExpenses={fixedExpenses}
          isDarkMode={isDarkMode}
          onSelectDate={(dateStr) => setSelectedDate(dateStr)}
        />

        <section id="menu-section" className="px-4 py-6">
          <CalendarMenu
            isDarkMode={isDarkMode}
            setExpenses={setExpenses}
            setFixedExpenses={setFixedExpenses}
          />
        </section>
      </div>

      {/* 支出・固定費モーダル */}
      {selectedDate && (
        <ExpenseListByDate
          date={selectedDate}
          expenses={expenses.filter(
            (e) => normalizeDate(e.date) === selectedDate
          )}
          fixedExpenses={fixedExpenses.filter(
            (f) => f.paymentDay === new Date(selectedDate).getDate()
          )}
          onClose={() => setSelectedDate(null)}
          // ✏️ 更新反映（即時）
          onUpdate={(updated: any) => {
            if ("date" in updated) {
              setExpenses((prev) =>
                prev.map((e) => (e.id === updated.id ? updated : e))
              );
            } else if ("paymentDay" in updated) {
              setFixedExpenses((prev) =>
                prev.map((f) =>
                  Number(f.id) === Number(updated.id) ? updated : f
                )
              );

              setSelectedDate(null);
            }
          }}
          // // 🗑️ 削除即時反映
          onDelete={async (id) => {
            const isFixed = fixedExpenses.some((f) => f.id === id);
            const url = isFixed
              ? `https://kakeibokari.onrender.com/api/fixed_expenses/${id}`
              : `https://kakeibokari.onrender.com/api/expenses/${id}`;

            const res = await fetch(url, { method: "DELETE" });

            if (res.ok) {
              if (isFixed) {
                const refreshed = await fetch(
                  "https://kakeibokari.onrender.com/api/fixed_expenses"
                );
                setFixedExpenses(await refreshed.json());
              } else {
                const refreshed = await fetch(
                  "https://kakeibokari.onrender.com/api/expenses"
                );
                setExpenses(await refreshed.json());
              }
              setSelectedDate(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default App;
