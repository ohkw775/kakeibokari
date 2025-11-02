import { useState } from "react";
import CategoryDropdown from "./CategoryDropdown";
import { normalizeDate } from "../dateUtils/dateUtils"; // ← これ追加

//ExpenseEditForm は、「既に登録されている支出データ（amount, category, date, memoなど）」を編集・削除できるモーダル（ポップアップ）画面です。

interface ExpenseEditFormProps {
  expense: {
    //編集対象の支出データexpense
    id?: number;
    amount: number;
    category: string;
    date: string;
    memo?: string;
  };
  onClose: () => void;
  onUpdate: (updatedExpense: any) => void;
  onDelete: (id: number) => void;
}
// **props（親から渡される）**で「編集したい支出データ（expense）」を受け取る
//「保存」ボタンで 更新処理（onUpdate） を呼び出す
//削除」ボタンで 削除処理（onDelete） を呼び出す
//閉じる」ボタンで モーダルを閉じる（onClose）

const ExpenseEditForm = ({
  expense,
  onClose,
  onUpdate,
  onDelete,
}: ExpenseEditFormProps) => {
  const [amount, setAmount] = useState(expense.amount);
  const [category, setCategory] = useState(expense.category);
  const [memo, setMemo] = useState(expense.memo || "");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // 「削除しますか？」モーダルの開閉状態
  const [date, setDate] = useState(normalizeDate(expense.date)); // ← 初期値から整形

  //  更新ボタン
  //→ 入力欄の内容で expense を上書きし、
  // 親の onUpdate() を呼び出します。
  // 親コンポーネント（例: CalendarBody や App.tsx）がこの関数を受け取り、
  // MySQLに更新を送る or stateを更新する 処理を行います
  const handleUpdate = async () => {
    const updated = { ...expense, amount, category, memo, date };

    try {
      // 🔹 サーバーのDBを更新
      const res = await fetch(
        `https://kakeibokari.onrender.com/api/expenses/${expense.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        }
      );

      if (!res.ok) throw new Error("更新に失敗しました");

      const updatedExpense = await res.json();

      // 🔹 親(App.tsx)の state も更新
      onUpdate(updatedExpense); // 即画面反映
      onClose(); // モーダル閉じる
    } catch (err) {
      console.error("更新エラー:", err);
      alert("サーバーへの更新に失敗しました");
    }
  };

  // ? 削除ボタン（2段階）
  //削除」ボタンを押すと isConfirmOpen が true になり、
  // 　→ 「本当に削除しますか？」のモーダルを表示
  // 「はい」を押すと onDelete(expense.id) を呼び出す
  // 　→ 親が実際にデータを削除する
  const handleDeleteConfirm = () => {
    setIsConfirmOpen(true);
  };
  const handleDelete = () => {
    if (expense.id) {
      onDelete(expense.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-pink-200/60 bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-80 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-center text-pink-600">
          支出の編集
        </h2>

        <input
          type="number"
          placeholder="金額"
          className="input border w-full mb-2 bg-gray-300"
          value={amount === 0 ? "" : amount} // ← 0のときは空文字にして非表示
          onChange={(e) => setAmount(Number(e.target.value) || 0)} // ← 数値以外は0扱い
        />

        <CategoryDropdown
          selectedCategory={category}
          setSelectedCategory={setCategory}
        />

        <input
          type="date"
          value={normalizeDate(date)} // ← ここでも normalizeDate を使う
          onChange={(e) => setDate(e.target.value)}
          className="input input-bordered w-full mb-4 bg-gray-300"
        />

        <input
          type="text"
          placeholder="メモ"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="input input-bordered w-full mb-3 bg-gray-300"
        />

        <div className="flex justify-between mt-4">
          <button
            onClick={handleUpdate}
            className="btn bg-pink-400 hover:bg-pink-500 text-white"
          >
            保存
          </button>

          <button
            onClick={handleDeleteConfirm}
            className="btn bg-red-400 hover:bg-red-500 text-white"
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

export default ExpenseEditForm;
