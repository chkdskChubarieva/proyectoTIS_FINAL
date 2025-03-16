import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./JoinGroupForm.css";
import Icon from "../../assets/empresa/zorro.png";

const initialState = {
  groupCode: "",
  message: "",
  error: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_CODE":
      return { ...state, groupCode: action.payload };
    case "SET_MESSAGE":
      return { ...state, message: action.payload, error: action.error };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const JoinGroupForm = () => {
  const userData = JSON.parse(sessionStorage.getItem("user"));
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const handleJoinClick = async () => {
    if (!state.groupCode) {
      dispatch({
        type: "SET_MESSAGE",
        payload: "Por favor ingresa un código de grupo",
        error: true,
      });
      return;
    }

    const userID = userData;
    if (!userID) {
      dispatch({
        type: "SET_MESSAGE",
        payload: "No se pudo obtener la información del usuario.",
        error: true,
      });
      return;
    }

    const groupData = await fetchGroupData(state.groupCode, userID);
    if (groupData) {
      await joinGroup(userID, groupData.ID_empresa);
      dispatch({
        type: "SET_MESSAGE",
        payload: `Te has unido exitosamente al grupo con código: ${state.groupCode}`,
        error: false,
      });
      navigate("/estudiante/product-backlog");
      window.location.reload();
    } else {
      dispatch({
        type: "SET_MESSAGE",
        payload: "Código de grupo no válido",
        error: true,
      });
    }
  };

  const joinGroup = async (userID, idEmpresa) => {
    try {
      console.log("Obterner id user:", userID, "hola", idEmpresa, "CODIGO", state.groupCode)
      const response = await axios.put(`http://localhost:8000/api/v1/estudiantes/${userID.ID_usuario}/grupo-empresa`,
        {
          codigo: state.groupCode,
          ID_usuario: userID.ID_usuario,
        },
      );
      console.log("Estudiante actualizado:", response.data);
    } catch (error) {
      dispatch({
        type: "SET_MESSAGE",
        payload: "Error al actualizar el estudiante",
        error: true,
      });
      console.error("Error al actualizar el estudiante:", error);
    }
  };

  const fetchGroupData = async (code, userID) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/grupo-empresa/data/${code}?userID=${userID.ID_usuario}`,
      );
      console.log("Datos de la grupo empresa:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener datos de la grupo empresa:", error);
      return null;
    }
  };

  return (
    <section className="form-container">
      <div className="container-form">
        <article className="input-code">
          <h2>Unirse a grupo-empresa</h2>
          <p>Código de grupo-empresa</p>
          <input
            type="text"
            placeholder="Código de grupo-empresa"
            value={state.groupCode}
            onChange={(e) =>
              dispatch({ type: "SET_CODE", payload: e.target.value })
            }
            className="input"
          />
          <button onClick={handleJoinClick} className="button">
            Unirse
          </button>
        </article>
        <img src={Icon} alt="Logo de grupo" className="form-icon" />
        {state.message && (
          <p className={`message ${state.error ? "error" : "success"}`}>
            {state.message}
          </p>
        )}
      </div>
    </section>
  );
};

export default JoinGroupForm;
