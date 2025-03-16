import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import InfoUsuario from "../components/InfoUsuario";
import PlaceholderIMG from "../assets/img/no-image.jpg";
import { useNavigate } from "react-router-dom";
import "../components/background.css";

const InfoGrupoEmpresa = () => {
  const { id } = useParams();
  const [empresa, setEmpresa] = useState(null);
  const [cantEstudiantes, setCantEstudiantes] = useState(null);
  const navigate = useNavigate();
  const base_api_url = "http://localhost:8000/api/v1";

  useEffect(() => {
    axios
      .get(`${base_api_url}/docente/empresas/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        // Asigna los valores correspondientes a cada estado
        setEmpresa(response.data.empresa);
        setCantEstudiantes(response.data.cantidad_estudiantes);
      })
      .catch((error) => {
        console.error("Error al obtener los datos de la empresa:", error);
      });
  }, [id]);

  if (!empresa) {
    return <p>Cargando datos de la empresa...</p>;
  }

  const handleClick = (ID_empresa) => {
    navigate(`/docente/empresas/${ID_empresa}/backlog`);
  };

  const handleClickPlanilla = (ID_empresa) => {
    navigate(`/docente/empresas/${ID_empresa}/planilla`);
  };

  return (
    <section className="w-full bg-white pt-8">
      <div className="mx-auto w-fit">
        <article className="mx-auto mb-8 rounded-md bg-primary-600 px-6 py-5 text-white lg:mb-0">
          <h1 className="mb-8 flex justify-center text-xl font-semibold lg:mb-4">
            Información de grupo-empresa
          </h1>
          <section className="flex flex-col gap-5 lg:flex-row lg:gap-10">
            <div className="order-last min-w-96 max-w-fit space-y-2 lg:order-first">
              <InfoUsuario
                icono={<i className="fa-solid fa-building"></i>}
                titulo={"Grupo-empresa: "}
                info={empresa.nombre_empresa}
              />

              <InfoUsuario
                icono={<i className="fa-solid fa-user"></i>}
                titulo={"Representante legal: "}
                info={empresa.nombre_representante}
              />

              <InfoUsuario
                icono={<i className="fa-solid fa-envelope"></i>}
                titulo={"Correo electrónico: "}
                info={empresa.correo_empresa}
              />

              <InfoUsuario
                icono={<i className="fa-solid fa-building"></i>}
                titulo={"Teléfono: "}
                info={empresa.telf_representante}
              />

              <InfoUsuario
                icono={<i className="fa-solid fa-users"></i>}
                titulo={"Cantidad de miembros: "}
                info={cantEstudiantes}
              />

              <InfoUsuario
                icono={<i className="fa-solid fa-building"></i>}
                titulo={"Código: "}
                info={empresa.codigo}
              />
            </div>

            <div className="relative flex items-center justify-center overflow-hidden rounded-3xl">
              <img
                src={PlaceholderIMG}
                className="absolute size-40 rounded-3xl object-cover"
              />
              <img
                src={empresa.logo_empresa}
                className="relative size-40 rounded-3xl object-cover"
                loading="lazy"
              />
            </div>
          </section>

          <section className="mt-5 flex flex-col gap-3 lg:flex-row lg:gap-5">
            <button
              type="button"
              className="w-full rounded bg-primary-500 p-2 text-lg font-semibold text-white transition-colors hover:bg-primary-400"
              key={empresa.ID_empresa}
              onClick={() => handleClick(empresa.ID_empresa)}
            >
              Ver product backlog
            </button>

            <button
              type="button"
              className="w-full rounded bg-primary-500 p-2 text-lg font-semibold text-white transition-colors hover:bg-primary-400"
              onClick={() => handleClickPlanilla(empresa.ID_empresa)}
            >
              Ver planilla de evaluación
            </button>
          </section>
        </article>
      </div>
    </section>
  );
};

export default InfoGrupoEmpresa;
