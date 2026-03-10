# Використовуємо офіційний образ Node.js
FROM node:20-alpine

# Робоча директорія всередині контейнера
WORKDIR /app

# Копіюємо файли залежностей
COPY package*.json ./
COPY prisma ./prisma/

# Встановлюємо залежності
RUN npm install

# Копіюємо решту коду
COPY . .

# Генеруємо Prisma Client
RUN npx prisma generate

# Збираємо проєкт
RUN npm run build

# Відкриваємо порт
EXPOSE 3000

# Запуск додатка
CMD ["npm", "run", "start:dev"]