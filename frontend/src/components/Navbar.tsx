import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Navbar = () => {
  const navigate = useNavigate();

  // Отримуємо дані та метод із Zustand
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <h1
          className="text-xl font-bold text-blue-600 cursor-pointer"
          onClick={() => navigate("/events")}
        >
          Eventum
        </h1>
        <span className="text-gray-400">|</span>
        <span className="text-gray-700">
          Привіт, {user?.fullName || "Користувач"}!
        </span>
      </div>

      <div className="flex gap-4 items-center">
        <button
          onClick={() => navigate("/calendar")}
          className="text-gray-600 hover:text-blue-600 font-medium"
        >
          Мій Календар
        </button>

        <button
          onClick={() => navigate("/events/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Створити подію
        </button>

        <button
          onClick={handleLogout}
          className="ml-2 text-gray-500 hover:text-red-600 text-sm font-medium transition"
        >
          Вийти
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
