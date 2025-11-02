// ==========================
// 基本設定
// ==========================
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ==========================
// MySQL接続
// ==========================
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "nanaKo1221",
  database: "db_kakeibo",
});

connection.connect((error) => {
  if (error) {
    console.error("MySQL接続エラー:", error);
  } else {
    console.log("✅ MySQL接続成功");
  }
});

// ==========================
// 支出API
// ==========================
app.post("/api/expenses", (req, res) => {
  console.log("支出受信データ:", req.body); // ←ここ！
  const { amount, category, date, memo } = req.body;

  connection.query(
    "INSERT INTO expenses (amount, category, date, memo) VALUES (?, ?, ?, ?)",
    [amount, category, date, memo],
    (err, result) => {
      if (err) {
        console.error("支出登録エラー:", err);
        res.status(500).json({ error: "支出登録エラー" });
      } else {
        // 💡 挿入されたIDを返す！
        res.status(200).json({
          id: result.insertId,
          amount,
          category,
          date,
          memo,
        });
      }
    }
  );
});

app.get("/api/expenses", (req, res) => {
  connection.query("SELECT * FROM expenses ORDER BY date ASC", (err, rows) => {
    if (err) {
      console.error("支出取得エラー:", err);
      res.status(500).json({ error: "支出取得エラー" });
    } else {
      res.json(rows);
    }
  });
});
// 🗑️ 支出削除API
app.delete("/api/expenses/:id", (req, res) => {
  const { id } = req.params;
  connection.query("DELETE FROM expenses WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("削除エラー:", err);
      res.status(500).json({ error: "削除に失敗しました" });
    } else {
      console.log("削除成功:", result);
      res.json({ success: true });
    }
  });
});

// PUT: 支出データの更新
app.put("/api/expenses/:id", (req, res) => {
  const { id } = req.params;
  const { amount, category, date, memo } = req.body;

  const sql = `
    UPDATE expenses
    SET amount = ?, category = ?, date = ?, memo = ?
    WHERE id = ?
  `;

  connection.query(sql, [amount, category, date, memo, id], (err) => {
    if (err) {
      console.error("DB更新エラー:", err);
      res.status(500).json({ message: "DB更新に失敗しました" });
      return;
    }

    // 💡更新後のデータをそのまま返す！
    res.json({ id, amount, category, date, memo });
  });
});

// ==========================
// 固定費API
// ==========================
app.post("/api/fixed_expenses", (req, res) => {
  console.log("固定費受信データ:", req.body);

  try {
    const { amount, category, paymentDay, isRecurring, memo } = req.body;

    // React → MySQL のカラム対応変換
    const dayOfMonth = paymentDay;
    const repeat = isRecurring ? 1 : 0;

    const sql = `
      INSERT INTO fixed_expenses (category, amount, dayOfMonth, \`repeat\`, memo)
      VALUES (?, ?, ?, ?, ?)
    `;

    // ✅ result.insertId を使って ID を返すように修正
    connection.query(
      sql,
      [category, amount, dayOfMonth, repeat, memo],
      (err, result) => {
        if (err) {
          console.error("固定費登録エラー:", err);
          res.status(500).json({ error: "固定費登録エラー" });
        } else {
          res.status(200).json({
            id: result.insertId, // ← この行が重要！！
            amount,
            category,
            paymentDay: dayOfMonth,
            isRecurring: !!repeat,
            memo,
          });
        }
      }
    );
  } catch (e) {
    console.error("固定費登録サーバー例外:", e);
    res.status(500).json({ error: "予期しないサーバーエラー" });
  }
});

app.get("/api/fixed_expenses", (req, res) => {
  connection.query(
    "SELECT * FROM fixed_expenses ORDER BY dayOfMonth ASC",
    (err, rows) => {
      if (err) {
        console.error("固定費取得エラー:", err);
        res.status(500).json({ error: "固定費取得エラー" });
      } else {
        // ✅ MySQLのカラム名(dayOfMonth, repeat)をReact用の名前(paymentDay, isRecurring)に変換
        const converted = rows.map((row) => ({
          id: row.id,
          amount: row.amount,
          category: row.category,
          paymentDay: row.dayOfMonth, // 💡ここ変換！
          isRecurring: !!row.repeat, // tinyint(1) → boolean
          memo: row.memo,
        }));

        res.json(converted);
      }
    }
  );
});

// 固定費の更新（編集）
app.put("/api/fixed_expenses/:id", (req, res) => {
  const { id } = req.params;
  const { amount, category, paymentDay, isRecurring, memo } = req.body;

  const dayOfMonth = paymentDay;
  const repeat = isRecurring ? 1 : 0;

  const sql = `
    UPDATE fixed_expenses
    SET amount = ?, category = ?, dayOfMonth = ?, \`repeat\` = ?, memo = ?
    WHERE id = ?
  `;

  connection.query(
    sql,
    [amount, category, dayOfMonth, repeat, memo, id],
    (err, result) => {
      if (err) {
        console.error("固定費更新エラー:", err);
        res.status(500).json({ message: "固定費の更新に失敗しました" });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ message: "指定された固定費が見つかりません" });
      } else {
        // ✅ React側と同じキー名で返す！
        res.json({
          id: Number(id),
          amount,
          category,
          paymentDay: dayOfMonth,
          isRecurring,
          memo,
        });
      }
    }
  );
});

// 固定費の削除
app.delete("/api/fixed_expenses/:id", (req, res) => {
  const { id } = req.params;

  connection.query(
    "DELETE FROM fixed_expenses WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("固定費削除エラー:", err);
        res.status(500).json({ message: "固定費の削除に失敗しました" });
      } else if (result.affectedRows === 0) {
        console.warn("⚠️ 削除対象が見つかりません:", id);
        res.status(404).json({ message: "指定された固定費が見つかりません" });
      } else {
        console.log("✅ 固定費削除成功:", result);
        res.json({ success: true });
      }
    }
  );
});

// ==========================
// サーバー起動
// ==========================
app.listen(port, () =>
  console.log(`✅ Server running on http://localhost:${port}`)
);
