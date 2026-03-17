import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Navbar from "../components/Navbar";
import { useMyEvents } from "../hooks/useEvents";

const CalendarPage = () => {
  const navigate = useNavigate();
  const { data: myEvents } = useMyEvents();

  const formattedEvents = myEvents?.map((e) => ({
    id: e.id,
    title: e.title,
    start: e.eventDate,
    extendedProps: {
      location: e.location,
      description: e.description,
    },
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 bg-white mt-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">My Events</h2>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          firstDay={1}
          weekNumbers={true}
          weekText="Week "
          headerToolbar={{ end: "today,dayGridWeek,dayGridMonth,prev,next" }}
          dayHeaderClassNames={
            "bg-gray-50 text-gray-500 font-semibold py-4 uppercase text-xs tracking-wider border-b border-gray-100"
          }
          events={formattedEvents}
          views={{
            week: {
              titleFormat: {
                month: "long",
              },
              dayHeaderFormat: {
                weekday: window.innerWidth < 768 ? "short" : "long",
                day: "numeric",
              },
            },
            month: {
              titleFormat: {
                month: "long",
                day: "numeric",
                year: "numeric",
              },
            },
          }}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            meridiem: false,
            hour12: false,
          }}
          height="auto"
          contentHeight="auto"
          dayMaxEvents={3}
          eventClick={(info) => {
            navigate(`/events/${info.event.id}`);
          }}
          eventClassNames="bg-blue-500 border-none text-white p-1 rounded cursor-pointer"
        />
      </div>
    </div>
  );
};

export default CalendarPage;
