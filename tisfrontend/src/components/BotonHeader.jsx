/* eslint-disable react/prop-types */

const BotonHeader = ({ hrefBoton, nombreBoton }) => {
  return (
    <a
      href={hrefBoton}
      className="rounded bg-white bg-opacity-5 p-2 transition-all hover:bg-opacity-10 hover:shadow"
    >
      {nombreBoton}
    </a>
  );
};

export default BotonHeader;
