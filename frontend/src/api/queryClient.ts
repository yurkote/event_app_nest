import { MutationCache, QueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "./axios";
import { toast } from "react-hot-toast";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 1. Кількість спроб при помилці (за замовчуванням 3)
      retry: (failureCount, error: any) => {
        // Якщо сервер сказав, що ресурсу немає (404), не мучимо його запитами
        if (error?.response?.status === 404) return false;

        // Для інших випадків (напр. мережа зникла) пробуємо лише 2 рази
        return failureCount < 2;
      },

      // 2. Через який час дані стають "старими" (stale)
      // Поставимо 1 хвилину, щоб не спамити запитами при кожному кліку
      staleTime: 1000 * 60,

      // 3. Чи оновлювати дані, коли користувач повертається на вкладку
      refetchOnWindowFocus: true,

      // 4. Не показувати помилку в консолі при кожній спробі (за бажанням)
      throwOnError: false,
    },
    mutations: {
      // Для мутацій (POST/PUT) зазвичай retry ставлять в 0,
      // щоб не створити дублікати даних при поганому інтернеті
      retry: 0,
    },
  },
  mutationCache: new MutationCache({
    onError: (error) => {
      // Використовуємо наш хелпер для отримання рядка
      const message = getErrorMessage(error);
      toast.error(message);
    },
  }),
});
