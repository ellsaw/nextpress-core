FROM node:24-alpine AS base
    RUN apk add --no-cache libc6-compat
    WORKDIR /app

    ENV NEXT_TELEMETRY_DISABLED 1

FROM base AS deps
    COPY package*.json ./
    RUN npm ci

FROM base AS builder
    ARG WP_SERVICE_URL
    ENV WP_SERVICE_URL=$WP_SERVICE_URL

    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    RUN npm run compile

# --- Final Production Stage ---
FROM base AS production
    ENV NODE_ENV production

    RUN addgroup --system --gid 1001 nodejs && \
        adduser --system --uid 1001 nextjs

    RUN chown nextjs:nodejs /app

    COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
    COPY --from=builder --chown=nextjs:nodejs /app ./

    USER nextjs

    ENV HOSTNAME "0.0.0.0"

    EXPOSE 3000
    ENV PORT 3000

    CMD npm run generate && npm run start

# --- Final Development Stage ---
FROM base AS development
    ENV NODE_ENV=development

    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    EXPOSE 3000
    CMD ["npm", "run", "dev"]
