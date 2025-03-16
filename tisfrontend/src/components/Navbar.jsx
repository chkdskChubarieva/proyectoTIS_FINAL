/* eslint-disable react/prop-types */
import BotonNavbar from "./BotonNavbar";

const Navbar = ({ botones = [] }) => {
  return (
    <div className="fila-2 fixed top-20 z-10 flex h-12 w-full items-center justify-center bg-slate-200">
      <ul className="text-md flex h-full items-center gap-2 font-semibold text-slate-500 sm:gap-4">
        {botones.map((boton, index) => (
          <BotonNavbar
            key={index}
            nombreBoton={boton.nombreBoton}
            hrefBoton={boton.hrefBoton}
          />
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
