export const getTodayForInput = () => {
  const now = new Date();
  // Встановлюємо секунди та мілісекунди в 0 для чистоти
  now.setSeconds(0, 0);

  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 16);
};
