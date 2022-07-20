FROM node:18-alpine
WORKDIR /app/frontend

COPY package.json ./
RUN npm install 
RUN npm install react-scripts@5.0.1 -g 
COPY . /app/frontend/
EXPOSE 3000
