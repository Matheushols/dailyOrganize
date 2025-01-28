import React, { useEffect, useState } from "react";
import axios from 'axios';
import "../Styles/home.css";

const Home = () => {

  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tasks');
        console.log(response)
        setUsers(response.data);
      } catch (err) {
        setError('Erro ao carregar os dados da API');
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
      <button 
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#6200ea",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={() => alert("Você clicou no botão!")}
      >
        Add Task
      </button>

      <div className="container">
        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          users.map((task) => (
            <div key={task.ID} className="task-card">
              <h2 className="task-title">
                {task.Title.length > 20 ? `${task.Title.substring(0, 20)}...` : task.Title}
              </h2>
              <button
                style={{
                  padding: "3px 10px",
                  fontSize: "15px",
                  backgroundColor: "#6200ea",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
                onClick={() => alert(`Editando a tarefa: ${task.Title}`)}
              >
                Edit the task
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
