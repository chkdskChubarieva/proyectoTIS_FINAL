/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import { useCallback } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

const ModalNotaEvaluacion = ({
  showNotasModal,
  closeNotasModal,
  ID_entregable, // Prop para el ID del entregable
  ID_fecha_entregable,
  ID_usuario,
  children,
}) => {
  const [rubricas, setRubricas] = useState([]); // Almacena las rúbricas y criterios
  const [selectedCriterios, setSelectedCriterios] = useState({}); // Almacena el criterio seleccionado por rúbrica
  const [notaEstudiante, setNotaEstudiante] = useState(""); // Nota ingresada manualmente
  const [retroalimentacion, setRetroalimentacion] = useState(""); // Comentario del estudiante
  const [notaManual, setNotaManual] = useState(false);

  useEffect(() => {
    if (showNotasModal && ID_entregable) {
      fetchRubricas(ID_entregable);
    }
  }, [showNotasModal, ID_entregable]);

  const fetchRubricas = async (entregableId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/grupo-empresa/${entregableId}/mostrarRubricas`,
      );

      const rubricas = (response.data.data || []).map((rubrica) => ({
        ID_rubrica: rubrica.ID_rubrica,
        titulo_rubrica: rubrica.titulo_rubrica,
        desc_rubrica: rubrica.desc_rubrica,
        nota_rubrica: rubrica.nota_rubrica,
        criterios: rubrica.criterios.map((criterio) => ({
          ID_criterio: criterio.ID_criterio,
          titulo_criterio: criterio.titulo_criterio,
          desc_criterio: criterio.desc_criterio,
          puntos_criterio: criterio.puntos_criterio,
        })),
      }));

      setRubricas(rubricas);
    } catch (error) {
      console.error("Error al obtener las rúbricas:", error);
    }
  };

  const handleCriterioSelect = (rubricaId, criterio) => {
    setSelectedCriterios((prev) => {
      const isSelected = prev[rubricaId]?.ID_criterio === criterio.ID_criterio;

      const updated = {
        ...prev,
        [rubricaId]: isSelected ? null : criterio,
      };

      const sumaCriterios = Object.values(updated)
        .filter(Boolean)
        .reduce((acc, crit) => acc + crit.puntos_criterio, 0);

      if (!notaManual) {
        setNotaEstudiante(sumaCriterios);
      }

      return updated;
    });
  };

  useEffect(() => {
    if (!notaManual) {
      const sumaCriterios = Object.values(selectedCriterios)
        .filter(Boolean)
        .reduce((acc, criterio) => acc + criterio.puntos_criterio, 0);

      setNotaEstudiante(sumaCriterios);
    }
  }, [notaManual, selectedCriterios]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const criteriosSeleccionados = Object.values(selectedCriterios)
      .filter(Boolean)
      .map((criterio) => criterio.puntos_criterio);

    const sumaCriterios = criteriosSeleccionados.reduce(
      (acc, curr) => acc + curr,
      0,
    );

    const notaFinal = notaEstudiante || sumaCriterios;

    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/grupo-empresa/${ID_entregable}/asignarNota`,
        {
          nota_estudiante: notaFinal,
          retroalimentacion,
          ID_fecha_entregable,
          ID_usuario,
          asistencia,
        },
      );

      console.log("Nota enviada con éxito:", response.data);
      closeNotasModal();
      location.reload();
    } catch (error) {
      console.error("Error al enviar la nota:", error);
    }
  };

  if (!showNotasModal) return null;

  const [asistencia, setAsistencia] = useState("puntual");

  const handleAsistenciaChange = (event) => {
    const selectedAsistencia = event.target.id;
    setAsistencia(event.target.id); // Actualiza el estado con el id del radio seleccionado

    // Si el usuario selecciona "Falta justificada" o "Falta injustificada", deshabilitamos la nota
    if (
      selectedAsistencia === "falta-justificada" ||
      selectedAsistencia === "falta-injustificada"
    ) {
      setNotaEstudiante(0); // Establecer nota a 0
      setNotaManual(true); // Desactivar cambios automáticos (esto asume que ya tienes esta lógica para los criterios)
    } else {
      // Si selecciona cualquier otra opción, permitir que la nota sea modificada
      setNotaManual(false); // Permitir cambios automáticos basados en los criterios
    }
  };

  const calcularNotaMaxima = useCallback(() => {
    let notaMaximaTotal = 0;

    rubricas.forEach((rubrica) => {
      notaMaximaTotal += rubrica.nota_rubrica;
    });

    return notaMaximaTotal;
  });

  useEffect(() => {
    calcularNotaMaxima();
  }, [calcularNotaMaxima, rubricas]);

  return ReactDOM.createPortal(
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      {children}
      <form
        onSubmit={handleSubmit}
        className="px-8 py-5 rounded-md shadow modal-nota bg-neutral-200"
      >
        <span className="flex justify-center mb-4 text-2xl font-semibold text-primary-800">
          Asignar nota
        </span>
        <div className="flex gap-5">
          {/* SECCION NOTA, COMENTARIOS y ASISTENCIA*/}
          <section className="min-w-[17rem]">
            <div>
              <label
                htmlFor="nota"
                className="text-lg font-semibold text-primary-800"
              >
                Nota:
              </label>
              <input
                type="number"
                id="nota"
                value={notaEstudiante}
                onChange={(e) => {
                  setNotaEstudiante(e.target.value);
                  setNotaManual(true); // Indicar que el usuario ha ingresado una nota manual
                }}
                max={calcularNotaMaxima()}
                disabled={
                  asistencia === "falta-justificada" ||
                  asistencia === "falta-injustificada"
                }
                className="w-full p-2 my-2 text-gray-800 border rounded-md border-neutral-400"
                placeholder="Asigna una nota"
              />
            </div>

            <div>
              <label
                htmlFor="comentarios"
                className="text-lg font-semibold text-primary-800"
              >
                Comentarios (opcional):
              </label>
              <textarea
                id="comentarios"
                value={retroalimentacion}
                onChange={(e) => setRetroalimentacion(e.target.value)}
                className="w-full p-2 my-2 text-gray-800 border rounded-md resize-none h-28 border-neutral-400"
                placeholder="Agrega un comentario"
                maxLength={240}
              ></textarea>
            </div>

            <div>
              <span className="text-lg font-semibold text-primary-800">
                Control de asistencia
              </span>
              <br />

              <input
                type="radio"
                name="asistencia"
                id="puntual"
                value=""
                checked={asistencia === "puntual"}
                onChange={handleAsistenciaChange}
                className="hidden"
              />
              <label
                htmlFor="puntual"
                className={`my-1 flex w-full cursor-pointer rounded-md border border-neutral-400 px-2 py-1 transition-colors ${asistencia === "puntual" ? "border-primary-500 bg-primary-100" : "hover:bg-neutral-100"}`}
              >
                Llegó puntual
              </label>

              <input
                type="radio"
                name="asistencia"
                id="tarde"
                value=""
                checked={asistencia === "tarde"}
                onChange={handleAsistenciaChange}
                className="hidden"
              />
              <label
                htmlFor="tarde"
                className={`my-1 flex w-full cursor-pointer rounded-md border border-neutral-400 px-2 py-1 transition-colors ${asistencia === "tarde" ? "border-primary-500 bg-primary-100" : "hover:bg-neutral-100"}`}
              >
                Llegó tarde
              </label>

              <input
                type="radio"
                name="asistencia"
                id="falta-justificada"
                value=""
                checked={asistencia === "falta-justificada"}
                onChange={handleAsistenciaChange}
                className="hidden"
              />
              <label
                htmlFor="falta-justificada"
                className={`my-1 flex w-full cursor-pointer rounded-md border border-neutral-400 px-2 py-1 transition-colors ${asistencia === "falta-justificada" ? "border-primary-500 bg-primary-100" : "hover:bg-neutral-100"}`}
              >
                Falta justificada
              </label>

              <input
                type="radio"
                name="asistencia"
                id="falta-injustificada"
                value=""
                checked={asistencia === "falta-injustificada"}
                onChange={handleAsistenciaChange}
                className="hidden"
              />
              <label
                htmlFor="falta-injustificada"
                className={`my-1 flex w-full cursor-pointer rounded-md border border-neutral-400 px-2 py-1 transition-colors ${asistencia === "falta-injustificada" ? "border-primary-500 bg-primary-100" : "hover:bg-neutral-100"}`}
              >
                Falta injustificada
              </label>
            </div>
          </section>

          {/* SECCION RUBRICAS */}
          <section className="seccion-rubrica-nota">
            <div className="sticky top-0 z-50 inline-flex justify-between w-full mb-2 text-lg font-semibold bg-neutral-200 text-primary-800">
              <span>Rúbricas</span>
            </div>

            {rubricas.length === 0 ? (
              <p>No se encontraron rúbricas.</p>
            ) : (
              rubricas.map((rubrica) => (
                <div
                  key={rubrica.ID_rubrica}
                  className="relative flex flex-col p-2 mb-2 border rounded border-neutral-400"
                >
                  <div className="flex justify-between font-semibold text-primary-800">
                    <span>{rubrica.titulo_rubrica}</span>
                    <span>
                      {selectedCriterios[rubrica.ID_rubrica]
                        ? `${selectedCriterios[rubrica.ID_rubrica].puntos_criterio}`
                        : "0"}
                      /{rubrica.nota_rubrica} ptos.
                    </span>
                  </div>

                  <p className="my-2 leading-tight text-balance">
                    {rubrica.desc_rubrica}
                  </p>

                  <section className="flex gap-2 seccion-niveles">
                    {rubrica.criterios.length === 0 ? (
                      <p>No se encontraron criterios.</p>
                    ) : (
                      rubrica.criterios.map((criterio) => (
                        <article
                          key={criterio.ID_criterio}
                          className={`relative flex max-h-48 min-h-32 w-56 flex-shrink-0 cursor-pointer flex-col rounded border border-neutral-400 p-2 transition-colors ${
                            selectedCriterios[rubrica.ID_rubrica]
                              ?.ID_criterio === criterio.ID_criterio
                              ? "border-primary-500 bg-primary-100"
                              : "hover:bg-neutral-100"
                          }`}
                          onClick={() =>
                            handleCriterioSelect(rubrica.ID_rubrica, criterio)
                          }
                        >
                          <div className="flex justify-between mb-2 text-neutral-800">
                            <span className="max-w-full overflow-hidden font-semibold text-ellipsis text-nowrap">
                              {criterio.titulo_criterio}
                            </span>
                            <span className="italic min-w-fit">
                              {criterio.puntos_criterio} ptos.
                            </span>
                          </div>
                          <p className="overflow-hidden overflow-y-auto leading-tight text-balance">
                            {criterio.desc_criterio ||
                              "Descripción no disponible."}
                          </p>
                        </article>
                      ))
                    )}
                  </section>
                </div>
              ))
            )}
          </section>
        </div>

        <section className="mt-5 flex gap-4 *:w-1/2 *:rounded *:py-2 *:font-semibold">
          <button type="submit" className="text-white bg-primary-500">
            Asignar nota
          </button>

          <button
            onClick={closeNotasModal}
            className="text-gray-600 border border-neutral-400 bg-neutral-100"
          >
            Cancelar
          </button>
        </section>
      </form>
    </section>,
    document.getElementById("modal-root"),
  );
};

export default ModalNotaEvaluacion;
