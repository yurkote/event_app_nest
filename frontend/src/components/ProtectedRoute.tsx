import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const ProtectedRoute = () => {
  const { token } = useAuthStore();
  if (!token) {
    // replace: true не дає користувачу повернутися назад кнопкою в браузері
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Дозволяємо рендер вкладених роутів
};

export default ProtectedRoute;
