FROM node:18.7.0
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY server/package.json server/package-lock.json .
RUN npm install
COPY server/ .
EXPOSE 3000
CMD [ "npm", "start"]