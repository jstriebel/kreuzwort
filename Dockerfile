FROM node:10.11-alpine as dev

RUN apk --no-cache add git openssh-client tzdata
RUN mkdir -p ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts
