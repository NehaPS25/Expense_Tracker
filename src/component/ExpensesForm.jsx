import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext"; // adjust path if needed
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense"); // "expense" or "income"
  const [editId, setEditId] = useState(null);

  // 🧠 Load stored expenses from localStorage when component mounts
  useEffect(() => {
    const storedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
    setExpenses(storedExpenses);
  }, []);

  // 💾 Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // ➕ Handle add / update expense
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!title || !amount) return alert("Please fill all fields!");

    const newExpense = {
      id: editId ? editId : Date.now(),
      title,
      amount: parseFloat(amount),
      type,
    };

    if (editId) {
      // update existing expense
      const updated = expenses.map((exp) =>
        exp.id === editId ? newExpense : exp
      );
      setExpenses(updated);
      setEditId(null);
    } else {
      // add new expense
      setExpenses([...expenses, newExpense]);
    }

    // clear form
    setTitle("");
    setAmount("");
    setType("expense");
  };

  // ✏️ Handle edit
  const handleEdit = (id) => {
    const exp = expenses.find((e) => e.id === id);
    setTitle(exp.title);
    setAmount(exp.amount);
    setType(exp.type);
    setEditId(id);
  };

  // ❌ Handle delete
  const handleDelete = (id) => {
    const filtered = expenses.filter((e) => e.id !== id);
    setExpenses(filtered);
  };

  // 🧮 Summary
  const totalIncome = expenses
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpense = expenses
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);

  const balance = totalIncome - totalExpense;

  // 🚪 Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <h2>Welcome, {user?.username} 👋</h2>
      <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>

      <div style={styles.summaryBox}>
        <h3>Total Income: ₹{totalIncome}</h3>
        <h3>Total Expense: ₹{totalExpense}</h3>
        <h3>Balance: ₹{balance}</h3>
      </div>

      <form onSubmit={handleAddExpense} style={styles.form}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <button type="submit">
          {editId ? "Update Expense" : "Add Expense"}
        </button>
      </form>

      <ul style={styles.list}>
        {expenses.map((exp) => (
          <li key={exp.id} style={styles.listItem}>
            <span>
              {exp.title} — ₹{exp.amount} ({exp.type})
            </span>
            <div>
              <button onClick={() => handleEdit(exp.id)}>Edit</button>
              <button onClick={() => handleDelete(exp.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// 🎨 Simple inline styles (you can replace with CSS)
const styles = {
  container: { maxWidth: "600px", margin: "20px auto", textAlign: "center" },
  logoutBtn: { marginBottom: "10px", background: "tomato", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "4px" },
  summaryBox: { background: "#f0f0f0", padding: "10px", borderRadius: "8px", marginBottom: "15px" },
  form: { display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" },
  list: { listStyle: "none", padding: 0 },
  listItem: { display: "flex", justifyContent: "space-between", background: "#fafafa", padding: "8px", margin: "5px 0", borderRadius: "5px" }
};

export default Dashboard;
