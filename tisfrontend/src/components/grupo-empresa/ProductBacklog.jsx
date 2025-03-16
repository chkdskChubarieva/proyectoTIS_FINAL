import { useState, useEffect } from "react";
import ItemBacklog from "./ItemBacklog";
import ItemTablaSprint from "./ItemTablaSprint";
import ModalCrearHU from "./ModalCrearHU";
import "./RegistroEmpresa.css";
import { useNavigate } from "react-router-dom";
import ModalNuevoSprint from "./ModalNuevoSprint";
import axios from "axios";
import "./ProductBacklog.css";

const ProductBacklog = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSprintOpen, setIsModalSprintOpen] = useState(false);
  const [backlogItems, setBacklogItems] = useState([]);
  const [empresaId, setEmpresaId] = useState(null);
  const [sprintItems, setSprintItems] = useState([]);

  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/grupo-empresa/${empresaId}/sprints`,
        );
        console.log("Sprints response:", response.data);
        setSprintItems(response.data.sprints || []);
      } catch (error) {
        console.error("Error fetching sprints:", error);
      }
    };

    if (empresaId) {
      fetchSprints();
    }
  }, [empresaId]);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("user"));
    const userId = userData ? userData.ID_usuario : null;

    const fetchCompanyId = async () => {
      try {
        console.log(userId);
        const response = await axios.get(
          `http://localhost:8000/api/v1/estudiantes/usuario/${userId}`,
        );
        console.log("datos import", response.data);
        if (response.data.data.ID_empresa) {
          setEmpresaId(response.data.data.ID_empresa);
        }
      } catch (error) {
        console.error("Error al obtener el ID de la empresa:", error);
      }
    };

    if (userId) {
      fetchCompanyId();
    }
  }, []);

  useEffect(() => {
    const fetchBacklog = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/grupo-empresa/${empresaId}/historias`,
        );
        console.log("Respuesta de la API:", response.data);
        setBacklogItems(response.data.historias || response.data);
      } catch (error) {
        console.error("Error al obtener el backlog del producto:", error);
      }
    };

    if (empresaId) {
      console.log("ID de la empresa:", empresaId);
      fetchBacklog();
    }
  }, [empresaId]);

  console.log("este es elitem:", backlogItems);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openModalSprint = () => setIsModalSprintOpen(true);
  const closeModalSprint = () => setIsModalSprintOpen(false);

  return (
    <>
      {isModalSprintOpen && (
        <ModalNuevoSprint closeModal={closeModalSprint} empresaId={empresaId} />
      )}
      {isModalOpen && <ModalCrearHU closeModal={closeModal} />}
      <div className="product-backlog mx-auto w-full px-10 py-6 xl:max-w-7xl">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold text-primary-800">
            Product Backlog
          </h1>
          <button
            type="button"
            className="space-x-2 rounded-md bg-primary-500 p-2 text-white transition-colors hover:bg-primary-400"
            onClick={openModal}
          >
            <i className="fa-solid fa-plus"></i>
            <span>Historia de usuario</span>
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-8 lg:flex lg:flex-row">
          <section className="tabla-backlog order-last h-fit flex-1 rounded-md border-2 border-neutral-300 lg:order-first">
            <div className="flex justify-between border-b-2 border-neutral-300 px-6 py-3 font-semibold text-primary-800">
              <span>Historia de usuario</span>
              <span># Sprint</span>
            </div>

            <div className="space-y-2 p-3">
              {backlogItems.length > 0 ? (
                backlogItems.map((item) => (
                  <ItemBacklog
                    key={item.ID_historia}
                    id_hu={item.ID_historia}
                    nombre_hu={item.titulo} // Ajusta según campo correcto
                    num_sprint={item.sprint.nombre_sprint || "No asignado"}
                  />
                ))
              ) : (
                <p>No hay historias de usuario en el backlog</p>
              )}
            </div>
          </section>

          <section className="h-fit rounded-md border-2 border-neutral-300 lg:w-64">
            <div className="flex justify-between border-b-2 border-neutral-300 px-6 py-3 font-semibold text-primary-800">
              <span>Sprints</span>
              <button
                type="button"
                className="flex size-6 items-center justify-center rounded border-2 border-primary-200 text-primary-200 transition-colors hover:border-primary-500 hover:text-primary-500"
                onClick={openModalSprint}
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>

            <div className="space-y-2 p-3">
              {sprintItems.length > 0 ? (
                sprintItems.map((sprint) => (
                  <ItemTablaSprint
                    key={sprint.ID_sprint}
                    nombre_sprint={sprint.nombre_sprint}
                  />
                ))
              ) : (
                <p>No hay sprints asignados</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ProductBacklog;
