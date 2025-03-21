/* eslint-disable react/prop-types */
import ReactDOM from "react-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const ModalRespCruzada = ({ showModal, closeModal, nombreEvaluacion, descripcionEvaluacion, notaEvaluacion }) => {
  const userData = JSON.parse(sessionStorage.getItem("user"));
  const userID = userData ? userData.ID_usuario : null;

  const [grupoEmpresas, setGrupoEmpresas] = useState([]); // Estado para las grupo empresas
  const [notas, setNotas] = useState({}); // Estado para almacenar notas

  useEffect(() => {
    console.log("userID:", userID);

    if (userID) {
      getGrupoEmpresas(userID);
    }
  }, [userID]);

  const getGrupoEmpresas = async (userID) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/estudiante/${userID}/getEmpresas`
      );
      if (response && response.data) {
        setGrupoEmpresas(response.data); // Asignamos los datos que vienen del backend
        console.log("GrupoEmpresas encontradas:", response.data);
      }
    } catch (error) {
      console.error("Error al obtener las grupo empresas:", error);
    }
  };


  const handleInputChange = (e, empresaID) => {
    const { value } = e.target;
    setNotas((prevNotas) => ({
      ...prevNotas,
      [empresaID]: parseFloat(value) || 0, // Convertir a número o usar 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const notasEmpresas = grupoEmpresas.map((empresa) => ({
      ID_empresa: empresa.ID_empresa,
      nota: notas[empresa.ID_empresa] || 0, // Usar 0 si no hay calificación
      nombre_entregable: nombreEvaluacion,
    }));

    const payload = {
      ID_usuario: userID,
      notasEmpresas,
    };
    
    console.log("Payload",payload)
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/evaluacionCruzada/guardarNotasCruzada",
        payload
      );
      if (response.data) {
        alert("Las notas se han registrado exitosamente.");
        closeModal();
        location.reload();
      } else {
        alert("Error al registrar las notas: " + response.data.message);
      }
    } catch (error) {
      console.error("Error al registrar las notas:", error);
      alert("Error al registrar las notas.");
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

        {grupoEmpresas.map((empresa) => (
          <div key={empresa.ID_empresa} className="my-3">
            <label className="text-lg font-semibold text-primary-800">
              Nota para {empresa.nombre_empresa}
            </label>
            <br />
            <input
              type="number"
              value={notas[empresa.ID_empresa] || ""}
              max={notaEvaluacion}
              min="0"
              className="w-full p-2 my-2 text-gray-800 border rounded-md border-neutral-400"
              placeholder={`Califica entre 0 y ${notaEvaluacion} puntos`}
              onChange={(e) => handleInputChange(e, empresa.ID_empresa)} // Actualizar estado
              required
            />
          </div>
        ))}

        <section className="flex gap-4 mt-5">
          <button type="submit" className="px-4 py-2 text-white rounded-md bg-primary-500">
            Enviar
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 text-gray-600 border rounded-md border-neutral-400 bg-neutral-100"
          >
            Cancelar
          </button>
        </section>
      </form>
    </div>,
    document.getElementById("modal-root")
  );
};

export default ModalRespCruzada;
