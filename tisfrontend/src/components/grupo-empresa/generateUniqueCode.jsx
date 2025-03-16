import axios from "axios";

export const generateUniqueCode = async () => {
  const generateCode = () => {
    const letters = String.fromCharCode(
      65 + Math.floor(Math.random() * 26),
      65 + Math.floor(Math.random() * 26),
      65 + Math.floor(Math.random() * 26),
    );
    const numbers = Math.floor(1000 + Math.random() * 9000);
    return `${letters}${numbers}`;
  };

  let uniqueCode;
  let isUnique = false;

  while (!isUnique) {
    uniqueCode = generateCode();
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/grupo-empresa/check-code/${uniqueCode}`,
      );
      isUnique = response.data.isUnique;
    } catch (error) {
      console.error("Error checking unique code:", error);
      break;
    }
  }

  return uniqueCode;
};
