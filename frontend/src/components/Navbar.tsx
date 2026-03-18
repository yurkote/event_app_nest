import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Menu, X, LogOut, User, Calendar, PlusCircle } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const links = [
    { name: "All events", path: "/events", baseCss: "" },
    { name: "My Events", path: "/calendar", baseCss: "" },
    {
      name: "Create Event",
      path: "/events/create",
      baseCss: "bg-indigo-600 text-white hover:bg-indigo-500 md:px-5",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3 sm:gap-6">
            <div
              className="flex items-center gap-2 group cursor-pointer"
              onClick={() => navigate("/events")}
            >
              <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-700 transition-colors">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Eventum
              </h1>
            </div>

            <div className="hidden xs:flex items-center gap-2 border-l border-gray-200 pl-4 sm:pl-6">
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                <User className="w-4 h-4 text-indigo-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700 truncate max-w-25 sm:max-w-none">
                {user?.fullName?.split(" ")[0] || "User"}
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/events"}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm flex items-center gap-2 ${link.baseCss} ${
                    isActive
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                {link.path === "/events/create" && (
                  <PlusCircle className="w-4 h-4" />
                )}
                {link.name}
              </NavLink>
            ))}

            <div className="h-6 w-px bg-gray-200 mx-2" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 font-medium text-sm transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none transition-colors"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-gray-100 ${
          isOpen ? "max-h-125 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2 bg-white">
          <div className="py-2 mb-2 border-b border-gray-50 flex items-center gap-3 md:hidden">
            <User className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-900">
              {user?.fullName || "Користувач"}
            </span>
          </div>

          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                } ${link.path === "/events/create" && !isActive ? "border border-indigo-100 text-indigo-600" : ""}`
              }
            >
              {link.name}
              {link.path === "/events/create" && (
                <PlusCircle className="w-5 h-5" />
              )}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-colors mt-4"
          >
            <span>Log out</span>
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
