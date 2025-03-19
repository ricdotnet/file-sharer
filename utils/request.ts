import axios, { type AxiosResponse } from 'axios';
import { useUserStore, navigateTo } from '#imports';

const axiosInstance = axios.create({});

axiosInstance.interceptors.response.use(
  response => response,
  async (response: AxiosResponse) => {
    const originalRequestConfig = response.config;

    const userStore = useUserStore();

    if (response.status === 401) {
      await userStore.authenticate();

      originalRequestConfig.headers.Authorization = userStore.authToken;

      return axiosInstance(originalRequestConfig);
    }

    window.location.href = useRuntimeConfig().public.baseUrl + '/logout';
  },
);

export default axiosInstance;