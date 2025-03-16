import axios from "axios";

export const getLogout = async () => {
  const token = localStorage.getItem("token");
  return await axios.post(
    "http://localhost:8000/api/v1/auth/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    },
  );
};
