# syntax=docker/dockerfile:1
ARG DOCKER_REPORT

FROM $DOCKER_REPORT

EXPOSE 3000

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "api"]

    