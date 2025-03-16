import React, { useState } from "react";
import axios from "axios";

const CodeChecker = () => {
  const [code, setCode] = useState("");
  const [isUnique, setIsUnique] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    setCode(event.target.value);
    setIsUnique(null);
    setError(null);
  };

  const checkCode = async () => {
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/grupo-empresa/check-code/${code}`,
      );
      console.log("Respuesta de la API:", response.data);
      setIsUnique(response.data.isUnique);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setError("Hubo un error al verificar el código. Intente de nuevo.");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "400px",
        margin: "auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>Verificar Código de Empresa</h2>
      <input
        type="text"
        placeholder="Ingrese el código"
        value={code}
        onChange={handleInputChange}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          fontSize: "16px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      <button
        onClick={checkCode}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Verificar Código
      </button>

      {isUnique !== null && (
        <p style={{ marginTop: "10px", color: isUnique ? "green" : "red" }}>
          {isUnique ? "El código es único." : "El código ya existe."}
        </p>
      )}
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

export default CodeChecker;
