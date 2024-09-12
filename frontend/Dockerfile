# Development
FROM node:22-alpine

WORKDIR /app
RUN npm install -g @angular/cli@18.1.0
COPY package.json package-lock.json ./
RUN npm install
COPY . .

EXPOSE 4200
CMD ["npm", "start"]


# Production
# FROM node:18-alpine AS build

# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm install --omit=dev
# COPY . .
# RUN npm run build

# FROM node:18-alpine

# WORKDIR /app

# COPY --from=build /app/dist/frontend /app/dist/frontend
# COPY --from=build /app/package.json /app/package.json
# COPY --from=build /app/package-lock.json /app/package-lock.json
# COPY server.ts .

# RUN npm install --omit=dev

# EXPOSE 4000
# CMD ["npm", "run", "serve:ssr:frontend"]
