FROM node:17.3.0
WORKDIR /app
COPY package.json /app
COPY yarn.lock /app

RUN yarn
COPY . /app
EXPOSE 8081
CMD ["yarn", "dev"]