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
      setType(task.Type || ""); // Garante que o tipo seja carregado corretamente
    }
  }, [task]);

  useEffect(() => {
    const fetchTaskTypes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/taskstype");
        setTaskTypes(response.data);
      } catch (error) {
        console.error("Erro ao buscar tipos de tarefas:", error);
      }
    };

    if (isOpen) {
      fetchTaskTypes();
    }
  }, [isOpen]);

  if (!isOpen || !task) return null;

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/tasks/${task.ID}`, {
        id: task.ID,
        title,
        description,
        dataAndHour: task.DataAndHour,
        isFinished: task.IsFinished,
        type,
      });
      onClose();
      refreshTasks();
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      alert("Falha ao atualizar a tarefa.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${task.ID}`);
      onClose();
      refreshTasks();
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      alert("Falha ao excluir a tarefa.");
    }
  };

  return (
    <div className="overlay">
      <div className="edit-task">
        <h3>Editando a tarefa: {task.Title}</h3>

        <h4>Tipo</h4>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="task-select"
        >
          {taskTypes.map((taskType) => (
            <option key={taskType.ID} value={taskType.Description}>
              {taskType.Description}
            </option>
          ))}
        </select>

        <h4>Descrição</h4>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={task.isFinished}
          placeholder="Descrição da tarefa"
        ></textarea>

        <div className="editing-task-button">
          <button onClick={handleSave} className="save-button" disabled={task.isFinished}>
            Salvar
          </button>
          <button onClick={handleDelete} className="delete-button">Excluir</button>
          <button onClick={onClose} className="close-button">Fechar</button>
        </div>
      </div>
    </div>
  );
};

export default EditTask;