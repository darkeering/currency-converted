import axios from "axios";

export const service = axios.create({
  timeout: 5000,
  responseType: "json",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});
service.interceptors.request.use((config) => {
  config.headers.token = `${localStorage.getItem("token")}`;
  return config;
});
service.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    const { response } = err;
    if (response.status === 401) {
      // router.push("/login");
    }
    // MessagePlugin.error(err.response.data);
    return Promise.reject(err);
  }
);
export const apiGetCurrencyConverted = () => {
  return service.get(`/api/v1/latest`);
};