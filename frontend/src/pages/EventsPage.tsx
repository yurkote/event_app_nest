import { useEvents } from "../hooks/useEvents";

const EventsPage = () => {
  const { data: events, isLoading, error } = useEvents();

  if (isLoading) {
    return <div>Завантаження подій...</div>;
  }

  if (error) {
    return <div>Помилка завантаження подій: {(error as Error).message}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Список Подій
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events?.map((event) => (
          <div
            key={event.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200"
          >
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              {event.title} - {new Date(event.eventDate).toLocaleDateString()}
            </h2>
            <p className="text-gray-600 mb-4">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
