FROM node:latest AS builder
WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build

FROM node:latest
COPY --from=builder /app ./
EXPOSE 3000
CMD ["npm", "run", "start:prod"]