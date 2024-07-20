import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import FileUpload from "./components/FileUpload/FileUpload";
import SuperFileUpload from "./components/SuperFileUpload/SuperFileUpload";
import Login from "./components/Login/Login";
import './App.css';

const App = () => {
  const [role, setRole] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [presetQuestions, setPresetQuestions] = useState([
    "How many residents fell?",
    "How many are reoccurring falls?",
    "What time of day?",
    "What day of the week?",
    "Where are they falling?",
    "What's causing the fall?",
    "What's the result of the fall?",
  ]);
  const [presetEmails, setPresetEmails] = useState([
    "example1@example.com",
    "example2@example.com",
    "example3@example.com",
  ]);

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<Login setRole={setRole} setUserEmail={setUserEmail} />} />
          <Route
            path="/upload"
            element={
              role === "admin" ? (
                <FileUpload
                  userEmail={userEmail}
                  presetQuestions={presetQuestions}
                  presetEmails={presetEmails}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/super-upload"
            element={
              role === "superadmin" ? (
                <SuperFileUpload
                  presetQuestions={presetQuestions}
                  setPresetQuestions={setPresetQuestions}
                  presetEmails={presetEmails}
                  setPresetEmails={setPresetEmails}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
