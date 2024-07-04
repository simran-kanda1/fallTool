import logo from './logo.svg';
import './App.css';
import FileUpload from './components/FileUpload/FileUpload';
import React, { useState } from "react";

const App = () => {
  return (
    <div className="container">
      <FileUpload />
    </div>
  );
}

export default App;
