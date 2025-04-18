FROM node:20 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install
COPY . .

# Compile o TypeScript e verifique a saída
RUN npm run build   

FROM node:20 AS production  

WORKDIR /app
COPY --from=build /app/dist ./dist/
COPY --from=build /app/package*.json ./

# Instale apenas as dependências de produção
RUN npm install --only=production
# Comando para iniciar a aplicação

CMD npx typeorm migration:run -d dist/src/data-source.js && node dist/src/index.js

