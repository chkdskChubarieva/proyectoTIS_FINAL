/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import "../components/load.css"

const ModalInfoEvaluacion = ({
  showInfoModal,
  closeInfoModal,
  ID_fecha_entregable,
  ID_usuario,
}) => {
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [notaEstudiante, setNotaEstudiante] = useState(""); // Nota ingresada manualmente
  const [retroalimentacion, setRetroalimentacion] = useState(""); // Comentario del estudiante
  const [asistencia, setAsistencia] = useState(""); // Estado de asistencia

  useEffect(() => {
    if (showInfoModal && ID_usuario) {
      setLoading(true); // Activar estado de carga
      mostrarNota(ID_fecha_entregable, ID_usuario);
    }
  }, [showInfoModal, ID_fecha_entregable, ID_usuario]);

  const mostrarNota = async (fechaID, usuarioID) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/grupo-empresa/${fechaID}/${usuarioID}/mostrarNota`,
      );
      console.log("Datos obtenidos:", response.data); // Verificar respuesta
      if (response.data) {
        const data = response.data[0];
        setNotaEstudiante(data.nota_estudiante || "");
        setRetroalimentacion(data.retroalimentacion || "");
        setAsistencia(getAsistenciaKey(data));
        console.log("nota", notaEstudiante);
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    } finally {
      setLoading(false); // Desactivar estado de carga
    }
  };

  const getAsistenciaKey = (data) => {
    if (data.asistencias > 0) return "puntual";
    if (data.retrasos > 0) return "tarde";
    if (data.ausencias_justificadas > 0) return "falta-justificada";
    if (data.ausencias_injustificadas > 0) return "falta-injustificada";
    return "";
  };

  // Mostrar un mensaje de carga si los datos aún no se han obtenido
  if (loading) {
    return ReactDOM.createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        {/* <div className="p-5 text-white bg-gray-800 rounded">
          Cargando datos...
        </div> */}
        <div className="loader"></div>
      </div>,
      document.getElementById("modal-root"),
    );
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <section className="min-w-[36rem] rounded-md bg-neutral-200 px-8 py-5 shadow">
        <h2 className="flex justify-center mb-4 text-2xl font-semibold text-primary-800">
          Información de evaluación
        </h2>
        <section className="flex gap-5">
          <div className="w-64">
            <span className="text-lg font-semibold text-primary-800">
              Nota:
            </span>
            <div className="w-full p-2 my-2 text-gray-800 bg-white border rounded-md border-neutral-400">
              {notaEstudiante || "No se asignó nota"}
            </div>
          </div>
          <div className="w-full">
            <span className="text-lg font-semibold text-primary-800">
              Control de asistencia:
            </span>
            <div className="w-full p-2 my-2 text-gray-800 bg-white border rounded-md border-neutral-400">
              {asistencia === "puntual" && "Llegó puntual"}
              {asistencia === "tarde" && "Llegó tarde"}
              {asistencia === "falta-justificada" && "Falta justificada"}
              {asistencia === "falta-injustificada" && "Falta injustificada"}
              {!asistencia && "No hay información sobre asistencia"}
            </div>
          </div>
        </section>
        <div>
          <span className="text-lg font-semibold text-primary-800">
            Comentarios:
          </span>
          <div className="w-full h-32 p-2 my-2 overflow-y-auto text-gray-800 bg-white border rounded-md border-neutral-400">
            {retroalimentacion || "No se proporcionaron comentarios"}
          </div>
        </div>

        <section className="mt-5 flex gap-4 *:w-full *:rounded *:py-2 *:font-semibold">
          <button
            onClick={closeInfoModal}
            className="text-white bg-primary-500"
          >
            Cerrar
          </button>
        </section>
      </section>
    </div>,
    document.getElementById("modal-root"),
  );
};

export default ModalInfoEvaluacion;
