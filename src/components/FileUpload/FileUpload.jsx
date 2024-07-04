import React, { useRef, useState } from "react";
import { ref, uploadBytesResumable } from "firebase/storage";
import { storage, db } from "../../firebase";  // Adjust the path according to your file structure
import { collection, doc, setDoc } from "firebase/firestore";
import './FileUpload.css';  // Make sure to create this CSS file and adjust the import path

const FileUpload = () => {
  const inputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [email, setEmail] = useState("");
  const [questions, setQuestions] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("select");
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  const clearFileInput = () => {
    inputRef.current.value = "";
    setSelectedFile(null);
    setEmail("");
    setQuestions("");
    setProgress(0);
    setUploadStatus("select");
    setSubmissionMessage("");
    setErrorMessage("");
    setShowConfirmation(false);
  };

  const handleUpload = () => {
    setErrorMessage("");  // Clear previous error message
    if (!selectedFile || !email || !questions) {
      setErrorMessage("Please provide an email address, and questions.");
      return;
    }
    setShowConfirmation(true);
  };

  const confirmUpload = async () => {
    setShowConfirmation(false);
    try {
      setUploadStatus("uploading");
      console.log("Starting upload");

      const uniqueId = Date.now();  // Create a unique folder for each submission
      const storageRef = ref(storage, `${email}/uploads/${uniqueId}/${selectedFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Upload failed:", error);
          setUploadStatus("select");
        },
        async () => {
          console.log("Upload complete, file uploaded to Firebase Storage");
          setProgress(100);

          // Save questions to Firestore
          const userRef = doc(db, `users/${email}`);
          const submissionsRef = collection(userRef, "submissions");
          await setDoc(doc(submissionsRef, `${uniqueId}`), {
            fileName: selectedFile.name,
            questions: questions,
            timestamp: uniqueId
          });

          setUploadStatus("done");
          setSubmissionMessage("Thank you for your submission, we will get back to you in 24 hours.");
        }
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("select");
    }
  };

  return (
    <div className="file-upload-container">
      <h1 className="title-heading">Fallyx Falls Analysis Tool</h1>
      <input
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {!selectedFile && (
        <button className="file-btn" onClick={onChooseFile}>
          <span className="material-symbols-outlined">upload</span> Upload File
        </button>
      )}

      {selectedFile && uploadStatus !== "done" && (
        <>
          <div className="file-card">
            <span className="material-symbols-outlined icon">description</span>

            <div className="file-info">
              <div style={{ flex: 1 }}>
                <h6>{selectedFile?.name}</h6>

                <div className="progress-bg">
                  <div className="progress" style={{ width: `${progress}%` }} />
                </div>
              </div>

              {uploadStatus === "select" ? (
                <button onClick={clearFileInput}>
                  <span className="material-symbols-outlined close-icon">close</span>
                </button>
              ) : (
                <div className="check-circle">
                  {uploadStatus === "uploading" ? (
                    `${progress}%`
                  ) : null}
                </div>
              )}
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="questions">Questions:</label>
            <textarea
              id="questions"
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
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
            <p>Please confirm your email address: <strong>{email}</strong></p>
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
  );
};

export default FileUpload;
