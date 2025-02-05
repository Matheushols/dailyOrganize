import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/taskType.css";

const TaskTypeModal = ({ isOpen, onClose }) => {
  const [taskTypes, setTaskTypes] = useState([]);
  const [newTaskType, setNewTaskType] = useState("");
  const [editing, setEditing] = useState(null);
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

  const handleAddTaskType = async () => {
    if (!newTaskType.trim()) return;
    try {
      const response = await axios.post(
        "http://localhost:5000/taskstype",
        { description: newTaskType.trim() },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 201) {
        setNewTaskType("");
        fetchTaskTypes();
      } else {
        console.error("Erro ao adicionar task type");
      }
    } catch (error) {
      console.error("Erro ao adicionar task type", error);
    }
  };

  const handleEditTaskType = async (id) => {
    if (!editing || !editing.description.trim()) return;
    try {
      const response = await axios.put(
        `http://localhost:5000/taskstype/${id}`,
        { description: editing.description.trim() },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        setEditing(null);
        fetchTaskTypes();
      } else {
        console.error("Erro ao editar task type");
      }
    } catch (error) {
      console.error("Erro ao editar task type", error);
    }
  };

  const handleDeleteTaskType = async (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este tipo de tarefa?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`http://localhost:5000/taskstype/${id}`);
      if (response.status === 200) {
        fetchTaskTypes();
      } else {
        console.error("Erro ao deletar task type");
      }
    } catch (error) {
      console.error("Erro ao deletar task type", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Gerenciar Tipos de Tarefa</h2>

        <div className="task-type-input">
          <input
            type="text"
            placeholder="Novo tipo de tarefa"
            value={newTaskType}
            onChange={(e) => setNewTaskType(e.target.value)}
          />
          <button onClick={handleAddTaskType}>Adicionar</button>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {taskTypes.map((task) => (
                <tr key={task.id}>
                  <td>
                    {editing?.id === task.id ? (
                      <input
                        value={editing?.description || ""}
                        onChange={(e) =>
                          setEditing({ ...editing, description: e.target.value })
                        }
                      />
                    ) : (
                      task.description
                    )}
                  </td>
                  <td>
                    {editing?.id === task.id ? (
                      <>
                        <button onClick={() => handleEditTaskType(task.id)}>Salvar</button>
                        <button onClick={() => setEditing(null)}>Cancelar</button>
                      </>
                    ) : (
                      <button onClick={() => setEditing(task)}>Editar</button>
                    )}
                    <button onClick={() => handleDeleteTaskType(task.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button className="close-button" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
};

export default TaskTypeModal;