import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import type { RegisterDto } from "../types";
import { useRegister } from "../hooks/authHooks";

export default function RegisterPage() {
  const { token } = useAuthStore();
  const { register, handleSubmit } = useForm<RegisterDto>();
  const { mutate, isPending } = useRegister();

  if (token) return <Navigate to="/events" replace />;

  const onSubmit = (data: RegisterDto) => {
    mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Реєстрація
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("fullName", { required: "Ім'я обов'язкове" })}
              placeholder="Повне ім'я"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div>
            <input
              {...register("email", { required: "Email обов'язковий" })}
              type="email"
              placeholder="Email"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div>
            <input
              {...register("pass", {
                required: "Пароль обов'язковий",
                minLength: { value: 6, message: "Мінімум 6 символів" },
              })}
              type="password"
              placeholder="Пароль"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-2 rounded font-bold text-white transition ${
              isPending ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isPending ? "Створення..." : "Створити акаунт"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Вже є акаунт?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Увійти
          </Link>
        </p>
      </div>
    </div>
  );
}
