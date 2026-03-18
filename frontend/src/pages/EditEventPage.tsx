import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEditEvent, useEvent } from "../hooks/useEvents";
import type { UpdateEventDto, UpdateEventFormValues } from "../types";
import { useEffect } from "react";
import { getDateForInput } from "../utils/getDateForInput";
import { getTimeForInput } from "../utils/getTimeForInput";

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: event } = useEvent(id!);
  const { register, handleSubmit, reset } = useForm<UpdateEventFormValues>({});
  const editMutation = useEditEvent(id!);

  console.log(event);

  const onSubmit = (formData: UpdateEventFormValues) => {
    const eventDate = new Date(
      `${formData.formDate}T${formData.formTime}`,
    ).toISOString();

    const dto: UpdateEventDto = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      capacity: formData.capacity,
      type: formData.type?.toUpperCase(),
      eventDate,
    };
    editMutation.mutate(dto, {
      onSuccess: () => {
        alert("Event updated");
        console.log(dto);
        navigate(`/events/${id}`);
      },
    });
  };

  useEffect(() => {
    if (event) {
      reset({
        ...event,
        formDate: getDateForInput(event.eventDate),
        formTime: getTimeForInput(event.eventDate),
      });
    }
  }, [event, reset]);

  return (
    <div className="pb-1 min-h-screen bg-gray-50">
      <Navbar />
      <div className=" max-w-2xl mx-auto my-10 p-8 bg-white rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Editing Event</h2>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title event */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title")}
              type="text"
              placeholder="e.g., Tech Conference 2025"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Describe what makes your event special..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            ></textarea>
          </div>

          {/* Date and time*/}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                {...register("formDate")}
                min={getDateForInput()}
                type="date"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                {...register("formTime")}
                type="time"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-500"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              {...register("location")}
              type="text"
              placeholder="e.g., Convention Center, San Francisco"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
            />
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacity (optional)
            </label>
            <input
              {...register("capacity", {
                min: {
                  value: 1,
                  message: "Число має бути додатнім",
                },
                setValueAs: (v) => (v === "" || v === null ? null : Number(v)),
              })}
              type="number"
              placeholder="Leave empty for unlimited"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <p className="mt-2 text-xs text-gray-400">
              Maximum number of participants. Leave empty for unlimited
              capacity.
            </p>
          </div>
          {/* Visibility */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Visibility</p>

            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                {...register("type")}
                type="radio"
                value="PUBLIC"
                className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">
                <span className="font-medium">Public</span> - Anyone can see and
                join this event
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                {...register("type")}
                type="radio"
                value="PRIVATE"
                className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">
                <span className="font-medium">Private</span> - Only invited
                people can see this event
              </span>
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all"
            >
              Update Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventPage;
