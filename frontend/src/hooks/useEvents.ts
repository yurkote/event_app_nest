import { useQuery } from "@tanstack/react-query";
import { EventService } from "../services";

export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => EventService.getAll().then((res) => res.data),
    staleTime: 1000 * 60 * 5, // дані вважаються свіжими 5 хвилин
  });
};
