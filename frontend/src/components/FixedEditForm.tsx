// 固定費の編集

import { useState } from "react";

interface FixedExpense {
  id?: number;
  amount: number;
  category: string;
  paymentDay: number;
  isRecurring: boolean;
  memo?: string;
}

interface FixedEditFormProps {
  fixed: FixedExpense;
  onClose: () => void;
  onUpdate: (updated: FixedExpense) => void;
  onDelete: (id: number) => void;
}

const FixedEditForm = ({
  fixed,
  onClose,
  onUpdate,
  onDelete,
}: FixedEditFormProps) => {
  const [amount, setAmount] = useState(fixed.amount);
  const [category, setCategory] = useState(fixed.category);
  const [paymentDay, setPaymentDay] = useState(fixed.paymentDay);
  const [isRecurring, setIsRecurring] = useState(fixed.isRecurring);
  const [memo, setMemo] = useState(fixed.memo || "");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // 「削除しますか？」モーダルの開閉状態

  // 💾 更新処理
  const handleUpdate = async () => {
    const updated = {
      ...fixed,
      amount,
      category,
      paymentDay,
      isRecurring,
      memo,
    };

    try {
      const res = await fetch(
        `http://localhost:3001/api/fixed_expenses/${fixed.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        }
      );

      if (!res.ok) throw new Error("更新に失敗しました");
      const updatedFixed = await res.json();
      console.log("更新後のデータ:", updatedFixed); // ←これを追加
      onUpdate(updatedFixed);
      alert("固定費を更新しました！");
      onClose();
    } catch (err) {
      console.error("固定費更新エラー:", err);
    }
  };

  // 🗑 削除処理
  const handleDeleteConfirm = () => {
    setIsConfirmOpen(true);
  };
  // 🗑 削除処理
  const handleDelete = async () => {
    if (!fixed.id) return;

    try {
      const res = await fetch(
        `http://localhost:3001/api/fixed_expenses/${fixed.id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("削除失敗");

      onDelete(fixed.id); // state更新
      onClose(); // モーダル閉じる
    } catch (err) {
      console.error("固定費削除エラー:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-pink-200/60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-80 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-center text-purple-600">
          固定費の編集
        </h2>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="input input-bordered w-full mb-2 bg-gray-200"
          placeholder="金額"
        />

        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input input-bordered w-full mb-2 bg-gray-200"
          placeholder="カテゴリ"
        />

        <input
          type="number"
          value={paymentDay}
          onChange={(e) => setPaymentDay(Number(e.target.value))}
          className="input input-bordered w-full mb-2 bg-gray-200"
          placeholder="支払日"
        />

        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="mr-2"
          />
          毎月繰り返す
        </label>

        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="input input-bordered w-full mb-4 bg-gray-200"
          placeholder="メモ"
        />

        <div className="flex justify-between">
          <button
            onClick={handleUpdate}
            className="btn bg-purple-400 text-white hover:bg-purple-500"
          >
            保存
          </button>
          <button
            onClick={handleDeleteConfirm}
            className="btn bg-red-400 text-white hover:bg-red-500"
          >
            削除
          </button>
        </div>
        {/* ? 削除確認*/}
        {isConfirmOpen && (
          <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center rounded-xl">
            <p className="text-lg font-bold text-gray-700 mb-4">
              本当に削除しますか？
            </p>
            <div className="flex gap-4 ">
              <button
                onClick={handleDelete}
                className="btn bg-red-500 hover:bg-red-600 text-white"
              >
                はい
              </button>
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="btn bg-gray-300 hover:bg-gray-400 text-black"
              >
                いいえ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FixedEditForm;
