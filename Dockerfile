FROM debian:bookworm-slim AS builder

ARG HUGO_VERSION=0.160.1
ARG BASE_URL=https://academic-works.astrareconslabs.com/

RUN apt-get update && apt-get install -y --no-install-recommends \
    wget ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN wget -qO hugo.tar.gz \
    "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz" \
    && tar -xzf hugo.tar.gz -C /usr/local/bin hugo \
    && rm hugo.tar.gz

WORKDIR /site
COPY . .

RUN hugo \
    --config exampleSite/hugo.toml \
    --contentDir exampleSite/content \
    --minify \
    --baseURL "${BASE_URL}"


FROM caddy:2-alpine

COPY --from=builder /site/public /srv
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 8081

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s \
    CMD wget -qO- http://localhost:8081/ || exit 1
