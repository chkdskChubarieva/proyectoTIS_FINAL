import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ModalTarea.css";

const ModalTarea = ({ show, onClose, selectedStory }) => {
  const [tareaData, setTareaData] = useState({
    nro_tarea: "1",
    estimacion: "",
    estado: "Tasks",
    contenido_tarea: "",
    ID_estudiante: "",
    ID_historia: "",
  });
  const [estudiantes, setEstudiantes] = useState([]);

  useEffect(() => {
    if (selectedStory) {
      setTareaData((prevData) => ({
        ...prevData,
        ID_historia: selectedStory,
      }));
    }

    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    const fetchEstudiantes = async () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem("user"));

        const idstudend = userData.roles[0].id;
        const responsePD = await axios.get(
          `http://localhost:8000/api/v1/obtener-productbacklog/${idstudend}`,
        );

        const response = await axios.get(
          `http://localhost:8000/api/v1/product-backlogs/${responsePD.data.ID_pb}/estudiantes`,
        );
        setEstudiantes(response.data);
      } catch (error) {
        console.error("Error al obtener estudiantes:", error);
      }
    };

    fetchEstudiantes();

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show, selectedStory]);

  const handleChange = (e) => {
    setTareaData({ ...tareaData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8000/api/v1/tarea",
        tareaData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.success) {
        window.location.reload();
        onClose();
      }
    } catch (error) {
      console.error("Error al registrar la tarea:", error);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Nueva Tarea</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre de la tarea:</label>
            <input
              type="text"
              name="contenido_tarea"
              value={tareaData.contenido_tarea}
              placeholder="Breve descripción de la tarea"
              onChange={handleChange}
              required
            />
          </div>
          <div className="container-user-task">
            <div className="button-estudent">
              <label>Estudiante:</label>
              <select
                name="ID_estudiante"
                value={tareaData.ID_estudiante}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un estudiante</option>
                {estudiantes.map((estudiante) => (
                  <option
                    key={estudiante.ID_estudiante}
                    value={estudiante.ID_estudiante}
                  >
                    {estudiante.users.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Estimación:</label>
              <select
                name="estimacion"
                value={tareaData.estimacion}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione estimación</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="8">8</option>
                <option value="13">13</option>
                <option value="20">20</option>
                <option value="40">40</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
          <section className="container-button-tarea">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </section>
        </form>
      </div>
    </div>
  );
};

export default ModalTarea;
