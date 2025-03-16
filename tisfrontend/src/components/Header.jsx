/* eslint-disable react/prop-types */
import { useLocation } from "react-router-dom";
import logo_umss from "../assets/img/logo-umss.png";
import logo_umss_simple from "../assets/img/logo-umss-simple.png";
import BotonHeader from "./BotonHeader";
import BotonUserEst from "./BotonUserEst";
import BotonUserDoc from "./BotonUserDoc";
import BotonSidebar from "./BarraLateral/BotonSidebar";

const Header = ({ toggleSidebar }) => {
  const location = useLocation(); // Obtenemos la ruta actual

  // insertaar aqui las rutas donde se debe mostrar un boton en especifico
  const rutasLogin = ["/login"];
  const rutasRegister = ["/register", "/"];
  const rutasEstudiante = ["/estudiante"];
  const rutasDocente = ["/docente"];

  // aqui tambien
  const esLogin = rutasLogin.includes(location.pathname);
  const esRegister = rutasRegister.includes(location.pathname);
  const esPanelEst = rutasEstudiante.some((ruta) =>
    location.pathname.startsWith(ruta),
  );
  const esPanelDoc = rutasDocente.some((ruta) =>
    location.pathname.startsWith(ruta),
  );

  return (
    <>
      <header id="inicio" className="fixed top-0 z-20 h-20 w-full">
        <div className="fila-1 flex h-20 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <BotonSidebar toggleSidebar={toggleSidebar} />

            <div className="rounded bg-white px-3 py-1">
              <img className="w-8 sm:hidden" src={logo_umss_simple} alt="" />
              <img
                className="hidden w-28 sm:block"
                src={logo_umss}
                alt="logo-umss"
              />
            </div>
          </div>

          <span className="text-xl font-bold text-slate-200 sm:text-2xl">
            EBEP - UMSS
          </span>

          <div className="rounded-md font-semibold text-slate-200">
            {esLogin ? (
              <BotonHeader
                hrefBoton={"/register"}
                nombreBoton={"Registrarse"}
              />
            ) : esRegister ? (
              <BotonHeader
                hrefBoton={"/login"}
                nombreBoton={"Iniciar sesión"}
              />
            ) : esPanelEst ? (
              <BotonUserEst />
            ) : esPanelDoc ? (
              <BotonUserDoc />
            ) : null}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
