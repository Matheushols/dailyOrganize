import React from "react";
import "../Styles/editTask.css";

const EditTask = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className="edit-task">
        <p>Editing the task</p>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    </div>
  );
};

export default EditTask;
