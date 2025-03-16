import { useState, useEffect } from "react";
import axios from "axios";
import ModalCrearEvaluacion from "./ModalCrearEvaluacion";

const Evaluaciones = () => {
  const [entregables, setEntregables] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  useEffect(() => {
    const fetchEvaluaciones = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/docente/evaluaciones");

        // Ordenar las evaluaciones en el orden deseado
        const ordenado = ["Auto Evaluacion", "Evaluacion Pares", "Evaluacion Cruzada"];
        const entregablesOrdenados = response.data.sort((a, b) =>
          ordenado.indexOf(a.nombre_entregable) - ordenado.indexOf(b.nombre_entregable)
        );

        setEntregables(entregablesOrdenados);
      } catch (error) {
        console.error("Error al obtener las evaluaciones:", error);
      }
    };

    fetchEvaluaciones();
  }, []);

  return (
    <section className="w-full px-10 py-6 mx-auto xl:max-w-7xl">
      <ModalCrearEvaluacion showModal={showModal} closeModal={closeModal} />

      <div className="flex justify-between mb-8">
        <h2 className="text-2xl font-semibold text-primary-800">
          Lista de evaluaciones
        </h2>
        <button
          type="button"
          className="p-2 space-x-2 text-white transition-colors rounded-md bg-primary-500 hover:bg-primary-400"
          onClick={openModal}
        >
          <i className="fa-solid fa-plus"></i>
          <span> Crear evaluación</span>
        </button>
      </div>

      {entregables.length > 0 ? (
        entregables.map((entregable) => (
          <article key={entregable.ID_entregable} className="my-5 border rounded-md border-neutral-400">
            <header className="flex items-center justify-between p-3 border-b border-neutral-400">
              <div className="flex items-center gap-3">
                <i className="flex items-center justify-center text-lg text-white rounded-full fa-solid fa-pencil size-9 bg-primary-500"></i>
                <span className="text-lg font-semibold text-primary-500">
                  {entregable.nombre_entregable}
                </span>
              </div>
              <i className="flex items-center justify-center text-lg transition-colors rounded-full cursor-pointer fa-solid fa-ellipsis-vertical size-9 text-neutral-600 hover:bg-neutral-200"></i>
            </header>
            <p className="p-3 text-pretty">
              Descripción: {entregable.rubrica?.[0]?.desc_rubrica || "Sin rúbrica"}
            </p>
            <footer className="px-3 py-2 border-t border-neutral-400 text-end">
              <span className="text-lg font-semibold text-neutral-600">
                Puntos: {entregable.nota_entregable}
              </span>
            </footer>
          </article>
        ))
      ) : (
        <p className="text-center text-neutral-500">No hay evaluaciones disponibles.</p>
      )}
    </section>
  );
};

export default Evaluaciones;
