// 固定費フォーム

import { useState } from "react";
import CategoryDropdown from "./CategoryDropdown";

interface FixedFormProps {
  onClick: () => void; //親からもらう、閉じるかんすう
  onSave: (fixedData: {
    amount: number;
    category: string;
    paymentDay: number;
    isRecurring: boolean;
    memo: string;
  }) => void;
}

const FixedForm = ({ onClick, onSave }: FixedFormProps) => {
  //onSave
  const [amount, setAmount] = useState(""); //入力した金額を保存する
  const [category, setCategory] = useState(""); //カテゴリ（食費・家賃など）を保存
  const [paymentDay, setPaymentDay] = useState(1); //支払い日を保存（例：毎月1日）
  const [isRecurring, setIsRecurring] = useState(false); //「毎月繰り返すかどうか」のチェック
  const [memo, setMemo] = useState(""); //メモの内容を保存

  // 保存ボタン押したとき
  const handleSave = () => {
    if (!amount || !category || !paymentDay) {
      alert("金額・カテゴリ・支払日を入力してください");
      return;
    }

    //ここ↓ExpenseFormでは書いてないけど書く必要あるのか??
    const fixedData = {
      amount: Number(amount),
      category,
      paymentDay,
      isRecurring,
      memo,
    };

    onSave(fixedData); // ← 親に送る！
    setAmount("");
    setCategory("");
    setPaymentDay(1);
    setIsRecurring(false);
    setMemo("");
    onClick(); // 画面閉じる
  };

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
        <h3 className="text-lg font-bold text-purple-600 mb-2">固定費入力</h3>

        <input
          type="number"
          placeholder="金額"
          className="input border mb-2 bg-gray-300"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <CategoryDropdown
          selectedCategory={category}
          setSelectedCategory={setCategory}
        />

        <input
          type="number"
          placeholder="支払い日（1?31）"
          className="input border mb-2 bg-gray-300"
          min={1}
          max={31}
          value={paymentDay}
          onChange={(e) => setPaymentDay(Number(e.target.value))}
        />

        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            className="mr-2 "
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
          />
          毎月繰り返す
        </label>

        <input
          type="text"
          placeholder="メモ"
          className="input border mb-2 bg-gray-300"
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

export default FixedForm;
