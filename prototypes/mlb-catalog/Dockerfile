FROM node:24.18.0-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates git ripgrep python3 tini \
    && rm -rf /var/lib/apt/lists/*
RUN npm install --global pnpm@10.11.0 @anthropic-ai/claude-code@2.1.280
ENV PLAYWRIGHT_BROWSERS_PATH=/opt/browsers
RUN mkdir /opt/browser && cd /opt/browser \
    && npm install --save-exact playwright@1.56.1 \
    && npx playwright install --with-deps chromium
COPY browser.cjs /opt/browser/browser.cjs
COPY agent.sh smoke.py /opt/agent/
RUN chmod +x /opt/agent/agent.sh
WORKDIR /workspace
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["/opt/agent/agent.sh"]
