import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPencilAlt } from "react-icons/fa";
import "../Styles/taskType.css";

const TaskTypeModal = ({ isOpen, onClose }) => {
  const [taskTypes, setTaskTypes] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
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

  const handleCreateTaskType = async () => {
    if (!newTaskDescription.trim()) return;
    try {
      await axios.post("http://localhost:5000/taskstype", {
        Description: newTaskDescription.trim(),
      });
      setNewTaskDescription("");
      setIsCreating(false);
      fetchTaskTypes();
    } catch (error) {
      console.error("Erro ao criar task type", error);
    }
  };

  const handleEditTaskType = async () => {
    if (!editingTask?.Description.trim()) return;
    try {
      await axios.put(`http://localhost:5000/taskstype/${editingTask.ID}`, {
        Description: editingTask.Description.trim(),
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
        <div className="types-menu">
          <h2>Task Types</h2>
          <button className="create-button-task-type" onClick={() => setIsCreating(true)}>
            +
          </button>
        </div>
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
        <button className="close-button" onClick={onClose}>Close</button>
      </div>

      {(editingTask || isCreating) && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2>{isCreating ? "Creating New Task Type" : "Editing Task Type"}</h2>
            <input
              type="text"
              value={isCreating ? newTaskDescription : editingTask.Description}
              onChange={(e) => {
                if (isCreating) {
                  setNewTaskDescription(e.target.value);
                } else {
                  setEditingTask({ ...editingTask, Description: e.target.value });
                }
              }}
            />
            <div className="modal-actions">
              <button onClick={isCreating ? handleCreateTaskType : handleEditTaskType} className="save-type-button">
                Save
              </button>
              <button onClick={() => { isCreating ? setIsCreating(false) : setEditingTask(null); }} className="cancel-type-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTypeModal;