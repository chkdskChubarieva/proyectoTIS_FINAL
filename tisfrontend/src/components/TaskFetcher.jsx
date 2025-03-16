import React, { useState } from "react";
import axios from "axios";

const TaskFetcher = () => {
  const [userStoryId, setUserStoryId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    setUserStoryId(event.target.value);
  };

  const fetchTasks = async () => {
    setError(null);
    setTasks([]);

    if (!userStoryId) {
      setError("Por favor, ingresa un ID de historia de usuario.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/user-story/${userStoryId}/tasks`,
      );
      console.log(response.data);
      if (response.data && Array.isArray(response.data.tareas)) {
        setTasks(response.data.tareas);
      } else {
        setError(
          "No se pudieron obtener las tareas. La estructura de la respuesta es incorrecta.",
        );
      }
    } catch (error) {
      setError(
        "No se pudo obtener las tareas para el ID de historia de usuario proporcionado.",
      );
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "500px",
        margin: "auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>Buscar Tareas por Historia de Usuario</h2>
      <input
        type="text"
        placeholder="Ingrese el ID de Historia de Usuario"
        value={userStoryId}
        onChange={handleInputChange}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          fontSize: "16px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      <button
        onClick={fetchTasks}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Buscar Tareas
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      <h3 style={{ marginTop: "20px" }}>Tareas:</h3>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li
              key={task.ID_tarea}
              style={{
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            >
              <strong>Task #{task.nro_tarea}</strong>
              <p>
                <strong>Contenido:</strong> {task.contenido_tarea}
              </p>
              <p>
                <strong>Estado:</strong> {task.estado}
              </p>
              <p>
                <strong>Estimación:</strong> {task.estimacion} horas
              </p>
            </li>
          ))
        ) : (
          <p>No hay tareas para mostrar</p>
        )}
      </ul>
    </div>
  );
};

export default TaskFetcher;
