export interface ApiErrorResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

export interface User {
  id: string;
  email: string;
  fullName?: string;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  eventDate: string; // usually ISO string
  location?: string;
  capacity?: number;
  creatorId: string;
  createdAt: Date;
  type: string;
  // Optional fields for convenience
  creator?: User;
  participants?: Participant[];
  _count?: {
    participants: number;
  };
}

export interface Participant {
  userId: string;
  eventId: string;
  joinedAt: Date;
  user?: User;
}

// POST /auth/register
export interface RegisterDto {
  email: string;
  pass: string; // On the frontend, this is just the password, the backend handles the hashing
  fullName?: string;
}

// POST /auth/login
export interface LoginDto {
  email: string;
  pass: string;
}

// Response after login
export interface AuthResponse {
  token: string;
  user: User;
}
// POST /events
export interface CreateEventDto {
  title: string;
  description?: string;
  eventDate: string; // ISO String
  location?: string;
  capacity?: number;
  type: string;
}

// PATCH /events/:id
// Partial allows making all fields of CreateEventDto optional
export type UpdateEventDto = Partial<CreateEventDto>;

// GET /events (Response)
// Usually we return an array of events with brief information
export type EventListResponse = Event[];

// GET /events/:id (Response)
// Here we can add full information about participants
export interface EventDetailResponse extends Event {
  creator: User;
  participants: (Participant & { user: User })[];
}

export interface CreateEventFormValues extends Omit<
  CreateEventDto,
  "eventDate"
> {
  formDate: string;
  formTime: string;
}

export interface UpdateEventFormValues extends Omit<
  UpdateEventDto,
  "eventDate"
> {
  formDate: string;
  formTime: string;
}
