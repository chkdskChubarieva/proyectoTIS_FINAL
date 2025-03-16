import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LayoutPublic from "./layouts/LayoutPublic";
import PageHome from "./pagepublic/PageHome";
import LayoutEstudiante from "./layouts/LayoutEstudiante";
import LayoutDocente from "./layouts/LayoutDocente";
import ProtectedRoutes from "./pageauth/ProtectedRoutes";
import Register from "./pageauth/Register";
import InicioEst from "./page_estudiante/InicioEst";
import InicioDoc from "./page_docente/InicioDoc";
import Login from "./pageauth/Login";

import JoinGroupForm from "./components/grupo-empresa/JoinGroupForm";
import RegistroEmpresa from "./components/grupo-empresa/RegistroEmpresa";
import SprintPlanning from "./components/grupo-empresa/SprintPlanning";
import ProductBacklog from "./components/grupo-empresa/ProductBacklog";
import InfoGrupoEmpresa from "./page_docente/InfoGrupoEmpresa";

import "./app.css";
import PreviaEmpresas from "./page_docente/PreviaEmpresas";
import Cloudinary from "./components/Cloudinary";
import InfoEmpresa from "./page_estudiante/InfoEmpresa";
import VistaBacklog from "./page_docente/VistaBacklog";
//import InfoEmpresa from "./page_docente/InfoEmpresa";
import PlanillaEvaluacion from "./page_docente/PlanillaEvaluacion";
import VistaPlanificacion from "./page_docente/VistaPlanificacion";
import Evaluaciones from "./page_docente/Evaluaciones";
import EvaluacionesEst from "./page_estudiante/EvaluacionesEst";
import PlanillaEst from "./page_estudiante/PlanillaEst";

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LayoutPublic />}>
          <Route index element={<PageHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/prueba" element={<Cloudinary />} />
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route path="/estudiante" element={<LayoutEstudiante />}>
            <Route path="" element={<InicioEst />} />
            <Route path="info" element={<InfoEmpresa />} />
            <Route path="registro" element={<RegistroEmpresa />} />
            <Route path="unirse" element={<JoinGroupForm />} />
            <Route path="calendario" element={<JoinGroupForm />} />
            <Route path="registro-sprint" element={<SprintPlanning />} />
            <Route path="product-backlog" element={<ProductBacklog />} />
            <Route path="sprint/:id" element={<SprintPlanning />} />
            <Route path="evaluaciones" element={<EvaluacionesEst />} />
            <Route path=":id/planilla" element={<PlanillaEst />} />
          </Route>
          <Route path="/docente" element={<LayoutDocente />}>
            <Route index element={<InicioDoc />} />
            <Route path="/docente/empresas" element={<PreviaEmpresas />} />
            <Route
              path="/docente/empresas/:id"
              element={<InfoGrupoEmpresa />}
            />
            <Route
              path="/docente/empresas/:id/backlog"
              element={<VistaBacklog />}
            />
            <Route
              path="/docente/empresas/:id/planilla"
              element={<PlanillaEvaluacion />}
            />
            <Route
              path="/docente/empresas/:id/sprint"
              element={<VistaPlanificacion />}
            />
            <Route path="/docente/evaluaciones" element={<Evaluaciones />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App; // Exportación por defecto
