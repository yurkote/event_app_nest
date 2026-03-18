import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  useDeleteEvent,
  useEvent,
  useJoinEvent,
  useLeaveEvent,
} from "../hooks/useEvents";
import { Calendar, MapPin, Edit3, Trash2, ArrowLeft } from "lucide-react";

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: event, isLoading, isError } = useEvent(id || "");
  const joinMutation = useJoinEvent();
  const leaveMutation = useLeaveEvent();
  const deleteEvent = useDeleteEvent();
  const isFull = event?.capacity === event?.participants?.length;

  //TODO: Design 404 page or autoredirect
  if (isError) {
    return (
      <div className="error-container">
        <h2>Oops! This event does not exist</h2>
        <button onClick={() => navigate("/events")}>
          Return to the list of events
        </button>
      </div>
    );
  }
  if (isLoading || !event)
    return <div className="p-10 text-center">Fetching...</div>;

  const handleJoinLeave = () => {
    event.isParticipant ? leaveMutation.mutate(id!) : joinMutation.mutate(id!);
  };

  const handleDelete = () => {
    if (window.confirm("Delete this event?")) deleteEvent.mutate(id!);
    navigate("/events");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/events")}
          className="flex items-center text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                  {event.title}
                </h1>
                <div className="flex items-center mt-3 text-slate-500">
                  <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-[10px] font-bold mr-2">
                    {event.creator?.fullName?.charAt(0)}
                  </div>
                  <span className="text-sm font-medium">
                    Organizer: {event.creator?.fullName}
                  </span>
                </div>
              </div>

              {event.isOrganizer && (
                <div className="flex w-full md:w-auto gap-3">
                  <button
                    onClick={() => navigate(`/events/${id}/edit`)}
                    className="flex-1 md:flex-none flex items-center justify-center bg-amber-50 text-amber-700 px-5 py-2.5 rounded-xl font-bold hover:bg-amber-100 transition-all"
                  >
                    <Edit3 className="w-4 h-4 mr-2" /> Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 md:flex-none flex items-center justify-center bg-rose-50 text-rose-600 px-5 py-2.5 rounded-xl font-bold hover:bg-rose-600 hover:text-white transition-all"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:divide-x divide-slate-100">
            <div className="lg:col-span-2 p-6 sm:p-8 space-y-8">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-3">
                  About this event
                </h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {event.description || "No description provided."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center p-4 bg-indigo-50/50 rounded-2xl border border-indigo-50">
                  <Calendar className="w-5 h-5 text-indigo-600 mr-3" />
                  <div>
                    <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
                      Date & Time
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      {new Date(event.eventDate).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-emerald-50/50 rounded-2xl border border-emerald-50">
                  <MapPin className="w-5 h-5 text-emerald-600 mr-3" />
                  <div>
                    <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                      Location
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      {event.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 bg-slate-50/50">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 flex items-center justify-between">
                  Participants
                  <span className="bg-white px-3 py-1 rounded-full border border-slate-200 text-xs font-bold text-slate-500 shadow-sm">
                    {event._count?.participants} / {event.capacity || "∞"}
                  </span>
                </h2>
              </div>

              <ul className="space-y-3 mb-8">
                {event.participants?.map((p: any) => (
                  <li
                    key={p.userId}
                    className="flex items-center gap-3 text-slate-700 bg-white p-3 rounded-xl shadow-sm border border-slate-100 transition-transform hover:scale-[1.02]"
                  >
                    <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-xs font-bold shadow-sm">
                      {p.user.fullName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium truncate">
                      {p.user.fullName}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={handleJoinLeave}
                disabled={isFull && !event.isParticipant}
                className={`w-full py-4 rounded-2xl font-black text-lg shadow-lg transition-all active:scale-[0.98] ${
                  event.isParticipant
                    ? "bg-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white shadow-rose-200"
                    : isFull
                      ? "bg-rose-700 text-white"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200"
                }`}
              >
                {event.isParticipant
                  ? "Leave event"
                  : event.capacity === event.participants?.length
                    ? "Full event"
                    : "Join event"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
