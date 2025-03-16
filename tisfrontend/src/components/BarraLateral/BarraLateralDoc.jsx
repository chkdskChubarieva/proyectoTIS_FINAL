/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams, useLocation, matchPath } from "react-router-dom";
import { Link } from "react-router-dom";
import BotonSidebar from "./BotonSidebar";
import { useNavigate } from "react-router-dom";
import "./BarraLateral.css";
import axios from "axios";
const BarraLateralDoc = ({ sidebarOpen, toggleSidebar }) => {
  const userData = JSON.parse(sessionStorage.getItem("user"));
  const userID = userData ? userData.ID_usuario : null;
  console.log("IDdocente", userID);
  const { id } = useParams(); // Obtener el ID_empresa de la URL
  const [sprintItems, setSprintItems] = useState([]);
  const [isSprintSubmenuOpen, setIsSprintSubmenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isOnSprintRoute =
    matchPath("/docente/empresas/:id/sprint", location.pathname) !== null;

  const isOnEmpresaRoute =
    matchPath("/docente/empresas/:id", location.pathname) !== null;

  const isOnBacklogRoute =
    matchPath("/docente/empresas/:id/backlog", location.pathname) !== null;

  const isOnEntregableRoute =
    matchPath("/docente/empresas/:id/planilla", location.pathname) !== null;

  useEffect(() => {
    if (id) {
      fetchSprints(id);
    }
  }, [id]);

  const fetchSprints = async (empresaId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/grupo-empresa/${empresaId}/sprints`,
      );
      setSprintItems(response.data.sprints || []);
      console.log(response.data.sprints);
    } catch (error) {
      console.error("Error al obtener los sprints:", error);
    }
  };

  


  const toggleSprintSubmenu = () => {
    setIsSprintSubmenuOpen(!isSprintSubmenuOpen);
  };
  const handleClick = (ID_empresa) => {
    navigate(`/docente/empresas/${ID_empresa}/backlog`);
  };

  const handleClickEvaluacion = (ID_empresa) => {
    navigate(`/docente/empresas/${ID_empresa}/planilla`);
  };

  return (
    <aside
      className={`sidebar w-72 space-y-5 bg-primary-600 p-5 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out md:translate-x-0`}
    >
      <div>
        <BotonSidebar toggleSidebar={toggleSidebar} />
      </div>

      

      <div className="border-t border-primary-300"></div>

      <div>
        <Link
          to="/docente"
          exact="true"
          activeClassName="active"
          className="flex items-center gap-3 px-3 py-2 font-semibold text-white transition-colors rounded bg-primary-500 hover:bg-primary-400"
        >
          <i className="fa-solid fa-house"></i>
          <p>Inicio</p>
        </Link>
      </div>

      <section className="px-3 py-2 font-semibold text-white transition-colors rounded bg-primary-500">
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-building"></i>
          <span>Grupo empresas</span>
        </div>
        <ul className="p-2">
          <li>
            <Link
              to="empresas"
              activeClassName="active"
              className="flex items-center gap-2 px-3 py-1 font-semibold text-white transition-colors rounded bg-primary-500 hover:bg-primary-400 text-nowrap"
            >
              <i className="fa-solid fa-users-line"></i>
              <p>Proyectos asignados</p>
            </Link>
          </li>
        </ul>
      </section>

      {(isOnSprintRoute ||
        isOnBacklogRoute ||
        isOnEmpresaRoute ||
        isOnEntregableRoute) && (
        <>
          <section className="px-3 py-2 font-semibold text-white transition-colors rounded bg-primary-500">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-person-chalkboard"></i>
              <span>Seguimiento</span>
            </div>
            <ul className="p-2">
              <li onClick={() => handleClickEvaluacion(id)}>
                <Link
                  activeClassName="active"
                  className="flex items-center text-nowrap gap-2 px-3 py-1 font-semibold text-white transition-colors rounded bg-primary-500 hover:bg-primary-400"
                >
                  <i className="fa-solid fa-table-cells"></i>
                  <p>Planilla de evaluación</p>
                </Link>
              </li>
              <li onClick={() => handleClick(id)}>
                <Link
                  activeClassName="active"
                  className="flex items-center gap-2 px-3 py-1 font-semibold text-white transition-colors rounded bg-primary-500 hover:bg-primary-400"
                  key={id}
                >
                  <i className="fa-solid fa-table-list"></i>
                  <p>Product Backlog</p>
                </Link>
              </li>

              <div
                onClick={toggleSprintSubmenu}
                className="flex items-center gap-2 px-3 py-1 font-semibold text-white transition-colors rounded bg-primary-500 hover:bg-primary-400"
              >
                <i className="fa-solid fa-table"></i>
                <p>Planificación Sprint</p>
              </div>

              {isSprintSubmenuOpen && (
                <ul className="space-y-1 font-normal rounded ml-9">
                  {sprintItems.length > 0 ? (
                    sprintItems.map((sprint) => (
                      <li
                        key={sprint.ID_sprint}
                        className="p-1 pl-3 text-white transition-colors rounded hover:bg-primary-400"
                      >
                        <Link
                          to={`/docente/empresas/${sprint.ID_sprint}/sprint`}
                          className="nav-aside"
                        >
                          <p>{sprint.nombre_sprint}</p>
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li>
                      <p>No hay sprints asignados</p>
                    </li>
                  )}
                </ul>
              )}
            </ul>
          </section>
        </>
      )}

      <div>
        <Link
          to="/docente/evaluaciones"
          exact="true"
          activeClassName="active"
          className="flex items-center gap-3 px-3 py-2 font-semibold text-white transition-colors rounded bg-primary-500 hover:bg-primary-400"
        >
          <i className="fa-solid fa-pencil"></i>
          <p>Evaluaciones</p>
        </Link>
      </div>
    </aside>
  );
};

export default BarraLateralDoc;
