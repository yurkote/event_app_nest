export const getTimeForInput = (dateValue?: string | Date) => {
  const date = dateValue ? new Date(dateValue) : new Date();

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};
