FROM node:lts-slim

WORKDIR /app/server

RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./
COPY ./prisma ./prisma/
COPY tsconfig.json .
COPY nodemon.json .

RUN npm install 
RUN npx prisma generate 

COPY . .

EXPOSE 3300

CMD ["sh", "-c", "npx ts-node src/seed.ts --import && npm run start:dev"]
