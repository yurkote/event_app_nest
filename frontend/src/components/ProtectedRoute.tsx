import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  if (!isAuthenticated) {
    // replace: true не дає користувачу повернутися назад кнопкою в браузері
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Дозволяємо рендер вкладених роутів
};

export default ProtectedRoute;
