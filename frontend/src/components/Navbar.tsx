import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const links = [
    { name: "All events", path: "/events", baseCss: "" },
    { name: "My Events", path: "/calendar", baseCss: "" },
    {
      name: "+ Create Event",
      path: "/events/create",
      baseCss: "bg-indigo-600 text-white hover:bg-indigo-700 md:px-5",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 sm:gap-4">
            <h1
              className="text-xl font-bold text-indigo-600 cursor-pointer"
              onClick={() => navigate("/events")}
            >
              Eventum
            </h1>
            <span className="hidden sm:block text-gray-300">|</span>
            <span className="text-sm sm:text-base text-gray-700 font-medium truncate max-w-30 sm:max-w-none">
              Hi, {user?.fullName?.split(" ")[0] || "User"}!
            </span>
          </div>

          {/* Desktop Menu (видиме від md і вище) */}
          <div className="hidden md:flex items-center gap-2">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/events"}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition-all font-medium text-sm ${
                    isActive && !link.baseCss
                      ? "text-indigo-600 bg-indigo-50"
                      : isActive && link.baseCss
                        ? "ring-2 ring-indigo-300"
                        : "text-gray-600 hover:bg-gray-100"
                  } ${link.baseCss}`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 font-medium text-sm transition"
            >
              Log Out
            </button>
          </div>

          {/* Mobile Button (видима тільки на малих екранах) */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-indigo-600 focus:outline-none p-2"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (випадаючий список) */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 border-t">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-3 rounded-md text-base font-medium ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-200"
                } ${link.path === "/events/create" ? "mt-2 bg-indigo-600 text-white hover:bg-indigo-700" : ""}`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="w-full text-left block px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition"
          >
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
