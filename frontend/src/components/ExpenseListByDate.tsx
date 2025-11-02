import { useState } from "react";
import ExpenseEditForm from "./ExpenseEditForm";
import FixedEditForm from "./FixedEditForm";

interface Expense {
  id?: number;
  amount: number;
  category: string;
  date: string;
  memo?: string;
}

interface FixedExpense {
  id?: number;
  amount: number;
  category: string;
  paymentDay: number;
  isRecurring: boolean;
  memo?: string;
}

interface ExpenseListByDateProps {
  date: string;
  expenses: Expense[];
  fixedExpenses: FixedExpense[];
  onClose: () => void;
  onUpdate: (updated: Expense | FixedExpense) => void; // ← 両対応に！
  onDelete: (id: number) => void;
}

const ExpenseListByDate = ({
  date,
  expenses,
  fixedExpenses,
  onClose,
  onUpdate,
  onDelete,
}: ExpenseListByDateProps) => {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingFixed, setEditingFixed] = useState<FixedExpense | null>(null);
  return (
    <div className="fixed inset-0 bg-pink-200/60 flex items-center justify-center z-40">
      <div className="bg-white rounded-2xl p-6 w-[350px] shadow-xl relative">
        {/* ✨ モーダルタイトル */}
        {!editingExpense && !editingFixed && (
          <>
            <h2 className="text-xl font-bold text-center text-pink-600 mb-4">
              {date}
            </h2>

            {/* 支出 or 固定費 どっちもない */}
            {expenses.length === 0 && fixedExpenses.length === 0 ? (
              <p className="text-gray-500 text-center">
                この日は支出・固定費がありません。
              </p>
            ) : (
              <ul className="space-y-3">
                {/* 💰 通常の支出リスト */}
                {expenses.map((exp) => (
                  <li
                    key={exp.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <span className="font-semibold">{exp.category}</span>{" "}
                      <span>{exp.amount.toLocaleString()}円</span>
                    </div>
                    <button
                      className="btn btn-xs bg-pink-400 hover:bg-pink-500 text-white"
                      onClick={() => setEditingExpense(exp)}
                    >
                      編集
                    </button>
                  </li>
                ))}

                {/* 固定費リスト */}
                {fixedExpenses.map((f, index) => (
                  <li
                    key={`fixed-${index}`}
                    className="flex justify-between items-center border-b pb-2 "
                  >
                    <div>
                      <span className="font-semibold">{f.category}</span>{" "}
                      <span>{f.amount.toLocaleString()}円（固定費）</span>
                    </div>
                    {/* 固定費の編集ボタン */}
                    <button
                      className="btn btn-xs bg-purple-400 hover:bg-purple-500 text-white"
                      onClick={() => setEditingFixed(f)}
                    >
                      編集
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex justify-center mt-5">
              <button
                onClick={onClose}
                className="btn bg-gray-300 hover:bg-gray-400 text-black"
              >
                閉じる
              </button>
            </div>
          </>
        )}

        {/*  支出編集フォーム表示中 */}
        {editingExpense && (
          <ExpenseEditForm
            expense={editingExpense}
            onClose={() => setEditingExpense(null)}
            onUpdate={(updated) => {
              onUpdate(updated);
              setEditingExpense(null);
            }}
            onDelete={(id) => {
              onDelete(id);
              setEditingExpense(null);
            }}
          />
        )}

        {/* 固定費編集フォーム表示中 */}
        {editingFixed && (
          <FixedEditForm
            fixed={editingFixed}
            onClose={() => setEditingFixed(null)}
            onUpdate={(updated) => {
              onUpdate(updated); // ✅ Appに更新を伝える！
              setEditingFixed(null); // ✅ モーダル閉じる
            }}
            onDelete={(id) => {
              onDelete(id); // ✅ Appに削除を伝える！
              setEditingFixed(null); // ✅ モーダル閉じる
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ExpenseListByDate;
