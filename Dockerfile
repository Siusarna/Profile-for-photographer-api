FROM node:12.16.1

WORKDIR /profile-site-api

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm","serve"]
