FROM alpine:latest

RUN apk add --no-cache nodejs npm \
	&& npm install --global pnpm

WORKDIR /app

COPY package.json package.json

RUN pnpm install --prod

COPY dist dist


EXPOSE 3000

CMD ["pnpm", "start"]
