import { useForm } from "react-hook-form";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";
import type { AuthResponse } from "../types";

const LoginPage = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  // Zustand дії та стан
  const { token, setAuth } = useAuthStore();

  // Mutation для входу
  const loginMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/auth/login", {
        email: data.email,
        pass: data.password,
      });
      return response.data;
    },
    onSuccess: (data: AuthResponse) => {
      // Оновлюємо глобальний стан (Zustand сам оновить localStorage)
      setAuth(data.token, data.user);

      // Більше не потрібно reload! React Query та Zustand синхронізують UI
      navigate("/events");
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Помилка входу. Перевірте дані.");
    },
  });

  // Якщо користувач вже залогінений — редирект
  if (token) {
    return <Navigate to="/events" replace />;
  }

  const onSubmit = (data: any) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Вхід у систему
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              {...register("email", { required: true })}
              type="email"
              disabled={loginMutation.isPending}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Пароль
            </label>
            <input
              {...register("password", { required: true })}
              type="password"
              disabled={loginMutation.isPending}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-blue-400"
          >
            {loginMutation.isPending ? "Вхід..." : "Увійти"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Немає акаунту?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Зареєструватися
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
