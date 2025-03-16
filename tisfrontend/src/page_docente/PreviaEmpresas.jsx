import { useEffect, useState } from "react";
import CardGrupoEmpresa from "../components/CardGrupoEmpresa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PreviaEmpresas = () => {
  const [grupoEmpresas, setGrupoEmpresas] = useState([]);
  const base_api_url = "http://localhost:8000/api/v1";
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${base_api_url}/docente/empresas`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setGrupoEmpresas(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las grupo empresas:", error);
      });
  }, []);

  const handleCardClick = (ID_empresa) => {
    navigate(`/docente/empresas/${ID_empresa}`);
  };

  return (
    <>
      <div className="container mx-auto px-6">
        <div className="my-4 rounded-md bg-primary-600 p-3 text-center">
          <span className="text-xl font-semibold text-white">
            Proyectos designados
          </span>
        </div>
        <article className="container grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {grupoEmpresas.length > 0 ? (
            grupoEmpresas.map((empresa) => (
              <div
                key={empresa.ID_empresa}
                onClick={() => handleCardClick(empresa.ID_empresa)}
              >
                <CardGrupoEmpresa
                  imagen={empresa.logo_empresa || "default-image-url.jpg"}
                  nombreGrupoEmpresa={empresa.nombre_empresa}
                />
              </div>
            ))
          ) : (
            <p>No hay grupo empresas registradas</p>
          )}
        </article>
      </div>
    </>
  );
};

export default PreviaEmpresas;
