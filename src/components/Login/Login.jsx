import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';
import logo from './PNG image.jpeg';

const Login = ({ setRole, setUserEmail }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const users = [
    { email: "admin.srr", password: "fallyx-srr6#", role: "admin" },
    { email: "superadmin.srr", password: "fallyx-srr1admin", role: "superadmin" },
  ];

  const handleLogin = () => {
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
      setRole(user.role);
      setUserEmail(user.email);
      navigate(user.role === "admin" ? "/upload" : "/super-upload");
    } else {
      setErrorMessage("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Logo" className="logoLogin" />
      <h2 className="login-title">Fallyx Falls Analysis Tool Login</h2>
      <div className="login-input-group">
        <label htmlFor="login-email">Username:</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="login-input-group">
        <label htmlFor="login-password">Password:</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {errorMessage && <p className="login-error-message">{errorMessage}</p>}
      <button className="login-button" onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
