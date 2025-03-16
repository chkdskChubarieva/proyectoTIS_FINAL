/* eslint-disable react/prop-types */

const InfoUsuario = ({ icono, titulo, info }) => {
  return (
    <>
      <div className="flex text-lg">
        <div className="w-8">{icono}</div>

        <span>
          <strong className="font-semibold">{titulo}</strong>
          {info}
        </span>
      </div>
    </>
  );
};

export default InfoUsuario;
