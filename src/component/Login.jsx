import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext.jsx";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const matchedUser = allUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (matchedUser) {
      login(matchedUser);
      localStorage.setItem("loggedUser", JSON.stringify(matchedUser));
      alert(`Welcome back, ${matchedUser.username}!`);
      navigate("/dashboard");
    } else {
      alert("Invalid username or password!");
    }
  }

  // ✅ Inline Styles
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "90vw",
      margin: "0 auto",
      marginLeft: "4vw",
      background: "linear-gradient(135deg, #74ebd5, #acb6e5)",
      fontFamily: "Poppins, sans-serif",
    },
    box: {
      backgroundColor: "#fff",
      padding: "2rem 3rem",
      borderRadius: "1rem",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.15)",
      width: "350px",
      textAlign: "center",
    },
    heading: {
      marginBottom: "1.5rem",
      color: "#333",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      margin: "8px 0",
      border: "1px solid #ccc",
      borderRadius: "6px",
      fontSize: "16px",
      outline: "none",
    },
    button: {
      backgroundColor: "#6c63ff",
      color: "white",
      fontSize: "16px",
      padding: "10px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      width: "100%",
      marginTop: "10px",
    },
    registerText: {
      marginTop: "1rem",
      color: "#555",
      fontSize: "14px",
    },
    registerButton: {
      background: "none",
      border: "none",
      color: "#6c63ff",
      fontWeight: "600",
      cursor: "pointer",
      textDecoration: "underline",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.heading}>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        <p style={styles.registerText}>
          Don’t have an account?{" "}
          <button
            type="button"
            style={styles.registerButton}
            onClick={() => navigate("/")}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
