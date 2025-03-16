/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PlaceholderIMG from "../../assets/img/no-image.jpg";
import BotonSidebar from "./BotonSidebar";
import "./BarraLateral.css";
import axios from "axios";

const BarraLateralEst = ({ sidebarOpen, toggleSidebar }) => {
  const [grupoEmpresa, setGrupoEmpresa] = useState(false);
  const [infEstudiante, setInfEstudiante] = useState(null);
  const [dataGrupoEmpresa, setDataGrupoEmpresa] = useState(null);
  const [sprintItems, setSprintItems] = useState([]);
  const [isSprintSubmenuOpen, setIsSprintSubmenuOpen] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("user"));
    const userID = userData ? userData.ID_usuario : null;

    if (userID) {
      fetchInformacionEstudiante(userID);
    }
  }, []);

  const fetchInformacionEstudiante = async (userID) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/estudiante/${userID}`,
      );
      const estudianteData = response.data.data;
      if (estudianteData.ID_empresa) {
        setGrupoEmpresa(true);
        // console.log("esta es la data", estudianteData);
        setDataGrupoEmpresa(estudianteData);
        fetchSprints(estudianteData.ID_empresa);
      }
    } catch (error) {
      console.error("Error fetching estudiante info:", error);
    }
  };

  const fetchSprints = async (empresaId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/grupo-empresa/${empresaId}/sprints`,
      );
      setSprintItems(response.data.sprints || []);
    } catch (error) {
      console.error("Error fetching sprints:", error);
    }
  };

  const toggleSprintSubmenu = () => {
    setIsSprintSubmenuOpen(!isSprintSubmenuOpen);
  };

  // if (userID) {
  //     fetchInformacionEstudiante(userID)
  //       .then((data) => {
  //         setInfEstudiante(data);
  //         if (data?.ID_empresa != null) {
  //           setGrupoEmpresa(true);
  //           fetchGrupoEmpresa(data.ID_empresa);
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching estudiante info:", error);
  //       });
  //   }
  // }, []);

  // const fetchInformacionEstudiante = async (userID) => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:8000/api/v1/estudiante/${userID}`,
  //     );
  //     return response.data.data;
  //   } catch (error) {
  //     console.error("There was an error fetching the estudiante!", error);
  //     return null;
  //   }
  // };

  // const fetchGrupoEmpresa = async (id) => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:8000/api/v1/grupo-empresa/${id}`,
  //     );
  //     setDataGrupoEmpresa(response.data.data);
  //   } catch (error) {
  //     console.error("Error fetching Grupo Empresa:", error);
  //   }
  // }

  return (
    <aside
      className={`sidebar w-72 space-y-5 bg-primary-600 p-5 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out md:translate-x-0`}
    >
      <div>
        <BotonSidebar toggleSidebar={toggleSidebar} />
      </div>
      {grupoEmpresa && dataGrupoEmpresa && (
        <div className="flex items-center gap-3 py-2">
          <img
            className="overflow-hidden rounded size-12"
            src={dataGrupoEmpresa.grupo_empresa.logo_empresa}
            alt="logo-empresa"
          />
          <p className="text-lg font-semibold text-white">
            {dataGrupoEmpresa.grupo_empresa.nombre_empresa}
          </p>
        </div>
      )}

      <div className="border-t border-primary-300"></div>

      <div>
        <Link
          to="/estudiante"
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
          <span>Grupo empresa</span>
        </div>
        <ul className="p-2">
          {grupoEmpresa && dataGrupoEmpresa && (
            <li>
              <Link
                to="/estudiante/info"
                activeClassName="active"
                className="flex items-center gap-2 px-3 py-1 font-semibold text-white transition-colors rounded bg-primary-500 hover:bg-primary-400"
              >
                <i className="fa-solid fa-circle-info"></i>
                <p>Información</p>
              </Link>
            </li>
          )}

          {!grupoEmpresa && (
            <>
              <li>
                <Link
                  to="./registro"
                  activeClassName="active"
                  className="flex items-center gap-2 px-3 py-1 font-semibold text-white transition-colors rounded bg-primary-500 hover:bg-primary-400"
                >
                  <i className="fa-solid fa-address-card"></i>
                  <p>Registro</p>
                </Link>
              </li>

              <li>
                <Link
                  to="./unirse"
                  activeClassName="active"
                  className="flex items-center gap-2 px-3 py-1 font-semibold text-white transition-colors rounded bg-primary-500 hover:bg-primary-400"
                >
                  <i className="fa-solid fa-right-to-bracket"></i>
                  <p>Unirse</p>
                </Link>
              </li>
            </>
          )}
        </ul>
      </section>

      <section className="px-3 py-2 font-semibold text-white transition-colors rounded bg-primary-500">
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-person-chalkboard"></i>
          <span>Planificación</span>
        </div>
        <ul className="p-2">
          <li>
            <Link
              to="./product-backlog"
              activeClassName="active"
              className="flex items-center gap-2 px-3 py-1 font-semibold text-white transition-colors rounded bg-primary-500 hover:bg-primary-400"
            >
              <i className="fa-solid fa-table-list"></i>
              <p>Product backlog</p>
            </Link>
          </li>

          <li>
            {/* <Link
              to="./registro-sprint"
              activeClassName="active"
              className="flex items-center gap-2 px-3 py-1 font-semibold text-white transition-colors rounded bg-primary-500 hover:bg-primary-400"
            >
              <i className="fa-solid fa-address-card"></i>
              <p>Registro sprint</p>
            </Link> */}
            <div
              onClick={toggleSprintSubmenu}
              className="flex items-center gap-2 px-3 py-1 font-semibold text-white transition-colors rounded select-none bg-primary-500 hover:bg-primary-400"
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
                        to={`./sprint/${sprint.ID_sprint}`}
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
          </li>
        </ul>
      </section>

      <section className="px-3 py-2 font-semibold text-white transition-colors rounded bg-primary-500">
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-pencil"></i>
          <span>Evaluaciones</span>
        </div>

        <ul className="p-2">
          <li>
            {grupoEmpresa && dataGrupoEmpresa ? (
              <Link
                to={`./${dataGrupoEmpresa.grupo_empresa.ID_empresa}/planilla`}
                className="flex items-center gap-3 px-3 py-1 font-semibold text-white transition-colors rounded bg-primary-500 hover:bg-primary-400"
              >
                <i className="fa-solid fa-pencil"></i>
                <p>Notas</p>
              </Link>
            ) : (
              <div className="flex items-center gap-3 px-3 py-1 text-gray-400">
                <i className="fa-solid fa-pencil"></i>
                <p>Notas</p>
              </div>
            )}
          </li>

          <li>
            <Link
              to="/estudiante/evaluaciones"
              exact="true"
              activeClassName="active"
              className="flex items-center gap-3 px-3 py-1 font-semibold text-white transition-colors rounded bg-primary-500 hover:bg-primary-400"
            >
              <i className="fa-solid fa-pencil"></i>
              <p>Autoevaluaciones</p>
            </Link>
          </li>
        </ul>
      </section>
    </aside>
  );
};

export default BarraLateralEst;
