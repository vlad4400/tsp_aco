FROM node:22

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# FROM node:22

# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm install --omit=dev
# COPY . .
# RUN npm run build

# EXPOSE 3000
# CMD ["npm", "run", "start:prod"]
