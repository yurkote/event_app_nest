import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import { EventService } from "../services";
import { eventKeys } from "./keys";
import { useAuthStore } from "../store/authStore";
import type { Participant, UpdateEventDto } from "../types";
import { queryClient } from "../api/queryClient";

export const useEvents = () => {
  return useQuery({
    queryKey: eventKeys.lists(),
    queryFn: () => EventService.getAll().then((res) => res.data),
    placeholderData: keepPreviousData,
  });
};

export const useEvent = (id: string) => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => EventService.getById(id).then((res) => res.data),
    enabled: !!id,

    select(data) {
      const isOrganizer = data.creatorId === user?.id;
      const isParticipant = data.participants?.some(
        (p: Participant) => p.userId === user?.id,
      );
      return {
        ...data,
        isOrganizer,
        isParticipant,
      };
    },
  });
};

export const useMyEvents = () => {
  return useQuery({
    queryKey: eventKeys.mine(),
    queryFn: () => EventService.getMyEvents().then((res) => res.data),
  });
};

// --- MUTATIONS ---

export const useCreateEvent = () => {
  return useMutation({
    mutationFn: EventService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
};

export const useJoinEvent = () => {
  return useMutation({
    mutationFn: (eventId: string) => {
      if (!eventId) throw new Error("No ID provided");
      return EventService.join(eventId);
    },
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      queryClient.invalidateQueries({ queryKey: eventKeys.mine() });
    },
  });
};

export const useLeaveEvent = () => {
  return useMutation({
    mutationFn: (eventId: string) => {
      if (!eventId) throw new Error("No ID provided");
      return EventService.leave(eventId);
    },
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      queryClient.invalidateQueries({ queryKey: eventKeys.mine() });
    },
  });
};

export const useEditEvent = (eventId: string) => {
  return useMutation({
    mutationFn: (data: UpdateEventDto) => EventService.update(eventId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
    },
  });
};

export const useDeleteEvent = () => {
  return useMutation({
    mutationFn: (eventId: string) => EventService.delete(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
};
