FROM node:14.17.6-alpine3.11

WORKDIR /source/app

RUN chown -R node:node /source/app

USER node

COPY package.json .

RUN npm install --production

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
