# 阶段1: 依赖构建
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# 阶段2: 最终镜像
FROM node:20-alpine AS runner
WORKDIR /app

# 安装系统依赖（如有需要）
# RUN apk add --no-cache curl
# 创建非root用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001 -G nodejs

# 从deps阶段复制node_modules
COPY --from=deps --chown=nodeuser:nodejs /app/node_modules ./node_modules
# 复制应用代码
COPY --chown=nodeuser:nodejs . .

USER nodeuser

EXPOSE 8090

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node healthcheck.js || exit 1

CMD ["node", "server.js"]
