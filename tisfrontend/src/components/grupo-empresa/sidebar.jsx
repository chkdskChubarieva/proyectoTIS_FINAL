import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import Address from "../../assets/empresa/address.svg";
import Bracket from "../../assets/empresa/bracket.svg";
import Build from "../../assets/empresa/building.svg";
import Calendar from "../../assets/empresa/calendar.svg";
import HomeIcon from "../../assets/empresa/home.svg";
import Pencil from "../../assets/empresa/pencil.svg";
import Person from "../../assets/empresa/person.svg";
import Vector from "../../assets/empresa/Vector.svg";
import Sprint from "../../assets/empresa/sprint.png";
import axios from "axios";

const Sidebar = () => {
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
        console.log("esta es la data", estudianteData);
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
  // };

  return (
    <nav className="sidebar-container">
      {grupoEmpresa && dataGrupoEmpresa && (
        <div className="logotipo-grupoempresa">
          <img
            src={dataGrupoEmpresa.grupo_empresa.logo_empresa}
            alt="Logo Grupo Empresa"
          />
          <p>{dataGrupoEmpresa.grupo_empresa.nombre_empresa}</p>
        </div>
      )}

      <div>
        <Link
          to="/estudiante"
          className={({ isActive }) =>
            (isActive ? "active" : "") || "default-class"
          }
        >
          <span role="img" aria-label="home" className="nav-aside">
            <img src={HomeIcon} alt="Inicio" />
            <p>Inicio</p>
          </span>
        </Link>
      </div>

      <div className="line"></div>

      <div className="menu-group conteiner-nav">
        <span role="img" aria-label="group" className="nav-aside aside-head">
          <img src={Build} alt="Grupo Empresa" />
          <p>Grupo Empresa</p>
        </span>
        <ul>
          <li>
            <Link
              to="./info"
              className={({ isActive }) =>
                (isActive ? "active" : "") || "default-class"
              }
            >
              <span role="img" aria-label="info" className="nav-aside">
                <img src={Vector} alt="Información" />
                <p>Información</p>
              </span>
            </Link>
          </li>
          {!grupoEmpresa && (
            <>
              <li>
                <Link
                  to="./registro"
                  className={({ isActive }) =>
                    (isActive ? "active" : "") || "default-class"
                  }
                >
                  <span role="img" aria-label="register" className="nav-aside">
                    <img src={Address} alt="Registro" />
                    <p>Registro</p>
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="./unirse"
                  className={({ isActive }) =>
                    (isActive ? "active" : "") || "default-class"
                  }
                >
                  <span role="img" aria-label="join" className="nav-aside">
                    <img src={Bracket} alt="Unirse" />
                    <p>Unirse</p>
                  </span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="menu-group conteiner-nav">
        <span role="img" aria-label="planning" className="nav-aside aside-head">
          <img src={Person} alt="Planificación" />
          <p>Planificación</p>
        </span>
        <ul>
          <li>
            <Link
              to="./product-backlog"
              className={({ isActive }) =>
                (isActive ? "active" : "") || "default-class"
              }
            >
              <span role="img" aria-label="calendar" className="nav-aside">
                <img src={Sprint} alt="Calendario" />
                <p>Product backlog</p>
              </span>
            </Link>
          </li>
          <li>
            <div
              onClick={toggleSprintSubmenu}
              className="nav-aside nav-submenu"
            >
              <img src={Sprint} alt="Registro Sprint" />
              <p>Registro Sprint</p>
            </div>
            {isSprintSubmenuOpen && (
              <ul className="submenu">
                {sprintItems.length > 0 ? (
                  sprintItems.map((sprint) => (
                    <li key={sprint.ID_sprint}>
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
      </div>

      <div>
        <Link
          to="./evaluations"
          className={({ isActive }) =>
            (isActive ? "active" : "") || "default-class"
          }
        >
          <span role="img" aria-label="evaluations" className="nav-aside">
            <img src={Pencil} alt="Evaluaciones" />
            <p>Evaluaciones</p>
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default Sidebar;
