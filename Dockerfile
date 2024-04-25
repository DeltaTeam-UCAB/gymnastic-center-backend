FROM node:20-alpine as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app
RUN ls

FROM base AS prod-deps
RUN pnpm install

RUN pnpm run build
CMD ["pnpm", "start"]
