/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */

import { useState } from "react";
import ReactDOM from "react-dom";
import { useParams } from "react-router-dom";
import "./ModalPlanillaEvaluacion.css";
import axios from "axios";

const ModalPlanillaEvaluacion = ({ showModal, closeModal, children }) => {
  const { id } = useParams();

  if (!showModal) return null;

  const [fechas, setFechas] = useState([]);
  const [rubricas, setRubricas] = useState([]);
  const MAX_FECHAS = 4; // limite de fechas

  const agregarFecha = () => {
    if (fechas.length < MAX_FECHAS) {
      setFechas([...fechas, ""]);
    } else {
      alert(`Solo puedes agregar un máximo de ${MAX_FECHAS} fechas.`);
    }
  };

  const eliminarFecha = (index) => {
    const nuevasFechas = fechas.filter((_, i) => i !== index);
    setFechas(nuevasFechas);
  };

  const actualizarFecha = (index, valor) => {
    const nuevasFechas = [...fechas];
    nuevasFechas[index] = valor;
    setFechas(nuevasFechas);
  };

  const agregarRubrica = () => {
    setRubricas([
      ...rubricas,
      {
        titulo: "",
        descripcion: "",
        niveles: [{ puntos: "", tituloNivel: "", descripcionNivel: "" }],
      },
    ]);
  };
  const eliminarRubrica = (index) => {
    const nuevasRubricas = rubricas.filter((_, i) => i !== index);
    setRubricas(nuevasRubricas);
  };

  const actualizarRubrica = (index, campo, valor) => {
    const nuevasRubricas = [...rubricas];
    nuevasRubricas[index][campo] = valor;
    setRubricas(nuevasRubricas);
  };

  const agregarNivel = (rubricaIndex) => {
    const nuevasRubricas = [...rubricas];
    nuevasRubricas[rubricaIndex].niveles.push({
      puntos: "",
      tituloNivel: "",
      descripcionNivel: "",
    });
    setRubricas(nuevasRubricas);
  };

  const eliminarNivel = (rubricaIndex, nivelIndex) => {
    const nuevasRubricas = [...rubricas];
    nuevasRubricas[rubricaIndex].niveles = nuevasRubricas[
      rubricaIndex
    ].niveles.filter((_, i) => i !== nivelIndex);
    setRubricas(nuevasRubricas);
  };

  const actualizarNivel = (rubricaIndex, nivelIndex, campo, valor) => {
    const nuevasRubricas = [...rubricas];
    nuevasRubricas[rubricaIndex].niveles[nivelIndex][campo] = valor;

    // Si el campo actualizado es "puntos", recalcula el puntaje de la rúbrica
    if (campo === "puntos") {
      const puntosNiveles = nuevasRubricas[rubricaIndex].niveles.map(
        (nivel) => parseFloat(nivel.puntos) || 0,
      );
      const puntajeMaximo = Math.max(...puntosNiveles); // Determina el puntaje más alto de los niveles
      nuevasRubricas[rubricaIndex].puntos = puntajeMaximo; // Asigna ese puntaje a la rúbrica
    }

    setRubricas(nuevasRubricas);
  };

  const calcularPuntajeTotal = () => {
    const total = rubricas.reduce(
      (sum, rubrica) => sum + (rubrica.puntos || 0),
      0,
    );
    return total;
  };

  const obtenerPuntajeParcial = (rubricaIndex) => {
    const niveles = rubricas[rubricaIndex].niveles;
    const puntajeMaximo = Math.max(
      ...niveles.map((nivel) => parseFloat(nivel.puntos) || 0),
    );
    return puntajeMaximo;
  };

  const guardarEntregable = async (fechas, rubricas, id) => {
    const payload = {
      nombre_entregable: document.getElementById("nombre_sprint").value,
      ID_empresa: id, // ID de la empresa, que proviene de `useParams`
      fechas: fechas,
      rubricas: rubricas.map((rubrica) => ({
        titulo: rubrica.titulo,
        descripcion: rubrica.descripcion,
        niveles: rubrica.niveles.map((nivel) => ({
          puntos: parseFloat(nivel.puntos), // Asegúrate de convertir los puntos a número
          tituloNivel: nivel.tituloNivel,
          descripcionNivel: nivel.descripcionNivel,
        })),
      })),
    };

    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/grupo-empresa/${id}/guardar-entregable`,
        payload,
      );
      console.log("Entregable creado:", response.data);
      alert("Entregable creado con éxito");
      closeModal();
      location.reload();
    } catch (error) {
      console.error("Error al crear el entregable:", error);
      alert("Hubo un error al crear el entregable");
    }
  };

  return ReactDOM.createPortal(
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      {children}
      <form className="px-8 py-5 rounded-md shadow modal bg-neutral-200">
        <span className="flex justify-center mb-4 text-2xl font-semibold text-primary-800">
          Crear entregable
        </span>
        <div className="relative flex gap-5">
          <section className="min-w-[17rem]">
            <div>
              <label
                htmlFor="nombre_sprint"
                className="text-lg font-semibold text-primary-800"
              >
                Nombre del entregable
              </label>
              <br />
              <input
                id="nombre_sprint"
                type="text"
                className="w-full p-2 my-2 text-gray-800 border rounded-md border-neutral-400"
                placeholder="Ej: Propuesta"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-lg font-semibold text-primary-800">
                Fechas de entrega
              </label>
              {fechas.map((fecha, index) => (
                <div key={index} className="flex gap-2">
                  <span className="flex items-center font-medium text-gray-500 text-nowrap">
                    Fecha {index + 1}:
                  </span>
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => actualizarFecha(index, e.target.value)}
                    className="w-full p-2 py-1 my-2 text-gray-800 border rounded-md border-neutral-400"
                  />
                  
                  <button
                    type="button"
                    onClick={() => eliminarFecha(index)}
                    title="Eliminar fecha"
                    className="text-xl text-gray-500 transition-colors hover:text-red-500"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={agregarFecha}
                className="py-2 mt-2 font-semibold text-gray-600 transition-colors border rounded border-neutral-400 hover:bg-neutral-100"
              >
                Añadir fecha
              </button>
            </div>
          </section>

          {/* SECCION DE RUBRICAS */}
          <section className="flex flex-col seccion-rubrica">
            <section className="sticky top-0 z-50 inline-flex justify-between mb-2 text-lg font-semibold bg-neutral-200 text-primary-800">
              <span>Configurar rúbricas</span>
              <span>/{calcularPuntajeTotal()}</span>
            </section>

            {rubricas.map((rubrica, index) => (
              <div
                key={index}
                className="relative flex flex-col p-2 mb-2 border rounded border-neutral-400"
              >
                <span className="absolute text-lg font-semibold right-10 text-primary-800">
                  /{obtenerPuntajeParcial(index)}
                </span>
                <label className="text-lg font-semibold text-primary-800">
                  Título de la rúbrica
                </label>
                <input
                  type="text"
                  value={rubrica.titulo}
                  onChange={(e) =>
                    actualizarRubrica(index, "titulo", e.target.value)
                  }
                  className="w-full px-2 py-1 my-1 text-gray-800 border rounded-md border-neutral-400"
                  placeholder="Título del criterio"
                />

                <label className="text-lg font-semibold text-primary-800">
                  Descripción de la rúbrica
                </label>
                <input
                  type="text"
                  value={rubrica.descripcion}
                  onChange={(e) =>
                    actualizarRubrica(index, "descripcion", e.target.value)
                  }
                  className="w-full px-2 py-1 my-1 text-gray-800 border rounded-md border-neutral-400"
                  placeholder="Descripción del criterio (opcional)"
                />

                <div className="mt-2 mb-3 border-t border-neutral-400" />

                {/* SECCION NIVEL>RUBRICA */}
                <section className="flex gap-2 seccion-niveles">
                  {rubrica.niveles.map((nivel, nivelIndex) => (
                    <div
                      key={nivelIndex}
                      className="relative flex flex-col flex-shrink-0 w-64 p-2 border rounded border-neutral-400"
                    >
                      <label className="font-semibold text-primary-800">
                        Puntos
                      </label>
                      <input
                        type="number"
                        value={nivel.puntos}
                        onChange={(e) =>
                          actualizarNivel(
                            index,
                            nivelIndex,
                            "puntos",
                            e.target.value,
                          )
                        }
                        className="w-full px-2 py-1 my-1 text-gray-800 border rounded-md border-neutral-400"
                        placeholder="Puntos del nivel"
                      />

                      <label className="font-semibold text-primary-800">
                        Título del criterio
                      </label>
                      <input
                        type="text"
                        value={nivel.tituloNivel}
                        onChange={(e) =>
                          actualizarNivel(
                            index,
                            nivelIndex,
                            "tituloNivel",
                            e.target.value,
                          )
                        }
                        className="w-full px-2 py-1 my-1 text-gray-800 border rounded-md border-neutral-400"
                        placeholder="Título del nivel"
                      />

                      <label className="font-semibold text-primary-800">
                        Descripción
                      </label>
                      <input
                        type="text"
                        value={nivel.descripcionNivel}
                        onChange={(e) =>
                          actualizarNivel(
                            index,
                            nivelIndex,
                            "descripcionNivel",
                            e.target.value,
                          )
                        }
                        className="w-full px-2 py-1 my-1 text-gray-800 border rounded-md border-neutral-400"
                        placeholder="Descripción del nivel (opcional)"
                      />
                      <button
                        type="button"
                        onClick={() => eliminarNivel(index, nivelIndex)}
                        title="Eliminar nivel"
                        className="absolute flex items-center justify-center rounded-full right-2 size-5"
                      >
                        <i className="text-gray-600 transition-colors fa-solid fa-xmark hover:text-red-500"></i>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => agregarNivel(index)}
                    title="Añadir nivel"
                    className="p-2 text-gray-600 transition-colors border rounded border-neutral-400 hover:bg-neutral-100"
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </section>

                <button
                  type="button"
                  onClick={() => eliminarRubrica(index)}
                  title="Eliminar criterio"
                  className="absolute flex items-center justify-center rounded-full right-2 size-5"
                >
                  <i className="text-gray-600 transition-colors fa-solid fa-xmark hover:text-red-500"></i>
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={agregarRubrica}
              className="py-2 font-semibold text-gray-600 transition-colors border rounded border-neutral-400 hover:bg-neutral-100"
            >
              Añadir rúbrica
            </button>
          </section>
        </div>

        <section className="mt-5 flex gap-4 *:w-1/2 *:rounded *:py-2 *:font-semibold">
          <button
            className="text-white bg-primary-500"
            type="button" // Cambia type a "button" si no estás usando un formulario
            onClick={() => {
              console.log("Botón presionado", { fechas, rubricas, id });
              guardarEntregable(fechas, rubricas, id);
            }}
          >
            Crear entregable
          </button>

          <button
            onClick={closeModal}
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

export default ModalPlanillaEvaluacion;
