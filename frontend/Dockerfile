FROM node:22-alpine

WORKDIR /app
RUN npm install -g @angular/cli@18.1.0
COPY package.json package-lock.json ./
RUN npm install
COPY . .

EXPOSE 4200
CMD ["npm", "start"]


# Stage 1: Build Angular application
# FROM node:22 AS build

# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm install --omit=dev
# COPY . .
# RUN npm run build --omit=dev

# FROM node:22-alpine

# WORKDIR /app

# # Stage 2: Serve application using Node.js
# COPY --from=build /app/dist/frontend /app/dist/frontend
# EXPOSE 4000
# CMD ["node", "dist/frontend/server/server.mjs"]

# Stage 2: Serve application using Nginx
# COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
