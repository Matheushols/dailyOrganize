import React, { useEffect, useState } from "react";
import axios from 'axios';

const Home = () => {
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
            <div style= {{display: "flex",  justifyContent: 'center', alignItems: 'center',gap: '30px'}}>
            <h1>Teste</h1>
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
                onClick={() => alert("Você clicou no botão!")}
            >
                Edit the task
            </button>
        </div>
        </div>
    );
};

export default Home;