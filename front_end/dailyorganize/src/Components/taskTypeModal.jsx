import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPencilAlt, FaTimes } from "react-icons/fa";
import "../Styles/taskType.css";
import { FaTrashAlt } from "react-icons/fa";


const TaskTypeModal = ({ isOpen, onClose }) => {
  const [taskTypes, setTaskTypes] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTaskTypes();
    }
  }, [isOpen]);

  const fetchTaskTypes = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/taskstype");
      console.log("Dados da API:", response.data);
      setTaskTypes(response.data);
    } catch (error) {
      console.error("Erro ao buscar task types", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTaskType = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este tipo de tarefa?")) return;
    try {
      await axios.delete(`http://localhost:5000/taskstype/${id}`);
      fetchTaskTypes();
    } catch (error) {
      console.error("Erro ao deletar task type", error);
    }
  };

  const handleEditTaskType = async () => {
    if (!editingTask?.description.trim()) return;
    try {
      await axios.put(`http://localhost:5000/taskstype/${editingTask.ID}`, {
        description: editingTask.description.trim(),
      });
      setEditingTask(null);
      fetchTaskTypes();
    } catch (error) {
      console.error("Erro ao editar task type", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Task Types</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="task-list">
            {taskTypes.map((task, index) => (
              <li key={task.ID || index} className="task-item">
                <span>{task.Description || "Sem descrição"}</span>
                <div className="task-actions">
                  <button className="edit-button" onClick={() => setEditingTask(task)}>
                    <FaPencilAlt />
                  </button>
                  <button className="delete-button-task-type" onClick={() => handleDeleteTaskType(task.ID)}>
                  x
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <button className="close-button" onClick={onClose}>Fechar</button>
      </div>

      {editingTask && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2>Editar Tipo de Tarefa</h2>
            <input
              type="text"
              value={editingTask.Description}
              onChange={(e) => setEditingTask({ ...editingTask, Description: e.target.value })}
            />
            <div className="modal-actions">
              <button onClick={handleEditTaskType} className="save-button">Salvar</button>
              <button onClick={() => setEditingTask(null)} className="cancel-button">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTypeModal;