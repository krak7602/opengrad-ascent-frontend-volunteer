FROM node:18
WORKDIR /usr/src/app

COPY . ./

# building the app
RUN corepack enable pnpm
RUN pnpm i
RUN pnpm run build
EXPOSE 3000

# Running the app
CMD [ "pnpm", "start" ]
