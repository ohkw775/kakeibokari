// 金額入力

import { useState, useEffect } from "react";
import CategoryDropdown from "./CategoryDropdown";

interface ExpenseFormProps {
  onClick: () => void; // 親から受け取る「閉じる関数」
  onSave: (Expensedata: {
    amount: number;
    category: string;
    date: string;
    memo: string;
  }) => void; // ? 親に支出データを渡す関数
}

const ExpenseForm = ({ onClick, onSave }: ExpenseFormProps) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [memo, setMemo] = useState("");

  const handleSave = async () => {
    if (!amount || !category || !date) {
      alert("金額・カテゴリ・日付を入力してください");
      return;
    }

    const expenseData = {
      amount: Number(amount),
      category,
      date,
      memo,
    };

    try {
      //  DBに登録
      const res = await fetch("http://localhost:3001/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
      });

      const savedExpense = await res.json(); // ← id付きで返ってくる！

      // ? 親に渡す
      onSave(savedExpense);

      // 入力リセット
      setAmount("");
      setCategory("");
      setDate("");
      setMemo("");
      onClick(); // モーダル閉じる
    } catch (error) {
      console.error("登録エラー:", error);
      alert("登録に失敗しました");
    }
  };

  // ? ページが開いた瞬間に「今日の日付」をセット
  useEffect(() => {
    const today = new Date();
    const formatted = today.toISOString().split("T")[0]; // "YYYY-MM-DD"形式にする
    setDate(formatted);
  }, []);

  return (
    <div className="fixed inset-0 bg-pink-200/60 flex justify-center items-center z-50">
      {/* ? モーダル本体 */}
      <div className="bg-white p-6 rounded-2xl shadow-lg w-80 border border-gray-300 relative">
        {/* ? 閉じるボタン */}
        <button
          onClick={onClick}
          className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
        <h3 className="text-lg font-bold text-purple-600 mb-2">支出入力</h3>
        <input
          type="number"
          placeholder="金額"
          className="input border w-full mb-2 bg-gray-300"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <CategoryDropdown
          selectedCategory={category}
          setSelectedCategory={setCategory}
        />
        {/*  日付は最初から今日の日付が入る */}
        <input
          type="date"
          className="input border w-full mb-2 bg-gray-300"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="メモ"
          className="input border w-full mb-2 bg-gray-300"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
        <div className="flex gap-2 mt-2">
          <button
            className="btn bg-pink-400 hover:bg-pink-500 text-white"
            onClick={handleSave}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;
