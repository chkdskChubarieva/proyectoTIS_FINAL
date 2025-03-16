import { useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

const ModalNuevoSprint = ({ closeModal, empresaId }) => {
  const [nombreSprint, setNombreSprint] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/sprints",
        {
          nombre_sprint: nombreSprint,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          ID_empresa: empresaId,
        },
      );

      if (response.status === 201) {
        alert("Sprint creado exitosamente");

        window.location.reload();
        closeModal();
      }
    } catch (error) {
      console.error("Error al crear el sprint:", error);
      alert("Hubo un problema al crear el sprint");
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-[450px] rounded-md bg-neutral-200 px-8 py-5 shadow"
      >
        <span className="mb-4 flex justify-center text-2xl font-semibold text-primary-800">
          Nuevo sprint
        </span>
        <div>
          <label
            htmlFor="nombre_sprint"
            className="text-lg font-semibold text-primary-800"
          >
            Nombre del sprint
          </label>
          <br />
          <input
            id="nombre_sprint"
            type="text"
            value={nombreSprint}
            onChange={(e) => setNombreSprint(e.target.value)}
            className="my-2 w-full rounded-md border border-neutral-400 p-2 text-gray-800"
            placeholder="Ej: Sprint #1"
          />
        </div>

        <section className="flex justify-between gap-4">
          <div className="w-1/2">
            <label
              htmlFor="fecha_ini"
              className="text-lg font-semibold text-primary-800"
            >
              Fecha inicio
            </label>
            <br />
            <input
              type="date"
              id="fecha_ini"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="my-2 w-full rounded-md border border-neutral-400 p-2 text-gray-800"
            />
          </div>

          <div className="w-1/2">
            <label
              htmlFor="fecha_fin"
              className="text-lg font-semibold text-primary-800"
            >
              Fecha fin
            </label>
            <br />
            <input
              type="date"
              id="fecha_fin"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="my-2 w-full rounded-md border border-neutral-400 p-2 text-gray-800"
            />
          </div>
        </section>

        <section className="mt-5 flex gap-4 *:w-1/2 *:rounded *:py-2 *:font-semibold">
          <button
            type="submit"
            className="bg-primary-500 text-white transition-colors hover:bg-primary-500/95"
          >
            Guardar
          </button>

          <button
            onClick={closeModal}
            className="border border-neutral-400 bg-neutral-100 text-gray-600 transition-colors hover:bg-neutral-200"
          >
            Cancelar
          </button>
        </section>
      </form>
    </div>
  );
  return ReactDOM.createPortal(
    modalContent,
    document.getElementById("modal-root"),
  );
};

export default ModalNuevoSprint;
