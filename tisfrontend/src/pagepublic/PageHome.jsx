import archivos from "../assets/icons/archivos.png";
import diploma from "../assets/icons/diploma.png";
import equipo from "../assets/icons/equipo.png";
import estudiantes from "../assets/icons/estudiantes.png";
import examen from "../assets/icons/examen.png";
import prueba from "../assets/icons/prueba.png";
import "../app.css";
import Tarjeta from "../components/Tarjeta";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function PageHome() {
  const botonesNavbar = [
    { nombreBoton: "Inicio", hrefBoton: "#home" },
    { nombreBoton: "Características", hrefBoton: "#caracteristicas" },
    { nombreBoton: "Contacto", hrefBoton: "#contacto" },
  ];

  return (
    <>
      <Header />
      <Navbar botones={botonesNavbar} />
      <main id="home" className="relative top-32 -z-10 background w-full">
        <section className="bg-black bg-opacity-50">
          <h1 className="px-6 py-12 text-4xl font-semibold leading-tight text-white sm:px-12 sm:py-32 sm:text-5xl md:w-1/2 md:text-6xl">
            Sistema de Evaluación Basada en Proyectos
          </h1>
        </section>

        <section
          id="caracteristicas"
          className="bg-slate-900 px-6 py-10 sm:px-12"
        >
          <h1 className="mb-8 text-center text-3xl font-semibold text-slate-200 sm:text-4xl">
            Características
          </h1>

          <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Tarjeta
              titulo="Planificación y Seguimiento Ágil"
              descripcion="Registro detallado del Product Backlog y Sprint Backlog, incluyendo la planificación de entregables y su relación con los sprints."
              icono={archivos}
            />

            <Tarjeta
              titulo="Integración de Herramientas para Evaluación Centralizada"
              descripcion="Plataforma que combina planificación, evaluación y seguimiento en una interfaz unificada para simplificar la gestión y análisis del desempeño"
              icono={diploma}
            />

            <Tarjeta
              titulo="Generación de Planillas de Seguimiento y Evaluación"
              descripcion="Creación automática de planillas para evaluar los entregables según los sprints, con métricas basandose en fechas de entrega."
              icono={equipo}
            />

            <Tarjeta
              titulo="Gestión de Grupos y Equipos de Trabajo"
              descripcion="Registro de datos generales de cada grupo o equipo, incluyendo su composición y asignación a docentes."
              icono={estudiantes}
            />

            <Tarjeta
              titulo="Gestión de Resultados y Criterios Finales"
              descripcion="Registro y calificación de resultados según criterios finales predefinidos, como evaluación de fortalezas y debilidades individuales o grupales."
              icono={examen}
            />

            <Tarjeta
              titulo="Reportes Personalizados y Analíticos"
              descripcion="Generación de reportes de calificaciones parciales y totales, así como asistencia, categorizada por: Presente, Retraso, Ausencia Justificada y No Justificada."
              icono={prueba}
            />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
