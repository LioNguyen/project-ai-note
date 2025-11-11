import axios from "axios";

export const createAxios = () => {
  const newInstance = axios.create();
  newInstance.interceptors.request.use(
    async (config) => {
      return config;
    },
    (err) => {
      return Promise.reject(err);
    },
  );

  return newInstance;
};
