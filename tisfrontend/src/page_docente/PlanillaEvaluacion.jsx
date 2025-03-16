import { useEffect, useState } from "react";
import "./PlanillaEvaluacion.css";
import { useParams } from "react-router-dom";
import ModalPlanillaEvaluacion from "./ModalPlanillaEvaluacion";
import ModalNotaEvaluacion from "./ModalNotaEvaluacion";
import ModalInfoEvaluacion from "./ModalInfoEvaluacion";
import ModalRetro from "./ModalRetro";
import axios from "axios";

const PlanillaEvaluacion = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [showNotasModal, setShowNotasModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showRetroModal, setShowRetroModal] = useState(false);
  const [ID_usuario, setUsuario] = useState();
  const [ID_fecha_entregable, setFecha] = useState();
  const [ID_entregable, setEntregable] = useState();
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const closeRetroModal = () => setShowRetroModal(false);

  useEffect(() => {
    if (id) {
      fetchEntregables(id);
      fetchSeguimientos(id);
      // Usar el ID_empresa de la URL
    }
  }, [id]);

  function openNotasModal({ ID_fecha_entregable, ID_usuario, ID_entregable }) {
    setFecha(ID_fecha_entregable);
    setUsuario(ID_usuario);
    setEntregable(ID_entregable); // Almacenar el ID_entregable seleccionado
    verificarEvaluacion(ID_fecha_entregable, ID_usuario);
    console.log("Fecha Entregable:", ID_fecha_entregable);
    console.log("Usuario:", ID_usuario);
    console.log("ID_entregable:", ID_entregable);

    // Realiza las acciones necesarias
  }

  const openRetroModal = (ID_fecha_entregable) => {
    setFecha(ID_fecha_entregable); // Almacenar el ID_fecha_entregable en el estado
    setShowRetroModal(true); // Abrir el modal
  };

  const verificarEvaluacion = async (ID_fecha_entregable, ID_usuario) => {
    try {
      console.log(
        "Obteniendo datos para ID_fecha_entregable:",
        ID_fecha_entregable,
      );

      const response = await axios.post(
        `http://localhost:8000/api/v1/grupo-empresa/${id}/verificarEvaluacion`,
        {
          ID_fecha_entregable,
          ID_usuario,
        },
      );

      console.log("Datos obtenidos:", response.data);

      // Verificar si exists es true o false
      if (response.data.exists) {
        console.log(
          "Los datos existen, puedes proceder con la lógica para 'true'.",
        );
        // Aquí pones la lógica que debe ejecutarse si los datos existen
        setShowInfoModal(true);
      } else {
        console.log(
          "Los datos no existen, puedes proceder con la lógica para 'false'.",
        );
        // Aquí pones la lógica que debe ejecutarse si los datos no existen
        setShowNotasModal(true);
      }
    } catch (error) {
      console.error("Error al obtener los datos de la empresa:", error);
    }
  };

  const [grupoEmpresa, setGrupoEmpresa] = useState({});
  const [nombresEstudiantes, setNombresEstudiantes] = useState([]);
  const [entregables, setEntregables] = useState([]);
  const [fechasEntregables, setFechasEntregables] = useState([]);
  const [seguimientos, setSeguimientos] = useState([]);

  const fetchEntregables = async (empresaId) => {
    try {
      console.log("Obteniendo datos para ID_empresa:", empresaId);

      const response = await axios.get(
        `http://localhost:8000/api/v1/grupo-empresa/${empresaId}/evaluacion`,
      );

      console.log("Respuesta del servidor:", response.data);

      const data = response.data.data || {}; // Asegúrate de que 'data' sea un objeto

      // Extraer y asignar los datos de grupoEmpresa
      const grupoEmpresaData = {
        ID_empresa: data.grupoEmpresa?.ID_empresa || null,
        nombre_empresa: data.grupoEmpresa?.nombre_empresa || "",
        correo_empresa: data.grupoEmpresa?.correo_empresa || "",
        nombre_representante: data.grupoEmpresa?.nombre_representante || "",
        telf_representante: data.grupoEmpresa?.telf_representante || "",
      };
      setGrupoEmpresa(grupoEmpresaData);
      console.log("Grupo empresa asignado:", grupoEmpresaData);

      // Asignar los estudiantes con ID y nombre completo
      const formattedEstudiantes = (data.nombresEstudiantes || []).map(
        (estudiante) => ({
          ID_usuario: estudiante.ID_usuario || null,
          nombre_completo: estudiante.nombre_completo || "",
        }),
      );
      setNombresEstudiantes(formattedEstudiantes);
      console.log("Estudiantes asignados:", formattedEstudiantes);

      // Adaptar los entregables y extraer las fechas con sus IDs
      const formattedEntregables = (data.entregables || []).map(
        (entregable) => ({
          ID_entregable: entregable.ID_entregable || null,
          nombre_entregable: entregable.nombre_entregable || "",
          nota_entregable: entregable.nota_entregable || null,
          fechas_entregables: (entregable.fechas_entregables || []).map(
            (fecha) => ({
              ID_fecha_entregable: fecha.ID_fecha_entregable || null,
              fecha_entregable: fecha.fecha_entregable || "",
            }),
          ),
        }),
      );
      setEntregables(formattedEntregables);
      console.log(
        "Entregables asignados con fechas e IDs:",
        formattedEntregables,
      );

      // Extraer todas las fechas con sus IDs
      const fechas = (data.entregables || []).flatMap((entregable) =>
        (entregable.fechas_entregables || []).map((fecha) => ({
          ID_fecha_entregable: fecha.ID_fecha_entregable || null,
          fecha_entregable: fecha.fecha_entregable || "",
        })),
      );
      setFechasEntregables(fechas);
      console.log("Fechas de entregables asignadas:", fechas);
    } catch (error) {
      console.error("Error al obtener los datos de la empresa:", error);
    }
  };

  const exportarDatos = async (empresaId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/grupo-empresa/${empresaId}/exportarDatos`,
        { responseType: "blob" }, // Importante para descargar archivos
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "seguimiento_estudiantes.csv"); // Nombre del archivo
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error al exportar los datos:", error);
    }
  };

  const fetchSeguimientos = async (empresaId) => {
    try {
      console.log(
        "Obteniendo datos de seguimiento para ID_empresa:",
        empresaId,
      );

      // Realiza la petición al endpoint en Laravel
      const response = await axios.get(
        `http://localhost:8000/api/v1/grupo-empresa/${empresaId}/seguimientoEstudiantes`,
      );

      console.log("Respuesta del servidor:", response.data);

      // Procesar los seguimientos de estudiantes
      const seguimientos = (response.data || []).map((seguimiento) => ({
        ID_seguimiento_estudiantes:
          seguimiento.ID_seguimiento_estudiantes || null,
        nota_estudiante: seguimiento.nota_estudiante || 0,
        asistencias: seguimiento.asistencias || 0,
        retrasos: seguimiento.retrasos || 0,
        ausencias_justificadas: seguimiento.ausencias_justificadas || 0,
        ausencias_injustificadas: seguimiento.ausencias_injustificadas || 0,
        ID_estudiante: seguimiento.ID_usuario || null, // Agregado el ID del estudiante
        ID_fecha_entregable: seguimiento.ID_fecha_entregable || null, // Agregado el ID de la fecha entregable
      }));

      setSeguimientos(seguimientos); // Asignar los seguimientos al estado
      console.log("Seguimientos de estudiantes asignados:", seguimientos);
    } catch (error) {
      console.error("Error al obtener los datos de seguimiento:", error);
    }
  };

  return (
    <section className="w-full px-10 py-6">
      <ModalPlanillaEvaluacion
        showModal={showModal}
        closeModal={closeModal}
      ></ModalPlanillaEvaluacion>

      <ModalRetro
        showRetroModal={showRetroModal}
        closeRetroModal={closeRetroModal}
        ID_fecha_entregable={ID_fecha_entregable} // Pasar el dato al modal
      />

      {showNotasModal && (
        <ModalNotaEvaluacion
          showNotasModal={showNotasModal}
          closeNotasModal={() => setShowNotasModal(false)}
          ID_usuario={ID_usuario}
          ID_fecha_entregable={ID_fecha_entregable}
          ID_entregable={ID_entregable}
        />
      )}
      {showInfoModal && (
        <ModalInfoEvaluacion
          showInfoModal={showInfoModal}
          closeInfoModal={() => setShowInfoModal(false)}
          ID_usuario={ID_usuario}
          ID_fecha_entregable={ID_fecha_entregable}
          ID_entregable={ID_entregable}
        />
      )}

      <div className="flex justify-between mb-8">
        <h2 className="text-2xl font-semibold text-primary-800">
          Planilla de evaluación
        </h2>

        <button
          type="button"
          className="w-40 p-2 text-lg font-semibold text-white transition-colors rounded bg-primary-500 hover:bg-primary-400"
          onClick={() => exportarDatos(id)}
        >
          Exportar datos
        </button>
      </div>

      <table className="mt-5 rounded-md">
        <thead className="text-primary-800">
          <tr>
            <th>{grupoEmpresa.nombre_empresa} </th>

            {/* COLUMNAS DE FECHAS ENTREGABLES */}
            {entregables.map((entregable, index) =>
              entregable.fechas_entregables.map((fecha, fechaIndex) => {
                const fechaTexto = fecha.fecha_entregable; // Asegurarse de usar fecha_entregable
                if (!fechaTexto || typeof fechaTexto !== "string") {
                  console.error("Fecha no válida:", fechaTexto);
                  return null;
                }

                // Convertir la fecha a formato YYYY-MM-DD
                const [dia, mes, anio] = fechaTexto.split("/");
                const fechaISO = `${anio}-${mes}-${dia}`;
                const nombreDia = new Date(fechaISO).toLocaleDateString(
                  "es-ES",
                  {
                    weekday: "long",
                  },
                );

                const omitButton =
                  entregable.nombre_entregable === "Auto Evaluacion" ||
                  entregable.nombre_entregable === "Evaluacion Cruzada" ||
                  entregable.nombre_entregable === "Evaluacion Pares";

                return (
                  <th
                    key={`${index}-${fechaIndex}`}
                    className="fecha-entregable"
                  >
                    <div style={{ textAlign: "center" }}>
                      <div>{fechaTexto}</div>
                      <div>
                        {nombreDia.charAt(0).toUpperCase() + nombreDia.slice(1)}
                      </div>
                      {!omitButton && (
                        <button
                          type="button"
                          className="w-full mt-1 text-lg font-semibold transition-colors border-2 rounded border-neutral-200 text-primary-200 hover:border-primary-500 hover:bg-primary-500 hover:text-neutral-200"
                          onClick={() =>
                            openRetroModal(fecha.ID_fecha_entregable)
                          }
                          title="Abrir retroalimentación y notas"
                        >
                          <i className="fa-solid fa-message"></i>
                        </button>
                      )}
                    </div>
                  </th>
                );
              }),
            )}

            <th className="fecha-entregable">
              <button
                type="button"
                onClick={openModal}
                className="flex items-center justify-center mx-auto transition-colors border-2 rounded size-6 border-primary-200 text-primary-200 hover:border-primary-500 hover:text-primary-500"
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </th>

            {/* COLUMNAS DE CONTROL DE ASISTENCIA (FIJO) */}

            <th className="w-24 asistencia">
              <tr className="border-none">Nota sumativa</tr>
            </th>

            <th className="w-24 asistencia">
              <tr className="border-none">Tarde</tr>
            </th>

            <th className="w-24 asistencia">
              <tr className="border-none">Ausencia justificada</tr>
            </th>

            <th className="w-24 asistencia">
              <tr className="border-none">Ausencia injustificada</tr>
            </th>
          </tr>
        </thead>

        <tbody>
          {nombresEstudiantes.map((estudiante, index) => {
            const seguimientosEstudiante = seguimientos.filter(
              (s) => s.ID_estudiante === estudiante.ID_usuario,
            );

            const notaSumativa = seguimientosEstudiante.reduce(
              (sum, s) => sum + s.nota_estudiante,
              0,
            );

            const totalRetrasos = seguimientosEstudiante.reduce(
              (sum, s) => sum + s.retrasos,
              0,
            );
            const totalAusenciasJustificadas = seguimientosEstudiante.reduce(
              (sum, s) => sum + s.ausencias_justificadas,
              0,
            );
            const totalAusenciasInjustificadas = seguimientosEstudiante.reduce(
              (sum, s) => sum + s.ausencias_injustificadas,
              0,
            );

            return (
              <tr key={index}>
                <td>{estudiante.nombre_completo}</td>

                {entregables.map((entregable) =>
                  entregable.fechas_entregables.map((fecha) => {
                    const seguimiento = seguimientosEstudiante.find(
                      (s) =>
                        s.ID_fecha_entregable === fecha.ID_fecha_entregable,
                    );

                    const noAbrirModal =
                      entregable.nombre_entregable === "Auto Evaluacion" ||
                      entregable.nombre_entregable === "Evaluacion Pares" ||
                      entregable.nombre_entregable === "Evaluacion Cruzada";

                    return (
                      <td
                        onClick={
                          !noAbrirModal
                            ? () =>
                                openNotasModal({
                                  ID_fecha_entregable:
                                    fecha.ID_fecha_entregable,
                                  ID_usuario: estudiante.ID_usuario,
                                  ID_entregable: entregable.ID_entregable,
                                })
                            : undefined
                        }
                        className={noAbrirModal ? "" : "cursor-pointer"}
                        key={fecha.ID_fecha_entregable}
                      >
                        {seguimiento?.nota_estudiante || 0}
                      </td>
                    );
                  }),
                )}
                <td></td>
                <td>{notaSumativa}</td>
                <td>{totalRetrasos}</td>
                <td>{totalAusenciasJustificadas}</td>
                <td>{totalAusenciasInjustificadas}</td>
              </tr>
            );
          })}
        </tbody>

        <tfoot className="text-primary-800">
          <tr className="font-semibold">
            <td>Entregables</td>

            {/* AGREGAR AQUI LOS NOMBRES DE LOS ENTREGABLES */}
            {entregables.map((entregable, index) => (
              <td key={index} colSpan={entregable.fechas_entregables.length}>
                {entregable.nombre_entregable}
              </td>
            ))}
            {/* ESPACIO EN BLANCO FIJO PARA LAS COLUMNAS DE ASISTENCIA Y NOTA SUMATIVA*/}
            <td colSpan={5}></td>
          </tr>
        </tfoot>
      </table>
    </section>
  );
};

export default PlanillaEvaluacion;
