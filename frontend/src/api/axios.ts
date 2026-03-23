import axios from "axios";
import { useAuthStore } from "../store/authStore";
import type { ApiErrorResponse } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;

// Інтерцептор відповідей
api.interceptors.response.use(
  (response) => response, // Якщо все ок, просто повертаємо відповідь
  (error) => {
    // Якщо сервер повернув 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      console.warn("Сесія закінчилася або токен невалідний");

      // Очищаємо стор (це автоматично оновить UI та ProtectedRoute)
      useAuthStore.getState().logout();

      // Можна також примусово редиректнути, хоча ProtectedRoute має це зробити сам
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse;
    if (data?.message) {
      return Array.isArray(data.message) ? data.message[0] : data.message;
    }
    return error.message;
  }
  return error instanceof Error ? error.message : "Невідома помилка";
};
