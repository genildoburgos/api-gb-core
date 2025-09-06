# Usa a imagem base do Node.js
FROM node:18-alpine

# Instala dependências do sistema operacional
RUN apk add --no-cache openssl

# Define o diretório de trabalho
WORKDIR /app

# Otimiza o cache do Docker, copiando primeiro os arquivos de dependência
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Expõe a porta que a aplicação usará
EXPOSE 3000

# Define o comando padrão para iniciar a aplicação
CMD ["npm", "run", "start:dev"]