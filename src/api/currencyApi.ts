import axios from "axios";
import { CURRENCY_HISTORY, CURRENCY_RATES_CACHE } from "../lib/const";

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
  return service.get(`/api/v1/latest`).then((res) => {
    localStorage.setItem(CURRENCY_RATES_CACHE, JSON.stringify({ data: res.data.rates, timestamp: Date.now() }));
    return res.data.rates;
  });
};

export const apiGetCurrencyHistory = (from: string, to: string) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 6);
  const format = (d: Date) => d.toISOString().slice(0, 10);

  const start = format(startDate);
  const end = format(endDate);
  return service.get(`/api/v1/${start}..${end}?from=${from}&to=${to}`).then((res) => {
    const data = Object.keys(res.data.rates).map((date) => ({
      date,
      rate: res.data.rates[date][to],
    }));
    localStorage.setItem(
      from + to + CURRENCY_HISTORY,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );
    return data;
  });
};
