import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AuthUser from "../pageauth/AuthUser";

import Header from "../components/Header";
import Navbar from "../components/Navbar";
//import SidebarDocente from "../components/grupo-empresa/SidebarDocente";
import BarraLateralDoc from "../components/BarraLateral/BarraLateralDoc";
import "../components/layout.css";
import "../components/background.css";

const LayoutDocente = () => {
  const { getRol } = AuthUser();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    if (getRol() != "docente") {
      navigate("/");
    }
  }, [getRol, navigate]);

  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <Navbar />
      <section className="conteiner-GE">
        <div className="content-container">
          <BarraLateralDoc
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

export default LayoutDocente;
