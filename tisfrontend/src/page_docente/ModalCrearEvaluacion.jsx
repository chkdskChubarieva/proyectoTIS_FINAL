/* eslint-disable react/prop-types */
import ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ModalCrearEvaluacion = ({ showModal, closeModal, children }) => {
  const [tiposDisponibles, setTiposDisponibles] = useState([
    "Auto Evaluacion",
    "Evaluacion Pares",
    "Evaluacion Cruzada",
  ]);
  const userData = JSON.parse(sessionStorage.getItem("user"));
  const userID = userData ? userData.ID_usuario : null;

  useEffect(() => {
    const verificarTiposExistentes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/docente/evaluaciones",
        );
        const evaluacionesExistentes = response.data.map(
          (e) => e.nombre_entregable,
        );

        // Filtrar los tipos de evaluación disponibles
        const tiposFiltrados = tiposDisponibles.filter(
          (tipo) => !evaluacionesExistentes.includes(tipo),
        );
        setTiposDisponibles(tiposFiltrados);
      } catch (error) {
        console.error(
          "Error al verificar los tipos de evaluación existentes:",
          error,
        );
      }
    };

    verificarTiposExistentes();
  }, [tiposDisponibles]);

  const guardarEntregable = async (id) => {
    const tipoEvaluacion = document.getElementById("tipo-evaluacion").value;
    const fecha = document.getElementById("fecha").value;
    const descripcion = document.getElementById("descripcion").value;
    const puntos = parseFloat(document.getElementById("puntos").value);

    const payload = {
      ID_usuario: id,
      nombre_entregable: tipoEvaluacion,
      fechas: fecha,
      rubricas: {
        titulo: tipoEvaluacion,
        descripcion: descripcion,
        niveles: {
          puntos: puntos,
          tituloNivel: tipoEvaluacion,
          descripcionNivel: descripcion,
        },
      },
    };

    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/grupo-empresa/guardar-autoevaluacion`,
        payload,
      );
      console.log("Entregable creado:", response.data);
      alert("Entregable creado con éxito");
      closeModal(); // Cierra el modal tras guardar
      location.reload();
    } catch (error) {
      console.error(
        "Error al crear el entregable:",
        error.response?.data || error.message,
      );
      alert("Hubo un error al crear el entregable");
    }
  };

  if (!showModal) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      {children}
      {tiposDisponibles.length > 0 ? (
        <form className="px-8 py-5 rounded-md shadow bg-neutral-200">
          <span className="flex justify-center mb-4 text-2xl font-semibold text-primary-800">
            Crear evaluación
          </span>
          <div>
            <label
              htmlFor="tipo-evaluacion"
              className="text-lg font-semibold text-primary-800"
            >
              Tipo de evaluación
            </label>
            <select
              id="tipo-evaluacion"
              className="w-full p-2 my-2 text-gray-800 border rounded-md border-neutral-400"
            >
              <option value="" disabled selected>
                Selecciona un tipo
              </option>
              {tiposDisponibles.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>
          <section className="flex gap-5">
            <div className="w-1/2">
              <label
                htmlFor="puntos"
                className="text-lg font-semibold text-primary-800"
              >
                Puntos
              </label>
              <br />
              <input
                type="number"
                id="puntos"
                className="w-full p-2 my-2 text-gray-800 border rounded-md border-neutral-400"
                placeholder="Límite de puntos"
              />
            </div>

            <div className="w-1/2">
              <label
                htmlFor="fecha"
                className="text-lg font-semibold text-primary-800"
              >
                Fecha de evaluación
              </label>
              <br />
              <input
                type="date"
                id="fecha"
                className="w-full p-2 my-2 text-gray-800 border rounded-md border-neutral-400"
              />
            </div>
          </section>

          <section>
            <label
              htmlFor="descripcion"
              className="text-lg font-semibold text-primary-800"
            >
              Descripción
            </label>
            <br />
            <textarea
              id="descripcion"
              className="w-full p-2 my-2 text-gray-800 border rounded-md resize-none h-28 border-neutral-400"
              placeholder="Agrega una descripción"
              maxLength={240}
            />
          </section>

          <section className="mt-5 flex gap-4 *:w-1/2 *:rounded *:py-2 *:font-semibold">
            <button
              type="button"
              className="text-white transition-colors bg-primary-500 hover:bg-primary-500/95"
              onClick={(e) => {
                e.preventDefault();
                guardarEntregable(userID);
              }}
            >
              Crear evaluación
            </button>
            <button
              type="button"
              className="text-gray-600 transition-colors border border-neutral-400 bg-neutral-100 hover:bg-neutral-200"
              onClick={closeModal}
            >
              Cancelar
            </button>
          </section>
        </form>
      ) : (
        <div className="flex flex-col h-40 px-8 pb-5 rounded-md shadow bg-neutral-200">
          <h2 className="flex items-center justify-center flex-1 text-2xl font-semibold text-neutral-600">
            Ya se han creado todas las evaluaciones
          </h2>
          <button
            type="button"
            className="w-full py-2 font-semibold text-white transition-colors rounded bg-primary-500 hover:bg-primary-500/95"
            onClick={closeModal}
          >
            Aceptar
          </button>
        </div>
      )}
    </div>,
    document.getElementById("modal-root"),
  );
};

export default ModalCrearEvaluacion;
