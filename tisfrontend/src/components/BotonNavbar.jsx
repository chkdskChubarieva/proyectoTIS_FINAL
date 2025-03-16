/* eslint-disable react/prop-types */

const BotonNavbar = ({ nombreBoton, hrefBoton }) => {
  return (
    <li className="flex h-full items-center px-3 transition-colors hover:bg-slate-100">
      <a href={hrefBoton}>{nombreBoton}</a>
    </li>
  );
};

export default BotonNavbar;
