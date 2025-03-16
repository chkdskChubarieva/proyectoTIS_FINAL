import React, { useEffect, useState } from "react";
import "./SprintPlanning.css";
import { TaskCard } from "../TaskCard";
import ButtonStory from "../../assets/empresa/button-story.svg";
import ModalTarea from "../ModalTarea";
import { useParams } from "react-router-dom";
import axios from "axios";

const SprintPlanning = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
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

  const handleShowModal = (storyId) => {
    setSelectedStory(storyId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStory(null);
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:8000/api/v1/tareas/${taskId}/estado`,
        { estado: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log("Estado de la tarea actualizado en la base de datos");
    } catch (error) {
      console.error(
        "Error al actualizar el estado de la tarea en la base de datos:",
        error,
      );
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.ID_tarea === taskId ? { ...task, estado: newStatus } : task,
      ),
    );
    updateTaskStatus(taskId, newStatus);
  };

  const TaskColumn = ({ status, storyTitle }) => {
    const tasksByStatus = tasks.filter(
      (task) =>
        task.historia_usuario.titulo === storyTitle && task.estado === status,
    );

    console.log("la task:", tasks);
    return (
      <div
        className="column"
        onDrop={(e) => handleDrop(e, status)}
        onDragOver={(e) => e.preventDefault()}
      >
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
            onStatusChange={(newStatus) =>
              handleStatusChange(task.ID_tarea, newStatus)
            }
          />
        ))}
      </div>
    );
  };

  const handleDrop = (e, newStatus) => {
    const taskId = e.dataTransfer.getData("taskId");
    handleStatusChange(parseInt(taskId, 10), newStatus);
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
                <button
                  className="button-story"
                  onClick={() => handleShowModal(story.ID_historia)}
                >
                  <img src={ButtonStory} alt="Historia de usuario" />
                </button>
              </div>
            </div>

            <TaskColumn status="Tasks" storyTitle={story.titulo} />
            <TaskColumn status="In Process" storyTitle={story.titulo} />
            <TaskColumn status="Done" storyTitle={story.titulo} />
          </div>
        </div>
      ))}
      <ModalTarea
        show={showModal}
        onClose={handleCloseModal}
        selectedStory={selectedStory}
      />
    </div>
  );
};

export default SprintPlanning;
