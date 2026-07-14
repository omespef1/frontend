# Etapa 1: Compilación de Angular
FROM node:20-alpine AS build
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar el resto del código y compilar para producción
COPY . .
RUN npm run build --configuration=production

# Etapa 2: Servidor Nginx
FROM nginx:alpine

# Copiar el archivo de configuración personalizado de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los estáticos generados por Angular en la etapa 1
COPY --from=build /app/dist/kfc-chat-frontend /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
