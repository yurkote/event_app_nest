import api from "../api/axios";
// Імпортуйте інтерфейси, які ми обговорили раніше
import type {
  Event,
  RegisterDto,
  LoginDto,
  AuthResponse,
  CreateEventDto,
  UpdateEventDto,
} from "../types";

export const AuthService = {
  register: (data: RegisterDto) =>
    api.post<AuthResponse>("/auth/register", data),

  login: (data: LoginDto) => api.post<AuthResponse>("/auth/login", data),
};

export const EventService = {
  // Публічні події
  getAll: () => api.get<Event[]>("/events"),

  getById: (id: string) => api.get<Event>(`/events/${id}`),

  // Управління подіями
  create: (data: CreateEventDto) => api.post<Event>("/events", data),

  update: (id: string, data: UpdateEventDto) =>
    api.patch<Event>(`/events/${id}`, data),

  delete: (id: string) => api.delete<void>(`/events/${id}`),

  // Участь
  join: (eventId: string) => api.post<{ message: string }>(`/events/${eventId}/join`),

  leave: (id: string) => api.post<{ message: string }>(`/events/${id}/leave`),

  // Календар користувача
  getMyEvents: () => api.get<Event[]>("/events/my"),
};
