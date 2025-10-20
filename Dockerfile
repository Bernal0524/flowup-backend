# Usa una imagen base de Node.js ligera
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala dependencias en modo producción
RUN npm ci --only=production

# Copia el resto del código del proyecto
COPY . .

# Compila el proyecto NestJS (TypeScript → JavaScript)
RUN npm run build

# Expone el puerto de la aplicación
EXPOSE 3000

# Comando para ejecutar la app
CMD ["node", "dist/main.js"]
