import { Link } from "react-router-dom";
import "./Sidebar.css";

import Build from "../../assets/empresa/building.svg";
import Calendar from "../../assets/empresa/calendar.svg";
import HomeIcon from "../../assets/empresa/home.svg";
import Pencil from "../../assets/empresa/pencil.svg";
import Person from "../../assets/empresa/person.svg";
import Vector from "../../assets/empresa/Vector.svg";

const SidebarDocente = () => {
  return (
    <nav className="sidebar-container">
      <p>sidebar temporal luego lo actualizo</p>
      <div>
        <Link to="/docente" exact="true" activeClassName="active">
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
            <Link to="empresas" activeClassName="active">
              <span role="img" aria-label="info" className="nav-aside">
                <img src={Vector} alt="Información" />
                <p>Proyectos</p>
              </span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="menu-group conteiner-nav">
        <span role="img" aria-label="planning" className="nav-aside aside-head">
          <img src={Person} alt="Planificación" />
          <p>Planificación</p>
        </span>
        <ul>
          <li>
            <Link to="" activeClassName="active">
              <span role="img" aria-label="calendar" className="nav-aside">
                <img src={Calendar} alt="Calendario" />
                <p>Planillas de evaluación</p>
              </span>
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <Link to="" activeClassName="active">
          <span role="img" aria-label="evaluations" className="nav-aside">
            <img src={Pencil} alt="Evaluaciones" />
            <p>Evaluaciones</p>
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default SidebarDocente;
