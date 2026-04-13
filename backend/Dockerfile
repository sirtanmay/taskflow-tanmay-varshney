FROM node:20-bullseye

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 5001

CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npm run dev"]