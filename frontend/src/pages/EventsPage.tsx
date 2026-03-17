import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEvents, useJoinEvent, useLeaveEvent } from "../hooks/useEvents";

export default function EventsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { data: events = [], isLoading, isError } = useEvents();
  const joinMutation = useJoinEvent();
  const leaveMutation = useLeaveEvent();

  const handleAction = (e: React.MouseEvent, action: any, id: string) => {
    e.stopPropagation();
    action(id);
  };

  if (isLoading && events.length === 0)
    return <div className="text-center p-10">Loading events...</div>;
  if (isError)
    return <div className="text-center p-10 text-red-500">Fetching error</div>;

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const isParticipant = event.participants?.some(
            (p) => p.userId === user?.id,
          );
          const isPending = joinMutation.isPending || leaveMutation.isPending;

          return (
            <div
              key={event.id}
              onClick={() => navigate(`/events/${event.id}`)}
              className="flex flex-col cursor-pointer bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition">
                {event.title}
              </h3>
              <p className="flex-1 text-gray-600 text-sm mb-4 line-clamp-2">
                {event.description}
              </p>

              <div className="text-sm text-gray-500 space-y-1">
                <p>📍 {event.location}</p>
                <p>📅 {new Date(event.eventDate).toLocaleDateString()}</p>
                <p>👥 Participants: {event._count?.participants ?? 0}</p>
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
                    ? "Wait..."
                    : isParticipant
                      ? "Leave event"
                      : "Join event"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
