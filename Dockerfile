# Dockerfile

ARG NODE=node:lts-alpine3.21

# Stage 1: Install dependencies
FROM ${NODE} AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* ./
RUN yarn --frozen-lockfile

# Stage 2: Build the app
FROM ${NODE} AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

# Build arg for NEXT_PUBLIC_APP_NAME
ARG NEXT_PUBLIC_APP_NAME="MySagra"
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME

COPY . .

RUN yarn build

# Stage 3: Run the production
FROM ${NODE} AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# copy assets and the generated standalone server
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

# Serve the app
CMD ["node", "server.js"]