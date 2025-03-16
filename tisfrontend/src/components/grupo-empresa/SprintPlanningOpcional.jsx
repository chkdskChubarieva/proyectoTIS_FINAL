import React, { useEffect, useState } from "react";
import "./SprintPlanning.css";
import { TaskCard } from "../TaskCard";
import ButtonStory from "../../assets/empresa/button-story.svg";
import ModalTarea from "../ModalTarea";
import { useParams } from "react-router-dom";
import axios from "axios";

// Componente para manejar cada columna de estado de las tareas
const TaskColumn = ({
  title,
  status,
  tasks,
  onDrop,
  onDragOver,
  onStatusChange,
}) => (
  <div className="column" onDrop={onDrop} onDragOver={onDragOver}>
    <h3 className="titulo-task-user">{title}</h3>
    {tasks.map((task) => (
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
        }}
        onDragStart={(e) => e.dataTransfer.setData("taskId", task.ID_tarea)}
        onStatusChange={(newStatus) => onStatusChange(task.ID_tarea, newStatus)}
      />
    ))}
  </div>
);

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
        { headers: { Authorization: `Bearer ${token}` } },
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
    const updatedTasks = tasks.map((task) =>
      task.ID_tarea === taskId ? { ...task, estado: newStatus } : task,
    );
    setTasks(updatedTasks);
    updateTaskStatus(taskId, newStatus);
  };

  const handleDrop = (e, newStatus) => {
    const taskId = parseInt(e.dataTransfer.getData("taskId"), 10);
    handleStatusChange(taskId, newStatus);
  };

  const renderTasksByStatusForStory = (storyTitle, status) => {
    return tasks.filter(
      (task) =>
        task.historia_usuario.titulo === storyTitle && task.estado === status,
    );
  };

  if (error) return <p>{error}</p>;

  return (
    <div className="sprint-planning">
      <h2 className="titulos">Planificación de Sprint</h2>
      {userStories.map((story) => (
        <div key={story.ID_historia} className="user-story-section">
          <div className="user-story">
            <div>{story.titulo}</div>
            <button
              className="button-story"
              onClick={() => handleShowModal(story.ID_historia)}
            >
              <img src={ButtonStory} alt="Historia de usuario" />
            </button>
          </div>
          <div className="task-table">
            <TaskColumn
              title="Tareas"
              status="Tasks"
              tasks={renderTasksByStatusForStory(story.titulo, "Tasks")}
              onDrop={(e) => handleDrop(e, "Tasks")}
              onDragOver={(e) => e.preventDefault()}
              onStatusChange={handleStatusChange}
            />
            <TaskColumn
              title="En proceso"
              status="In Process"
              tasks={renderTasksByStatusForStory(story.titulo, "In Process")}
              onDrop={(e) => handleDrop(e, "In Process")}
              onDragOver={(e) => e.preventDefault()}
              onStatusChange={handleStatusChange}
            />
            <TaskColumn
              title="Completadas"
              status="Done"
              tasks={renderTasksByStatusForStory(story.titulo, "Done")}
              onDrop={(e) => handleDrop(e, "Done")}
              onDragOver={(e) => e.preventDefault()}
              onStatusChange={handleStatusChange}
            />
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
