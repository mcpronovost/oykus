FROM node:24
WORKDIR /app

COPY package.json ./
RUN rm -f package-lock.json
RUN rm -rf node_modules
RUN npm cache clean --force
RUN npm install

COPY . .
# RUN npm run build

EXPOSE 8000
CMD ["npm", "run", "start"] 