/* eslint-disable react/prop-types */
import ReactDOM from "react-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const ModalRespAutoEvaluacion = ({ showModal, closeModal, nombreEvaluacion, descripcionEvaluacion,notaEvaluacion }) => {
  const userData = JSON.parse(sessionStorage.getItem("user"));
  const userID = userData ? userData.ID_usuario : null;

  // Variables de estado
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [nota, setNota] = useState("");
  

  useEffect(() => {
    if (userID) {
      getDatosUsuario(userID);
    }
  }, [userID, nombreEvaluacion]);

  const getDatosUsuario = async (userID) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/estudiante/${userID}/getDatosEstudiante`
      );
      if (response.data.success) {
        const { nombre, apellido } = response.data.data;
        setNombre(nombre);
        setApellido(apellido);
      }
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nota_estudiante: nota,
      nombre_entregable: nombreEvaluacion,
      ID_usuario: userID,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/autoEvaluacion/asignarNota",
        payload
      );
      if (response.data.success) {
        alert("La nota se ha registrado exitosamente.");
        closeModal();
        location.reload();
      } else {
        alert("Error al registrar la nota: " + response.data.message);
      }
    } catch (error) {
      console.error("Error al registrar la nota:", error);
      alert("Error al registrar la nota.");
    }
  };

  if (!showModal) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <form
        className="modal-evaluacion mx-5 min-w-[540px] max-w-4xl rounded-md bg-neutral-200 px-8 py-5 shadow"
        onSubmit={handleSubmit}
      >
        <span className="flex justify-center text-2xl font-semibold text-primary-800">
          {nombreEvaluacion}
        </span>

        <p className="my-4 text-pretty">{descripcionEvaluacion}</p>

        <div>
          <label
            htmlFor="nota-1"
            className="text-lg font-semibold text-primary-800"
          >
            Nota para {nombre} {apellido}
          </label>
          <br />
          <input
            type="number"
            id="nota-1"
            value={nota}
            max={notaEvaluacion}
            onChange={(e) => setNota(e.target.value)}
            className="w-full p-2 my-2 text-gray-800 border rounded-md border-neutral-400"
            placeholder={`Califica entre 0 y ${notaEvaluacion} puntos`}
            required
          />
        </div>

        <section className="mt-5 flex gap-4 *:w-1/2 *:rounded *:py-2 *:font-semibold">
          <button type="submit" className="text-white bg-primary-500">
            Enviar
          </button>

          <button
            type="button"
            onClick={closeModal}
            className="text-gray-600 border border-neutral-400 bg-neutral-100"
          >
            Cancelar
          </button>
        </section>
      </form>
    </div>,
    document.getElementById("modal-root")
  );
};

export default ModalRespAutoEvaluacion;
