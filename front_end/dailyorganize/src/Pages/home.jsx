import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/home.css";
import EditTask from "../Components/editTask"; // Importando o modal

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null); // Estado para armazenar a tarefa selecionada

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/tasks");
        setUsers(response.data);
      } catch (err) {
        setError("Erro ao carregar os dados da API");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Daily Tasks</h1>
      <p>Organize your tasks in a simple way with daily organize.</p>
      <div className="container-add-task">
        <button className="button-add-task" onClick={() => alert("Você clicou no botão!")}>
          Add Task
        </button>
      </div>

      <div className="container">
        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          users.map((task) => (
            <div key={task.ID} className="task-card">
              <h2 className="task-title">
                {task.Title.length > 20 ? `${task.Title.substring(0, 600)}...` : task.Title}
              </h2>
              <button
                className="button-edit"
                onClick={() => {
                  setSelectedTask(task);
                  setIsEditTaskOpen(true);
                }}
              >
                Edit the task
              </button>
            </div>
          ))
        )}
      </div>
      <EditTask isOpen={isEditTaskOpen} onClose={() => setIsEditTaskOpen(false)} task={selectedTask} />
    </div>
  );
};

export default Home;
