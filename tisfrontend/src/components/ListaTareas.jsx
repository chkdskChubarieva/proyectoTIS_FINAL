import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ListaTareas.css";

const ListaTareas = () => {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/tareas");
        console.log("tareas", response.data);
        if (response.data.success) {
          setTareas(response.data.data);
        }
      } catch (err) {
        setError("Error al cargar las tareas");
      } finally {
        setLoading(false);
      }
    };

    fetchTareas();
  }, []);

  if (loading) return <p>Cargando tareas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="lista-tareas">
      <h2>Lista de Tareas</h2>
      <table>
        <thead>
          <tr>
            <th>Número de Tarea</th>
            <th>Estimación</th>
            <th>Estado</th>
            <th>Contenido de la Tarea</th>
            <th>Estudiante</th>
            <th>Historia</th>
          </tr>
        </thead>
        <tbody>
          {tareas.map((tarea) => (
            <tr key={tarea.ID_tarea}>
              <td>{tarea.nro_tarea}</td>
              <td>{tarea.estimacion}</td>
              <td>{tarea.estado}</td>
              <td>{tarea.contenido_tarea}</td>
              <td>{tarea.estudiante.nombre}</td>
              <td>{tarea.historia.titulo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaTareas;
