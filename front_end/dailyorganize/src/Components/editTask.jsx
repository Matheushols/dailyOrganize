import React from "react";
import axios from "axios";
import "../Styles/editTask.css";

const EditTask = ({ isOpen, onClose, task, refreshTasks }) => {
  if (!isOpen || !task) return null;

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${task.ID}`);
      onClose();
      refreshTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete the task.");
    }
  };

  return (
    <div className="overlay">
      <div className="edit-task">
        <p>Editing the task: {task.Title}</p>
        <div className="editing-task-button">
          <button onClick={onClose} className="save-button">Save</button>
          <button onClick={handleDelete} className="delete-button">Delete</button>
          <button onClick={onClose} className="close-button">Close</button>
        </div>
      </div>
    </div>
  );
};

export default EditTask;