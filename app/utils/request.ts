import axios, { type AxiosResponse } from 'axios';

import { useUserStore } from '#imports';

const axiosInstance = axios.create({
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosResponse) => {
    const originalRequestConfig = error.config;

    const userStore = useUserStore();

    if (error.status === 401) {
      await userStore.authenticate();

      originalRequestConfig.headers.Authorization = userStore.authToken;

      return axiosInstance(originalRequestConfig);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
