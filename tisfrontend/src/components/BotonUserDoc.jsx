import { useState, useEffect, useRef } from "react";
import BotonLogout from "./BotonLogout";
import Config from "../Config";

const BotonUserDoc = () => {
  const [docente, setDocente] = useState({});

  useEffect(() => {
    getInfoDoc();
  }, []);

  const getInfoDoc = async () => {
    try {
      const response = await Config.getInfoDoc();
      console.log(response);
      setDocente(response.data);
    } catch (error) {
      console.error("Error al obtener la información del docente:", error);
    }
  };

  const [mostrarLogout, setMostrarLogout] = useState(false);
  const userRef = useRef(null);
  const toggleLogout = () => {
    setMostrarLogout(!mostrarLogout);
  };

  useEffect(() => {
    // Funcion que oculta el div si se hace clic fuera
    const handleClickOutside = (event) => {
      if (userRef.current && !userRef.current.contains(event.target)) {
        setMostrarLogout(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="relative" ref={userRef}>
        <div
          className="flex cursor-pointer select-none items-center gap-2 rounded bg-white bg-opacity-0 p-2 transition-all hover:bg-opacity-5 hover:shadow"
          onClick={toggleLogout}
        >
          <span className="hidden text-lg font-normal sm:block">Docente</span>
          <img
            src={`https://ui-avatars.com/api/?size=40&bold=true&rounded=true&name=${docente.nombre}+${docente.apellido}`}
            alt="avatar"
          />
        </div>

        {mostrarLogout && (
          <div className="absolute right-0 top-full mt-2 flex w-56 flex-col rounded bg-white bg-opacity-90 p-3 text-center shadow-md">
            <div className="flex flex-col leading-tight">
              <span className="text-neutral-800">{`${docente.nombre} ${docente.apellido}`}</span>
              <span className="block font-bold text-neutral-700 sm:hidden">
                Docente
              </span>
            </div>
            <div className="my-2 border-t border-neutral-400" />
            <BotonLogout hrefBoton={"#"} nombreBoton={"Cerrar sesión"} />
          </div>
        )}
      </div>
    </>
  );
};

export default BotonUserDoc;
