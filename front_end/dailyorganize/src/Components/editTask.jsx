import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/editTask.css";

const EditTask = ({ isOpen, onClose, task, refreshTasks }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [taskTypes, setTaskTypes] = useState([]);

  useEffect(() => {
    if (task && !task.isFinished) {
      setTitle(task.Title || "");
      setDescription(task.Description || "");
      setType(task.type || ""); // Define o tipo inicial da task
    }
  }, [task]);

  useEffect(() => {
    const fetchTaskTypes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/taskstype");
        setTaskTypes(response.data);

        // Define o tipo da tarefa ao carregar os tipos disponíveis
        if (task?.type) {
          setType(task.type);
        } else if (response.data.length > 0) {
          setType(response.data[0].ID); // Define o primeiro tipo caso a task não tenha um tipo
        }
      } catch (error) {
        console.error("Erro ao buscar tipos de tarefas:", error);
      }
    };

    if (isOpen) {
      fetchTaskTypes();
    }
  }, [isOpen, task]);

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

        <h4>Type</h4>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="task-select"
        >
          {taskTypes.map((taskType) => (
            <option key={taskType.ID} value={taskType.ID}>
              {taskType.Description}
            </option>
          ))}
        </select>

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