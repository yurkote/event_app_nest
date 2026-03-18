import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEvents, useJoinEvent, useLeaveEvent } from "../hooks/useEvents";
import { MapPin, Calendar, Users, Loader2 } from "lucide-react";
import EventSkeleton from "../components/EventSkeleton";

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

  if (isError)
    return (
      <div className="text-center py-20 bg-rose-50 rounded-3xl border border-rose-100 m-6">
        <p className="text-rose-600 font-bold">
          Failed to load events. Please try again.
        </p>
      </div>
    );

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <EventSkeleton key={i} />)
          : events.map((event) => {
              const isFull = event.capacity === event.participants?.length;
              const isParticipant = event.participants?.some(
                (p) => p.userId === user?.id,
              );
              const isPending =
                joinMutation.isPending || leaveMutation.isPending;

              return (
                <div
                  key={event.id}
                  onClick={() => navigate(`/events/${event.id}`)}
                  className="group flex flex-col cursor-pointer bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {event.title}
                    </h3>

                    <p className="flex-1 text-slate-500 text-sm mb-6 line-clamp-3">
                      {event.description || "No description provided."}
                    </p>

                    <div className="space-y-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-indigo-500" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-indigo-500" />
                        <span>
                          {new Date(event.eventDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-500" />
                        <span>
                          {event._count?.participants ?? 0} Participants
                        </span>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-50">
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
                        disabled={isPending || (isFull && !isParticipant)}
                        className={`w-full py-3 rounded-xl transition-all font-bold flex items-center justify-center gap-2 ${
                          isPending
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : isParticipant
                              ? "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white"
                              : isFull
                                ? "bg-rose-600 text-white"
                                : "bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white"
                        }`}
                      >
                        {isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : null}
                        {isPending
                          ? "Processing..."
                          : isParticipant
                            ? "Leave event"
                            : isFull
                              ? "Full event"
                              : "Join event"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
      {!isLoading && events.length === 0 && (
        <div className="text-center py-20 text-slate-400 italic">
          No events found...
        </div>
      )}
    </main>
  );
}
