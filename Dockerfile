# Etapa 1: Build da aplicação React/Vite com Node.js
FROM node:22-alpine as build
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json ./

# Instalar dependências de forma limpa
RUN npm ci

# Copiar o restante do código da aplicação
COPY . .

# Fazer o build de produção (gera a pasta /dist)
RUN npm run build

# Etapa 2: Servir os arquivos estáticos com Nginx
FROM nginx:alpine

# Copiar a configuração customizada do Nginx para suportar React Router (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar os arquivos embutidos gerados no Etapa 1 para o diretório de HTML do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# A porta 80 é exposta pelo Nginx por padrão
EXPOSE 80

# Iniciar o Nginx em ambiente de primeiro plano
CMD ["nginx", "-g", "daemon off;"]
