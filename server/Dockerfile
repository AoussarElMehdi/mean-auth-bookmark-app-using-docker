FROM alpine
RUN apk add --update nodejs npm
WORKDIR /app
COPY package*.json /app
RUN cd /app && npm set progress=false && npm install
COPY . /app
EXPOSE 3000
CMD ["npm", "run", "start"]

# FROM node:latest AS builder
# WORKDIR /app
# COPY . /app
# RUN npm install
# RUN npm run build

# FROM node:latest
# COPY --from=builder /app ./
# EXPOSE 3000
# CMD ["npm", "run", "start:prod"]