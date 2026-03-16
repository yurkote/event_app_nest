import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
  useDeleteEvent,
  useEvents,
  useJoinEvent,
  useLeaveEvent,
} from "../hooks/useEvents";
// import { eventKeys } from "../hooks/keys";
// import { useMutation } from "@tanstack/react-query";
// import { EventService } from "../services";
// import { queryClient } from "../api/queryClient";

export default function EventsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { data: events = [], isLoading, isError } = useEvents();
  const joinMutation = useJoinEvent();
  const leaveMutation = useLeaveEvent();
  const deleteMutation = useDeleteEvent();

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Ви впевнені?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAction = (e: React.MouseEvent, action: any, id: string) => {
    e.stopPropagation();
    action(id);
  };

  if (isLoading && events.length === 0)
    return <div className="text-center p-10">Завантаження подій...</div>;
  if (isError)
    return (
      <div className="text-center p-10 text-red-500">Помилка завантаження</div>
    );

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const isParticipant = event.participants?.some(
            (p) => p.userId === user?.id,
          );
          const isCreator = event.creatorId === user?.id;
          const isPending = joinMutation.isPending || leaveMutation.isPending;

          return (
            <div
              key={event.id}
              onClick={() => navigate(`/events/${event.id}`)}
              className="group cursor-pointer bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition">
                {event.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {event.description}
              </p>

              <div className="text-sm text-gray-500 space-y-1">
                <p>📍 {event.location}</p>
                <p>📅 {new Date(event.eventDate).toLocaleDateString()}</p>
                <p>👥 Учасників: {event._count?.participants ?? 0}</p>
              </div>

              <div className="mt-4 space-y-2">
                <button
                  onClick={(e) =>
                    handleAction(
                      e,
                      isParticipant
                        ? leaveMutation.mutate
                        : joinMutation.mutate,
                      event.id,
                    )
                  }
                  disabled={isPending}
                  className={`w-full py-2 rounded-lg transition font-bold ${
                    isPending
                      ? "bg-gray-200 cursor-not-allowed"
                      : isParticipant
                        ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                  }`}
                >
                  {isPending
                    ? "Зачекайте..."
                    : isParticipant
                      ? "Відписатися"
                      : "Приєднатися"}
                </button>

                {isCreator && (
                  <button
                    disabled={deleteMutation.isPending}
                    onClick={(e) => handleDelete(e, event.id)}
                    className="w-full text-red-500 text-sm hover:underline mt-2 text-center disabled:opacity-50"
                  >
                    {deleteMutation.isPending
                      ? "Видалення..."
                      : "Видалити мою подію"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
