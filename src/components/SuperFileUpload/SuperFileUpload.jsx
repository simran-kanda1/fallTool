import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './SuperFileUpload.css';
import logo from './logo.png';

const SuperFileUpload = ({ presetQuestions, setPresetQuestions, presetEmails, setPresetEmails }) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmType, setConfirmType] = useState("");
  const [confirmIndex, setConfirmIndex] = useState(null);
  const navigate = useNavigate();

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setPresetQuestions([...presetQuestions, newQuestion.trim()]);
      setNewQuestion("");
    }
  };

  const removeQuestion = (index) => {
    setPresetQuestions(presetQuestions.filter((_, i) => i !== index));
  };

  const addEmail = () => {
    if (newEmail.trim()) {
      setPresetEmails([...presetEmails, newEmail.trim()]);
      setNewEmail("");
    }
  };

  const removeEmail = (index) => {
    setPresetEmails(presetEmails.filter((_, i) => i !== index));
  };

  const handleLogout = () => {
    navigate("/");
  };

  const showRemoveConfirm = (type, index) => {
    setConfirmType(type);
    setConfirmIndex(index);
    setShowConfirm(true);
  };

  const handleConfirmRemove = () => {
    if (confirmType === "question") {
      removeQuestion(confirmIndex);
    } else if (confirmType === "email") {
      removeEmail(confirmIndex);
    }
    setShowConfirm(false);
  };

  return (
    <div className="super-file-upload-container">
      <img src={logo} alt="Logo" className="logo" />
      <h1 className="super-file-upload-title">SRR Super Admin Falls Analysis Tool</h1>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
      <div className="content-container">
        <div className="card">
          <h3 className="super-file-upload-subtitle">Edit Preset Questions</h3>
          <div className="questions-list">
            {presetQuestions.map((question, index) => (
              <div key={index} className="question-item">
                <span>{question}</span>
                <button onClick={() => showRemoveConfirm("question", index)}>Remove</button>
              </div>
            ))}
          </div>
          <div className="super-file-upload-input-group">
            <label htmlFor="new-question">New Question:</label>
            <input
              id="new-question"
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            <button className="super-file-upload-button" onClick={addQuestion}>Add Question</button>
          </div>
        </div>
        <div className="card">
          <h3 className="super-file-upload-subtitle">Edit Preset Emails</h3>
          <div className="emails-list">
            {presetEmails.map((email, index) => (
              <div key={index} className="email-item">
                <span>{email}</span>
                <button onClick={() => showRemoveConfirm("email", index)}>Remove</button>
              </div>
            ))}
          </div>
          <div className="super-file-upload-input-group">
            <label htmlFor="new-email">New Email:</label>
            <input
              id="new-email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <button className="super-file-upload-button" onClick={addEmail}>Add Email</button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="confirmation-popup">
          <div className="confirmation-content">
            <p>Are you sure you want to remove this {confirmType}?</p>
            <button className="confirm-btn" onClick={handleConfirmRemove}>Yes</button>
            <button className="edit-btn" onClick={() => setShowConfirm(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperFileUpload;
