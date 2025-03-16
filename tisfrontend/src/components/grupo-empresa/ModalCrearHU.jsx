import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

const ModalCrearHU = ({ closeModal }) => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [sprint, setSprint] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [empresaId, setEmpresaId] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [historias, setHistorias] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("user"));
    const userId = userData ? userData.ID_usuario : null;

    const fetchCompanyId = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/estudiante/${userId}`,
        );
        if (response.data.data.ID_empresa) {
          setEmpresaId(response.data.data.ID_empresa);
        }
      } catch (error) {
        console.error("Error al obtener el ID de la empresa:", error);
      }
    };

    if (userId) {
      fetchCompanyId();
    }
  }, []);

  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/grupo-empresa/${empresaId}/sprints`,
        );
        setSprints(response.data.sprints || []);
      } catch (error) {
        console.error("Error al obtener los sprints:", error);
      }
    };

    if (empresaId) {
      fetchSprints();
    }
  }, [empresaId]);

  useEffect(() => {
    const fetchHistorias = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/grupo-empresa/${empresaId}/historias`,
        );
        setHistorias(response.data.historias || []);
      } catch (error) {
        console.error("Error al obtener las historias de usuario:", error);
      }
    };

    if (empresaId) {
      fetchHistorias();
    }
  }, [empresaId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo || !descripcion || !sprint || !empresaId || !prioridad) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    console.log(titulo, descripcion, sprint, prioridad);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/historias",
        {
          titulo: titulo,
          desc_historia: descripcion,
          ID_sprint: sprint,
          prioridad: prioridad,
        },
      );

      console.log("Historia de usuario creada:", response.data);
      alert("Historia de usuario creada exitosamente");

      window.location.reload();
      closeModal();
    } catch (error) {
      if (error.response) {
        console.error("Detalles del error:", error.response.data.errors);
        setError(
          "Hubo un error al crear la historia de usuario. " +
            JSON.stringify(error.response.data.errors),
        );
      } else if (error.request) {
        console.error("Error en la solicitud:", error.request);
      } else {
        console.error("Error al configurar la solicitud:", error.message);
      }
      setError("Hubo un error al crear la historia de usuario.");
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="mx-5 w-160 rounded-md bg-neutral-200 px-8 py-5 shadow"
      >
        <span className="mb-4 flex justify-center text-2xl font-semibold text-primary-800">
          Nueva historia de usuario
        </span>
        {error && <p className="text-center text-red-500">{error}</p>}

        <section className="flex flex-col gap-2 sm:flex-row sm:gap-2">
          <div className="w-full">
            <label
              htmlFor="titulo"
              className="text-lg font-semibold text-primary-800"
            >
              Titulo
            </label>
            <br />
            <input
              type="text"
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="my-2 w-full rounded-md border border-neutral-400 p-2 text-gray-800"
              required
              placeholder="Titulo de la historia de usuario"
            />
          </div>

          <div className="w-full">
            <label
              htmlFor="sprint"
              className="text-lg font-semibold text-primary-800"
            >
              Sprint
            </label>
            <select
              id="sprint"
              value={sprint}
              onChange={(e) => setSprint(e.target.value)}
              className="my-2 w-full cursor-pointer rounded-md border border-neutral-400 p-2 text-gray-800"
              required
            >
              <option value="" disabled>
                Selecciona un sprint
              </option>
              {sprints.map((sprintItem) => (
                <option key={sprintItem.ID_sprint} value={sprintItem.ID_sprint}>
                  {sprintItem.nombre_sprint}
                </option>
              ))}
            </select>
          </div>
        </section>

        <div className="my-2">
          <label
            htmlFor="prioridad"
            className="text-lg font-semibold text-primary-800"
          >
            Prioridad
          </label>
          <select
            id="prioridad"
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
            className="my-2 w-full cursor-pointer rounded-md border border-neutral-400 p-2 text-gray-800"
            required
          >
            <option value="" disabled>
              Selecciona la prioridad
            </option>
            <option value="1">Alta</option>
            <option value="2">Media</option>
            <option value="3">Baja</option>
          </select>
        </div>

        <label
          htmlFor="descripcion"
          className="text-lg font-semibold text-primary-800"
        >
          Descripción
        </label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="my-2 w-full resize-none rounded-md border border-neutral-400 p-2 text-gray-800"
          rows="3"
          placeholder="Agrega una descripción para que otros usuarios puedan entender mejor esta historia de usuario"
          required
        ></textarea>

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

export default ModalCrearHU;
