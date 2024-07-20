import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytesResumable } from "firebase/storage";
import { storage, db } from "../../firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import './FileUpload.css';
import logo from './logo.png';

const FileUpload = ({ userEmail, presetQuestions, presetEmails }) => {
  const inputRef = useRef();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [questions, setQuestions] = useState("");
  const [progress, setProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState("select");
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPresetQuestions, setShowPresetQuestions] = useState(false);
  const [selectedPresetQuestions, setSelectedPresetQuestions] = useState([]);
  const [showPresetEmails, setShowPresetEmails] = useState(false);
  const [selectedPresetEmails, setSelectedPresetEmails] = useState([]);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  const clearFileInput = () => {
    inputRef.current.value = "";
    setSelectedFiles([]);
    setQuestions("");
    setProgress({});
    setUploadStatus("select");
    setSubmissionMessage("");
    setErrorMessage("");
    setShowConfirmation(false);
    setSelectedPresetQuestions([]);
    setSelectedPresetEmails([]);
  };

  const handleUpload = () => {
    setErrorMessage("");
    if (!selectedFiles.length || (!selectedPresetEmails.length) || (!questions && !selectedPresetQuestions.length)) {
      setErrorMessage("Please provide emails, at least one question, and select at least one file.");
      return;
    }
    setShowConfirmation(true);
  };

  const confirmUpload = async () => {
    setShowConfirmation(false);
    try {
      setUploadStatus("uploading");
      console.log("Starting upload");

      const uniqueId = Date.now();
      const uploadPromises = selectedFiles.map(file => {
        return new Promise((resolve, reject) => {
          const storageRef = ref(storage, `${userEmail}/uploads/${uniqueId}/${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setProgress(prevProgress => ({
                ...prevProgress,
                [file.name]: progressPercent
              }));
              console.log(`Upload is ${progressPercent}% done for ${file.name}`);
            },
            (error) => {
              console.error("Upload failed:", error);
              setUploadStatus("select");
              reject(error);
            },
            async () => {
              console.log(`Upload complete, file uploaded to Firebase Storage: ${file.name}`);
              setProgress(prevProgress => ({
                ...prevProgress,
                [file.name]: 100
              }));

              const userRef = doc(db, "users", userEmail);
              const submissionsRef = collection(userRef, "submissions");
              await setDoc(doc(submissionsRef, `${uniqueId}`), {
                fileName: file.name,
                questions: questions,
                presetQuestions: selectedPresetQuestions,
                presetEmails: selectedPresetEmails,
                timestamp: uniqueId
              });

              resolve();
            }
          );
        });
      });

      await Promise.all(uploadPromises);
      setUploadStatus("done");
      setSubmissionMessage("Thank you for your submission, we will get back to you in 24 hours.");
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("select");
    }
  };

  const handlePresetQuestionToggle = (question) => {
    setSelectedPresetQuestions(prevSelected => {
      let updatedSelected;
      if (prevSelected.includes(question)) {
        updatedSelected = prevSelected.filter(q => q !== question);
      } else {
        updatedSelected = [...prevSelected, question];
      }
      return updatedSelected;
    });
  };

  const handlePresetEmailToggle = (email) => {
    setSelectedPresetEmails(prevSelected => {
      let updatedSelected;
      if (prevSelected.includes(email)) {
        updatedSelected = prevSelected.filter(e => e !== email);
      } else {
        updatedSelected = [...prevSelected, email];
      }
      return updatedSelected;
    });
  };

  const handleTogglePresetQuestions = () => {
    if (!showPresetQuestions) {
      setSelectedPresetQuestions(presetQuestions);
    }
    setShowPresetQuestions(!showPresetQuestions);
  };

  const handleTogglePresetEmails = () => {
    if (!showPresetEmails) {
      setSelectedPresetEmails(presetEmails);
    }
    setShowPresetEmails(!showPresetEmails);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="file-upload-container">
      <div className="header">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="title-heading">SRR Falls Analysis Tool</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="scrollable-content">
        <input
          ref={inputRef}
          type="file"
          onChange={handleFileChange}
          multiple
          style={{ display: "none" }}
        />

        {!selectedFiles.length && (
          <button className="file-btn" onClick={onChooseFile}>
            <span className="material-symbols-outlined">upload</span> Upload Files
          </button>
        )}

        {selectedFiles.length > 0 && uploadStatus !== "done" && (
          <>
            {selectedFiles.map(file => (
              <div key={file.name} className="file-card">
                <span className="material-symbols-outlined icon">description</span>

                <div className="file-info">
                  <div style={{ flex: 1 }}>
                    <h6>{file.name}</h6>

                    <div className="progress-bg">
                      <div className="progress" style={{ width: `${progress[file.name] || 0}%` }} />
                    </div>
                  </div>

                  {uploadStatus === "select" ? (
                    <button onClick={() => setSelectedFiles(selectedFiles.filter(f => f.name !== file.name))}>
                      <span className="material-symbols-outlined close-icon">close</span>
                    </button>
                  ) : (
                    <div className="check-circle">
                      {uploadStatus === "uploading" ? (
                        `${progress[file.name] || 0}%`
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="input-group">
              <label htmlFor="emails">Send to:</label>
              <button className="preset-emails-btn" onClick={handleTogglePresetEmails}>
                Preset Emails
              </button>
              {showPresetEmails && (
                <div className="preset-emails-card">
                  <div className="preset-emails-list">
                    {presetEmails.map((email, index) => (
                      <div key={index} className="preset-email-item">
                        <input
                          type="checkbox"
                          checked={selectedPresetEmails.includes(email)}
                          onChange={() => handlePresetEmailToggle(email)}
                        />
                        <label>{email}</label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <input
                id="emails"
                type="text"
                value={selectedPresetEmails.join(", ")}
                readOnly
                placeholder="Select preset emails"
              />
            </div>

            <div className="input-group">
              <label htmlFor="questions">Questions:</label>
              <button className="preset-questions-btn" onClick={handleTogglePresetQuestions}>
                Preset Questions
              </button>
              {showPresetQuestions && (
                <div className="preset-questions-card">
                  <div className="preset-questions-list">
                    {presetQuestions.map((question, index) => (
                      <div key={index} className="preset-question-item">
                        <input
                          type="checkbox"
                          checked={selectedPresetQuestions.includes(question)}
                          onChange={() => handlePresetQuestionToggle(question)}
                        />
                        <label>{question}</label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <textarea
                id="questions"
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
                placeholder="Any additional questions?"
                required
              />
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <button className="upload-btn" onClick={handleUpload}>
              {uploadStatus === "select" || uploadStatus === "uploading" ? "Submit" : "Done"}
            </button>
          </>
        )}

        {showConfirmation && (
          <div className="confirmation-popup">
            <div className="confirmation-content">
              <p>Please confirm the email addresses: <strong>{selectedPresetEmails.join(", ")}</strong></p>
              <button className="confirm-btn" onClick={confirmUpload}>Confirm</button>
              <button className="edit-btn" onClick={() => setShowConfirmation(false)}>Edit</button>
            </div>
          </div>
        )}

        {uploadStatus === "done" && (
          <div className="submission-message">
            <p>{submissionMessage}</p>
            <button className="return-btn" onClick={clearFileInput}>Return to Main Screen</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
