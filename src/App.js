// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import FileUpload from "./components/FileUpload/FileUpload";
import SuperFileUpload from "./components/SuperFileUpload/SuperFileUpload";
import Login from "./components/Login/Login";
import './App.css';

const App = () => {
  const [role, setRole] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [presetQuestions, setPresetQuestions] = useState([]);
  const [presetEmails, setPresetEmails] = useState([]);

  useEffect(() => {
    const fetchPresets = async () => {
      const questionsSnapshot = await getDocs(collection(db, "presetQuestions"));
      const emailsSnapshot = await getDocs(collection(db, "presetEmails"));
      setPresetQuestions(questionsSnapshot.docs.map(doc => doc.data().question));
      setPresetEmails(emailsSnapshot.docs.map(doc => doc.data().email));
    };
    fetchPresets();
  }, []);

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
