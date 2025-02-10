import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/createTask.css";

const CreateTask = ({ isOpen, onClose, refreshTasks }) => {
  const [task, setTask] = useState({
    dataAndHour: "",
    title: "",
    description: "",
    type: ""
  });
  const [taskTypes, setTaskTypes] = useState([]);

  useEffect(() => {
    const fetchTaskTypes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/taskstype");
        setTaskTypes(response.data);
        
        if (response.data.length > 0) {
          setTask(prevTask => ({ ...prevTask, type: response.data[0].ID }));
        }
      } catch (error) {
        console.error("Erro ao buscar tipos de tarefas:", error);
      }
    };

    if (isOpen) {
      fetchTaskTypes();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "";
    return new Date(dateTime).toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedTask = {
      dataAndHour: formatDateTime(task.dataAndHour),
      title: task.title,
      description: task.description,
      isFinished: false,
      type: task.type
    };

    try {
      await axios.post("http://localhost:5000/tasks", formattedTask);
      onClose();
      refreshTasks();
    } catch (error) {
      console.error("Erro ao criar a tarefa:", error);
      alert("Falha ao criar a tarefa.");
    }
  };

  return (
    <div className="overlay">
      <div className="create-task">
        <p>Creating a task</p>
        <form onSubmit={handleSubmit}>
          <label>Data e Hora:</label>
          <input
            type="datetime-local"
            name="dataAndHour"
            value={task.dataAndHour}
            onChange={handleChange}
            required
          />

          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleChange}
            required
          />

          <label>Type:</label>
          <select
            name="type"
            value={task.type}
            onChange={handleChange}
            required
          >
            {taskTypes.map((taskType) => (
              <option key={taskType.ID} value={taskType.ID}>
                {taskType.Description}
              </option>
            ))}
          </select>

          <label>Descrição:</label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            required
          />

          <div className="create-task-button">
            <button type="submit" className="save-button">
              Salvar
            </button>
            <button type="button" onClick={onClose} className="close-button">
              Fechar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;