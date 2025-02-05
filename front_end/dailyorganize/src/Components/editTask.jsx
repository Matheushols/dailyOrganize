import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/editTask.css";

const EditTask = ({ isOpen, onClose, task, refreshTasks }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    if (task && !task.isFinished) {
      setTitle(task.Title || "");
      setDescription(task.Description || "");
      setType(task.type || "");
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/tasks/${task.ID}`, {
        title,
        description,
        dataAndHour: task.DataAndHour,
        isFinished: task.isFinished,
        type,
      });
      onClose();
      refreshTasks();
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update the task.");
    }
  };

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
        <h3>Editing the task: {task.Title}</h3>
        <input
          type="text"
          value={type || ""}
          onChange={(e) => setType(e.target.value)}
          placeholder="Enter task type"
        />
        <h4>Type</h4>
        <input
          type="text"
          defaultValue={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Enter task type"
        />
        <h4>Description</h4>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={task.isFinished}
          placeholder="Task description"
        ></textarea>
        <div className="editing-task-button">
          <button onClick={handleSave} className="save-button" disabled={task.isFinished}>
            Save
          </button>
          <button onClick={handleDelete} className="delete-button">Delete</button>
          <button onClick={onClose} className="close-button">Close</button>
        </div>
      </div>
    </div>
  );
};

export default EditTask;