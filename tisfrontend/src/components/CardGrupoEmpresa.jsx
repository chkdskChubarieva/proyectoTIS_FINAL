/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";

const CardGrupoEmpresa = ({ nombreGrupoEmpresa, imagen }) => {
  const navigate = useNavigate();

  const clic = () => {
    navigate("/docente/grupo-empresa");
  };

  return (
    <>
      <div
        className="flex cursor-pointer select-none flex-col overflow-hidden rounded-md shadow-md transition-all hover:scale-95"
        onClick={clic}
      >
        <div className="h-36 bg-slate-200">
          <img
            className="h-full w-full object-cover" //cambiar entre cover o contain para ver cual queda mejor
            src={imagen}
            alt="logo-grupoempresa"
          />
        </div>
        <div className="bg-primary-600 px-3 py-4 text-center">
          <span className="text-lg font-semibold text-white">
            {nombreGrupoEmpresa}
          </span>
        </div>
      </div>
    </>
  );
};

export default CardGrupoEmpresa;
