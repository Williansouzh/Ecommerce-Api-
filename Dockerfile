# Fase de build
FROM node:20 AS build

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia o package.json e package-lock.json para instalar as dependências
COPY package*.json ./

# Instala as dependências de desenvolvimento e produção
RUN npm install

# Copia o restante dos arquivos da aplicação
COPY . .

# Gera a build da aplicação
RUN npm run build

# Fase de produção
FROM node:16 AS production

# Diretório de trabalho na fase de produção
WORKDIR /app
# Copia os arquivos da build da fase anterior
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Instala apenas as dependências de produção
RUN npm install --only=production

# Expõe a porta da aplicação
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["node", "dist/src/index.js"]
