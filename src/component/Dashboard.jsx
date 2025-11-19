import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [expenses, setExpenses] = useState([]);
  const [editId, setEditId] = useState(null);

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ Load saved expenses for logged-in user
  useEffect(() => {
    if (user) {
      const storedExpenses = JSON.parse(
        localStorage.getItem(`expenses_${user.username}`)
      );
      if (storedExpenses) setExpenses(storedExpenses);
    }
  }, [user]);

  // ✅ Save expenses when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`expenses_${user.username}`, JSON.stringify(expenses));
    }
  }, [expenses, user]);

  // ✅ Add or update expense
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) {
      alert("Please enter both title and amount!");
      return;
    }

    if (editId) {
      const updatedExpenses = expenses.map((exp) =>
        exp.id === editId ? { ...exp, title, amount: Number(amount), type } : exp
      );
      setExpenses(updatedExpenses);
      setEditId(null);
    } else {
      const newExpense = {
        id: Date.now(),
        title,
        amount: Number(amount),
        type,
      };
      setExpenses([...expenses, newExpense]);
    }

    setTitle("");
    setAmount("");
    setType("income");
  };

  const handleDelete = (id) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  const handleEdit = (expense) => {
    setTitle(expense.title);
    setAmount(expense.amount);
    setType(expense.type);
    setEditId(expense.id);
  };

  // ✅ Totals
  const totalIncome = expenses
    .filter((exp) => exp.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = expenses
    .filter((exp) => exp.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  // 🎨 Inline CSS styles
  const styles = {
    container: {
      fontFamily: "Poppins, sans-serif",
      background: "linear-gradient(135deg, #A8EDEA, #FED6E3)",
      minHeight: "100vh",
      padding: "40px",
      textAlign: "center",
      width: "90vw",
      margin: "0 auto",
      color: "#333",
      marginLeft: "2vw",},
    card: {
      backgroundColor: "#fff",
      borderRadius: "12px",
      padding: "25px",
      maxWidth: "1000px",
      margin: "0 auto",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      display: "flex",
      gap: "30px",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    left: {
      flex: 1,
      textAlign: "left",
    },
    right: {
      flex: 1,
      textAlign: "left",
      backgroundColor: "#f9f9f9",
      borderRadius: "10px",
      padding: "15px",
      maxHeight: "400px",
      overflowY: "auto",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      marginBottom: "20px",
    },
    input: {
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "14px",
    },
    select: {
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #ccc",
    },
    button: {
      padding: "10px",
      backgroundColor: "#5563DE",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    list: {
      listStyle: "none",
      padding: 0,
      marginTop: "10px",
    },
    listItem: {
      backgroundColor: "#fff",
      marginBottom: "8px",
      padding: "10px",
      borderRadius: "6px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    summaryBox: {
      background: "#f0f8ff",
      borderRadius: "8px",
      padding: "15px",
      marginTop: "15px",
    },
    logoutBtn: {
      backgroundColor: "#E74C3C",
      color: "#fff",
      border: "none",
      padding: "10px 15px",
      borderRadius: "6px",
      cursor: "pointer",
      marginTop: "15px",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.container}>
      <h2>Welcome, {user?.username} 🎉</h2>
      <p>You have successfully logged in.</p>


      <div style={styles.card}>
        {/* LEFT SIDE - Form + Summary */}
        <div style={styles.left}>
          <h3>Expense Tracker</h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
            />
            <input
              type="number"
              placeholder="Enter Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={styles.input}
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={styles.select}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <button type="submit" style={styles.button}>
              {editId ? "Update Transaction" : "Add Transaction"}
            </button>
          </form>

          <div style={styles.summaryBox}>
            <h3>Summary</h3>
            <p>💰 Total Income: ₹{totalIncome}</p>
            <p>💸 Total Expense: ₹{totalExpense}</p>
            <h4>💼 Balance: ₹{balance}</h4>
          </div>
        </div>

        {/* RIGHT SIDE - List */}
        <div style={styles.right}>
          <h3>Transactions</h3>
          <ul style={styles.list}>
            {expenses.map((exp) => (
              <li key={exp.id} style={styles.listItem}>
                <span>
                  <strong>{exp.title}</strong> — ₹{exp.amount} ({exp.type})
                </span>
                <span>
                  <button
                    onClick={() => handleEdit(exp)}
                    style={{
                      ...styles.button,
                      backgroundColor: "#f1c40f",
                      marginRight: "5px",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    style={{
                      ...styles.button,
                      backgroundColor: "#e74c3c",
                    }}
                  >
                    Delete
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        style={styles.logoutBtn}
      >
         Logout
      </button>
    </div>
  );
};

export default Dashboard;
