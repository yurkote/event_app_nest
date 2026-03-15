import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import type { CreateEventDto } from "../types";
import { useCreateEvent } from "../hooks/useEvents";
import { getTodayForInput } from "../utils/getTodayForInput";

const CreateEventPage = () => {
  const { register, handleSubmit } = useForm<CreateEventDto>({
    defaultValues: {
      eventDate: getTodayForInput(),
    },
  });
  const navigate = useNavigate();
  const createMutation = useCreateEvent();

  const onSubmit = (data: CreateEventDto) => {
    createMutation.mutate(data);
    navigate("/events");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Нова подія</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("title")}
            placeholder="Назва події"
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            {...register("description")}
            placeholder="Опис"
            className="w-full border p-2 rounded"
            rows={4}
          />
          <input
            {...register("eventDate")}
            type="datetime-local"
            className="w-full border p-2 rounded"
            min={getTodayForInput()}
            required
          />
          <input
            {...register("capacity", {
              min: {
                value: 1,
                message: "Число має бути додатним",
              },
              // Перетворюємо порожній рядок на null або Infinity при відправці
              setValueAs: (v) => (v === "" || v === null ? null : Number(v)),
            })}
            type="number"
            className="w-full border p-2 rounded"
          />
          <input
            {...register("location")}
            placeholder="Локація"
            className="w-full border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
          >
            Опублікувати
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;
