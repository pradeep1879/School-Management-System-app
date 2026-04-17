FROM oven/bun:1.3.0-alpine

WORKDIR /app

COPY package.json package.json

RUN bun install --ignore-scripts

COPY . .

RUN bunx prisma generate --schema=./src/prisma/schema.prisma

EXPOSE 3000

CMD ["bun", "run", "start"]
