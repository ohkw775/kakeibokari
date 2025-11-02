import { useState, useEffect } from "react";

interface CategoryDropdownProps {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void; // ExpenseFormの、const [category, setCategory] = useState("");の名前変えてるバージョン
}

const CategoryDropdown = ({
  selectedCategory,
  setSelectedCategory,
}: CategoryDropdownProps) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // ? ← 追加！

  // ? 初回にlocalStorageから読み込む
  useEffect(() => {
    const saved = localStorage.getItem("categories");
    if (saved) {
      setCategories(JSON.parse(saved));
    } else {
      setCategories(["食費", "交通費", "日用品", "光熱費"]);
    }
  }, []);

  // ? カテゴリを保存
  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  const handleAddCategory = () => {
    if (newCategory.trim() === "") {
      alert("カテゴリ名を入力してください");
      return;
    }
    const updatedList = [...categories, newCategory];
    setCategories(updatedList);
    setSelectedCategory(newCategory);
    setNewCategory("");
    setIsAdding(false);
  };

  return (
    <div className="relative mb-2 w-full">
      {/*  見出し部分（クリックで開閉） */}
      <div
        onClick={() => setIsOpen(!isOpen)} // クリックで開閉を切り替え
        className="input input-bordered w-full mb-2 bg-gray-300 flex justify-between items-center text-gray-700 font-medium cursor-pointer"
      >
        {selectedCategory || "カテゴリを選択"}
        <svg
          width="12"
          height="12"
          className={`inline-block h-3 w-3 fill-current opacity-60 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
        </svg>
      </div>

      {/*  ドロップダウン内容（isOpenの時だけ表示） */}
      {isOpen && (
        <ul className="absolute left-0 bg-base-200 rounded-box w-full p-2 shadow-lg z-[10]">
          {categories.map((cat) => (
            <li key={cat}>
              <button
                className={`btn btn-sm w-full justify-start ${
                  selectedCategory === cat
                    ? "bg-pink-300 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-pink-100"
                }`}
                onClick={() => {
                  setSelectedCategory(cat);
                  setIsOpen(false); // ← 選択した時だけ閉じる
                }}
              >
                {cat}
              </button>
            </li>
          ))}

          <li className="mt-2 border-t border-gray-300 pt-2">
            {!isAdding ? (
              <button
                className="btn btn-sm btn-outline btn-block text-pink-600 border-pink-400 hover:bg-pink-100"
                onClick={() => setIsAdding(true)}
              >
                ＋ カテゴリを追加
              </button>
            ) : (
              <div className="flex gap-1">
                <input
                  type="text"
                  placeholder="カテゴリ名"
                  className="input input-sm w-full bg-gray-300"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <button
                  className="btn btn-sm bg-pink-400 text-white"
                  onClick={handleAddCategory}
                >
                  追加
                </button>
              </div>
            )}
          </li>
        </ul>
      )}
    </div>
  );
};

export default CategoryDropdown;
