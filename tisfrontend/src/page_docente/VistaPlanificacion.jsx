import { useEffect, useState } from "react";
import "../components/grupo-empresa/SprintPlanning.css";
import { TaskCard } from "../components/TaskCard";

import ModalTarea from "../components/ModalTarea";
import { useParams } from "react-router-dom";
import axios from "axios";

const VistaPlanificacion = () => {
  const { id } = useParams();
  const [showModal] = useState(false);
  const [selectedStory] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [userStories, setUserStories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSprintDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/sprints/${id}/details`,
        );
        if (response.data.success) {
          const sprintData = response.data.data;
          setUserStories(sprintData.historias_usuario || []);
          const fetchedTasks = sprintData.historias_usuario.flatMap((story) =>
            story.tareas.map((task) => ({
              ...task,
              historia_usuario: {
                titulo: story.titulo,
                prioridad: story.prioridad,
              },
            })),
          );
          setTasks(fetchedTasks);
        } else {
          setError("Failed to fetch sprint details.");
        }
      } catch (err) {
        console.error("Error fetching sprint data:", err);
        setError("Error fetching sprint data.");
      }
    };

    fetchSprintDetails();
  }, [id]);

  const TaskColumn = ({ status, storyTitle }) => {
    const tasksByStatus = tasks.filter(
      (task) =>
        task.historia_usuario.titulo === storyTitle && task.estado === status,
    );

    console.log("la task:", tasks);
    return (
      <div className="column">
        {tasksByStatus.map((task) => (
          <TaskCard
            key={task.ID_tarea}
            task={{
              title: task.contenido_tarea,
              status: task.estado,
              priority: task.historia_usuario.prioridad || "medium",
              assignee: task.estudiante
                ? task.estudiante.user.nombre
                : "No asignado",
              estimatedHours: task.estimacion,
              ID_estudiante: task.ID_estudiante,
            }}
            index={task.ID_tarea}
            onDragStart={(e) => e.dataTransfer.setData("taskId", task.ID_tarea)}
          />
        ))}
      </div>
    );
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="sprint-planning">
      <h2 className="titulos">Planificación de Sprint</h2>
      <div className="task-table">
        <div className="column product-backlog">
          <h3 className="titulo-task-user">Historias de usuario</h3>
        </div>
        <div className="column product-backlog">
          <h3 className="titulo-task-user">Tareas</h3>
        </div>
        <div className="column product-backlog">
          <h3 className="titulo-task-user">En proceso</h3>
        </div>
        <div className="column product-backlog">
          <h3 className="titulo-task-user">Completadas</h3>
        </div>
      </div>
      {userStories.map((story) => (
        <div key={story.ID_historia} className="user-story-section">
          <div className="task-table">
            <div className="column product-backlog">
              <div
                className="user-story"
                onDragStart={(e) =>
                  e.dataTransfer.setData("userStoryId", story.ID_historia)
                }
              >
                <div>{story.titulo}</div>
              </div>
            </div>

            <TaskColumn status="Tasks" storyTitle={story.titulo} />
            <TaskColumn status="In Process" storyTitle={story.titulo} />
            <TaskColumn status="Done" storyTitle={story.titulo} />
          </div>
        </div>
      ))}
      <ModalTarea show={showModal} selectedStory={selectedStory} />
    </div>
  );
};

export default VistaPlanificacion;
