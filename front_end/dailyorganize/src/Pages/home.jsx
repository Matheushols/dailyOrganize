import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/home.css";
import EditTask from "../Components/editTask";
import CreateTask from "../Components/createTask";
import TaskTypesModal from "../Components/taskTypeModal";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [isCreatingTaskOpen, setIsCreatingTaskOpen] = useState(false);
  const [isTaskTypesOpen, setIsTaskTypesOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/tasks");
      setUsers(response.data);
    } catch (err) {
      setError("Erro ao carregar os dados da API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Daily Tasks</h1>
      <p>Organize your tasks in a simple way with daily organize.</p>
      <div className="container-add-task">
        <button className="button-add-task" onClick={() => setIsCreatingTaskOpen(true)}>
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
                {task.Title.length > 20 ? `${task.Title.substring(0, 700)}` : task.Title}
              </h2>
              <div className="grouped-type-edit">
                <h3 className="task-type" onClick={() => setIsTaskTypesOpen(true)} style={{ cursor: "pointer" }}>
                  {`${task.Type}`}
                </h3>
              
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
            </div>
          ))
        )}
      </div>
      <EditTask isOpen={isEditTaskOpen} onClose={() => setIsEditTaskOpen(false)} task={selectedTask} refreshTasks={fetchUsers} />
      <CreateTask isOpen={isCreatingTaskOpen} onClose={() => setIsCreatingTaskOpen(false)} refreshTasks={fetchUsers} />
      <TaskTypesModal isOpen={isTaskTypesOpen} onClose={() => setIsTaskTypesOpen(false)} />
    </div>
  );
};

export default Home;