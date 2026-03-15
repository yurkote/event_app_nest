import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { useEvent, useJoinEvent, useLeaveEvent } from "../hooks/useEvents";

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: event, isLoading, isError } = useEvent(id || "");
  const joinMutation = useJoinEvent(id!);
  const leaveMutation = useLeaveEvent(id!);

  //TODO: Дизайн сторінки або авто редірект для відсутньої події
  if (isError) {
    return (
      <div className="error-container">
        <h2>Упс! Такої події не існує</h2>
        <button onClick={() => navigate("/events")}>
          Повернутися до списку
        </button>
      </div>
    );
  }
  if (isLoading || !event)
    return <div className="p-10 text-center">Завантаження...</div>;

  const handleJoinLeave = () => {
    event.isParticipant ? leaveMutation.mutate() : joinMutation.mutate();
  };

  const handleDelete = async () => {
    if (window.confirm("Видалити цю подію?")) {
      await api.delete(`/events/${id}`);
      navigate("/events");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white mt-10 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              {event.title}
            </h1>
            <p className="text-gray-500 mt-2">
              Організатор: {event.creator?.fullName}
            </p>
          </div>
          {event.isOrganizer && (
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/events/${id}/edit`)}
                className="bg-amber-100 text-amber-700 px-4 py-2 rounded-lg font-medium"
              >
                Редагувати
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium"
              >
                Видалити
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-3">Опис</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              {event.description || "Опис відсутній"}
            </p>

            <div className="bg-blue-50 p-4 rounded-xl space-y-2">
              <p>
                📅 <strong>Дата:</strong>{" "}
                {new Date(event.eventDate).toLocaleString()}
              </p>
              <p>
                📍 <strong>Локація:</strong> {event.location}
              </p>
              <p>
                👥 <strong>Місткість:</strong> {event.capacity || "Необмежено"}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">
              Учасники ({event._count?.participants})
            </h2>
            <ul className="space-y-2 mb-6">
              {event.participants?.map((p: any) => (
                <li
                  key={p.userId}
                  className="flex items-center gap-2 text-gray-700 bg-gray-50 p-2 rounded"
                >
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                    {p.user.fullName.charAt(0)}
                  </div>
                  {p.user.fullName}
                </li>
              ))}
            </ul>

            <button
              onClick={handleJoinLeave}
              className={`w-full py-3 rounded-xl font-bold transition ${event.isParticipant ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-blue-600 text-white hover:bg-blue-700"}`}
            >
              {event.isParticipant ? "Залишити подію" : "Приєднатися"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
