import ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// eslint-disable-next-line react/prop-types
const ModalRetro = ({ showRetroModal, closeRetroModal, ID_fecha_entregable, retroalimentacionId }) => {
  const [formData, setFormData] = useState({
    queSeHizo: "",
    queQuedaPendiente: "",
  });


  const [idRetro, setIdRetro] = useState("");
  // Fetch de retroalimentación
  useEffect(() => {
    fetchRetroalimentacion(ID_fecha_entregable);
  }, [ID_fecha_entregable]);

  const fetchRetroalimentacion = async (ID_fecha_entregable) => {
    try {
      // Realizar la solicitud GET a la API
      const response = await axios.get(
        `http://localhost:8000/api/v1/grupo-empresa/${ID_fecha_entregable}/getRetroalimentacion`
      );

      // Asegurarse de que la respuesta contenga las retroalimentaciones
      if (response.data.retroalimentaciones && response.data.retroalimentaciones.length > 0) {
        const retroalimentacion = response.data.retroalimentaciones[0]; // Tomar el primer elemento si es un array
        
        // Guardar los valores de la retroalimentación en el estado
        setFormData({
          queSeHizo: retroalimentacion.se_hizo || "",
          queQuedaPendiente: retroalimentacion.pendiente || "",
        });

        setIdRetro(retroalimentacion.ID_retroalimentacion);
        // Mostrar los valores en la consola
        console.log("ID_retroalimentacion:", retroalimentacion.ID_retroalimentacion);
        console.log("se_hizo:", retroalimentacion.se_hizo);
        console.log("pendiente:", retroalimentacion.pendiente);
      } else {
        console.log("No se encontraron retroalimentaciones");
      }
    } catch (error) {
      console.error("Error al obtener las retroalimentaciones:", error);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Obtener los datos del formulario
      const { queSeHizo, queQuedaPendiente } = formData;
      
      // Crear el objeto con los datos a enviar
      const payload = {
        ID_retroalimentacion: idRetro, // ID de la retroalimentación
        se_hizo: queSeHizo, // Lo que se hizo
        pendiente: queQuedaPendiente, // Lo que queda pendiente
      };

      console.log("Payload",payload);
      // Realizamos el PUT para actualizar la retroalimentación
      const response = await axios.put(
        `http://localhost:8000/api/v1/grupo-empresa/UpdateRetroalimentacion`, // URL con el ID de la retroalimentación
        payload
      );

      if (response.data) {
        alert("Información actualizada exitosamente");
        resetForm(); // Resetear el formulario después de enviar
        closeRetroModal();
        location.reload();
      } else {
        alert("Error al actualizar la información");
      }
    } catch (error) {
      console.error("Error al actualizar la información:", error);
      alert("Ocurrió un error al actualizar la información");
    }
  };

  const handleCancel = () => {
    resetForm(); // Resetear el formulario al cancelar
    closeRetroModal();
    location.reload();
  };

  const resetForm = () => {
    setFormData({
      queSeHizo: "",
      queQuedaPendiente: "",
    });
  };

  if (!showRetroModal) return null;

  return ReactDOM.createPortal(
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="px-8 py-6 bg-white rounded-lg shadow-md w-[90%] max-w-md"
      >
        <h2 className="mb-4 text-xl font-semibold text-center text-primary-800">
          Feedback Retrospectivo
        </h2>

        <div className="mb-4">
          <label
            htmlFor="queSeHizo"
            className="block mb-2 text-lg font-medium text-gray-700"
          >
            ¿Qué se hizo?
          </label>
          <textarea
            id="queSeHizo"
            value={formData.queSeHizo}
            onChange={handleInputChange}
            className="w-full h-24 p-3 border rounded-md resize-none border-neutral-400 focus:outline-primary-500"
            placeholder="Describe lo que se logró..."
            maxLength={240}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label
            htmlFor="queQuedaPendiente"
            className="block mb-2 text-lg font-medium text-gray-700"
          >
            ¿Qué queda pendiente?
          </label>
          <textarea
            id="queQuedaPendiente"
            value={formData.queQuedaPendiente}
            onChange={handleInputChange}
            className="w-full h-24 p-3 border rounded-md resize-none border-neutral-400 focus:outline-primary-500"
            placeholder="Describe lo que falta por hacer..."
            maxLength={240}
            required
          ></textarea>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 border rounded-md border-neutral-400 bg-neutral-100 hover:bg-neutral-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white rounded-md bg-primary-500 hover:bg-primary-600"
          >
            Guardar
          </button>
        </div>
      </form>
    </section>,
    document.getElementById("modal-root")
  );
};

export default ModalRetro;
