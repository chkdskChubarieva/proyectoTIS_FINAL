import axios from "axios";

axios.defaults.withCredentials = true;
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
const base_api_url = "http://localhost:8000/api/v1";

export default {
  //auth
  getRegister: (data) => axios.post(`${base_api_url}/auth/register`, data),
  getRegisterDoc: (data) =>
    axios.post(`${base_api_url}/auth/registerDoc`, data),
  getLogin: (data) => axios.post(`${base_api_url}/auth/login`, data),
  getLoginDoc: (data) => axios.post(`${base_api_url}/auth/loginDoc`, data),
  getLogout: () => axios.post(`${base_api_url}/auth/logout`),

  getInfoEst: () => axios.get(`${base_api_url}/estudiante/getInfoEst`),
  getInfoDoc: () => axios.get(`${base_api_url}/docente/getInfoDoc`),
};
