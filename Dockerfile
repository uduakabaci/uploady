# Use the official Bun image
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Install dependencies into temp directory
# This will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY . .

# Set environment
ENV NODE_ENV=production

# Expose port
EXPOSE 3000/tcp

# Set user to non-root
USER bun

# Run the app directly
ENTRYPOINT ["bun", "run", "start"]
