FROM node:20 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install
COPY . .

RUN npm run build  # Ensure this builds the TypeScript files into the dist directory

FROM node:16 AS production

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

RUN npm install --only=production

CMD ["node", "dist/src/index.js"]  # Ensure the entry point is correct
