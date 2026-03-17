import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "./pages/LoginPage";
import EventsPage from "./pages/EventsPage";
import MainLayout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";
import { queryClient } from "./api/queryClient";
import { Toaster } from "react-hot-toast";
import EventDetailsPage from "./pages/EventDetailsPage";
import EditEventPage from "./pages/EditEventPage";
import CreateEventPage from "./pages/CreateEventPage";
import CalendarPage from "./pages/CalendarPage";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/events" replace />} />
              <Route path="/events" element={<EventsPage />} />
            </Route>
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route path="/events/:id/edit" element={<EditEventPage />} />
            <Route path="/events/create" element={<CreateEventPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Route>

          <Route path="*" element={<h1>404 - Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
