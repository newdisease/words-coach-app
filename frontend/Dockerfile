FROM node:13.12.0-alpine as build

WORKDIR /app/frontend

COPY package.json package-lock.json ./
RUN npm install --silent
COPY . /app/frontend
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/frontend/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
