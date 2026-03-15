import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEditEvent, useEvent } from "../hooks/useEvents";
import type { UpdateEventDto } from "../types";
import { useEffect } from "react";
import { getTodayForInput } from "../utils/getTodayForInput";

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm<UpdateEventDto>();
  const { data: event } = useEvent(id!);
  const editMutation = useEditEvent(id!);

  const onSubmit = (formData: UpdateEventDto) => {
    editMutation.mutate(formData, {
      onSuccess: () => {
        alert("Подію оновлено");
        navigate(`/events/${id}`);
      },
    });
  };

  useEffect(() => {
    if (event) {
      const formattedDate = event.eventDate.substring(0, 16);
      reset({
        ...event,
        eventDate: formattedDate,
      });
    }
  }, [event, reset]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Редагування події</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-700"
          >
            Скасувати
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Назва
            </label>
            <input
              {...register("title")}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Опис
            </label>
            <textarea
              {...register("description")}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата та час
              </label>
              <input
                {...register("eventDate")}
                type="datetime-local"
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                required
                min={getTodayForInput()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Макс. учасників
              </label>
              <input
                {...register("capacity")}
                type="number"
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Локація
            </label>
            <input
              {...register("location")}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            disabled={editMutation.isPending}
            type="submit"
            className="w-full bg-amber-500 text-white py-3 rounded-lg font-bold hover:bg-amber-600 transition shadow-md"
          >
            Зберегти зміни
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEventPage;
