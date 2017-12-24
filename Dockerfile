FROM node:9

ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /tmp

COPY package.json .
COPY package-lock.json .
RUN npm install

WORKDIR /usr/src/app
COPY . .

# installing into /tmp lets docker cache node_modules, so copying it into project from there
RUN cp -a /tmp/node_modules/ .

EXPOSE 3000

CMD [ "npm", "start" ]