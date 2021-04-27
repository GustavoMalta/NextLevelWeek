FROM node:10.24.1-alpine3.11
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 3333
CMD ["npm",  "run", "dev"]