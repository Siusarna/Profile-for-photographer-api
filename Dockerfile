FROM node:12.16.1

RUN mkdir -p /viflinzider-api

WORKDIR /viflinzider-api

COPY package*.json /viflinzider-api/

RUN npm i

COPY . /viflinzider-api

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
