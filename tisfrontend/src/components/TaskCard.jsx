import React, { useEffect, useState } from "react";
import "./TaskCard.css";
import axios from "axios";

const StatusIcon = {
  Backlog: { icon: "🔴", class: "icon-red" },
  Tasks: { icon: "🔴", class: "icon-green" },
  "In Process": { icon: "🟡", class: "icon-yellow" },
  Done: { icon: "🟢", class: "icon-blue" },
};

const AssigneeInfo = ({ nombre, puntos }) => (
  <div className="task-assignee">
    <div className="assignee-avatar">
      <span className="avatar-initial">
        {nombre ? nombre.charAt(0).toUpperCase() : "?"}
      </span>
    </div>
    <span className="assignee-name">{nombre || "Cargando..."}</span>
    <p className="assignee-time">{puntos} Puntos</p>
  </div>
);

export const TaskCard = ({ task, onDragStart }) => {
  const [nombre, setNombre] = useState("Cargando...");
  console.log("esta tarea pertenece a la tarea: ", task.nombre);

  useEffect(() => {
    const fetchEstudiante = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8000/api/v1/estudiante-info/${task.ID_estudiante}`,
        );
        console.log("ya casi", response.data.data.user.ID_usuario);
        setNombre(response.data.data.user.nombre || "Desconocido");
      } catch (error) {
        console.error(
          `Error al obtener el estudiante con ID ${task.ID_estudiante}:`,
          error,
        );
        setNombre("Desconocido");
      }
    };

    fetchEstudiante();
  }, [task.ID_estudiante]); // Asegúrate de que useEffect se ejecute cada vez que `task.ID_estudiante` cambie

  return (
    <div
      className="task-card"
      draggable
      onDragStart={(e) => onDragStart(e, task)}
    >
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <div className={`status-task ${StatusIcon[task.status]?.class}`}>
          {StatusIcon[task.status]?.icon || "❔"}
        </div>
      </div>
      {task.assignee && (
        <AssigneeInfo nombre={nombre} puntos={task.estimatedHours} />
      )}
    </div>
  );
};
