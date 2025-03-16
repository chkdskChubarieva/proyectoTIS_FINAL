import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import AuthUser from "../pageauth/AuthUser";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
//import Sidebar from '../components/grupo-empresa/sidebar'
import BarraLateralEst from "../components/BarraLateral/BarraLateralEst";
import "../components/layout.css";
import "../components/background.css";

const LayoutEstudiante = () => {
  const { getRol } = AuthUser();
  const navigate = useNavigate();

  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    if (getRol() != "estudiante") {
      navigate("/");
    }
  }, [getRol, navigate]);

  const botonesNavbar = () => {
    switch (location.pathname) {
      case "/estudiante":
        return [{ nombreBoton: "Inicio", hrefBoton: "#" }];
      case "/estudiante/registro":
        return [
          { nombreBoton: "Inicio", hrefBoton: "/estudiante" },
          { nombreBoton: "Registro", hrefBoton: "#" },
        ];
      case "/estudiante/unirse":
        return [
          { nombreBoton: "Inicio", hrefBoton: "/estudiante" },
          { nombreBoton: "Unirse", hrefBoton: "#" },
        ];
      default:
        return [];
    }
  };

  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <Navbar botones={botonesNavbar()} />
      <section className="conteiner-GE">
        <div className="content-container">
          <BarraLateralEst
            sidebarOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
          />
          <div className="layout-main">
            <Outlet />
          </div>
        </div>
      </section>
    </>
  );
};

export default LayoutEstudiante;
