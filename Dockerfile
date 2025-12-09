FROM oven/bun:slim

# 安装必要的系统依赖
# tzdata: 用于时区设置
# procps: 包含 pkill 命令 (代码中使用了 exec('pkill ...'))
RUN apt-get update && \
    apt-get install -y --no-install-recommends tzdata procps && \
    rm -rf /var/lib/apt/lists/*

# 设置时区
ENV TZ=Asia/Shanghai

WORKDIR /app

# 复制应用文件
# 由于 package.json 中没有依赖，我们跳过 bun install，直接复制文件
COPY package.json index.js ./

# 创建 tmp 目录并设置权限
# 将所有权更改为 'bun' 用户 (oven/bun 镜像内置用户)
RUN mkdir tmp && \
    chown bun:bun tmp && \
    chmod 755 tmp

# 为了安全，切换到非 root 用户 'bun' 运行
USER bun

# 暴露端口
EXPOSE 3005

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s \
  CMD bun -e "fetch('http://localhost:' + (process.env.SERVER_PORT || process.env.PORT || 3005)).then(r => process.exit(r.status === 200 ? 0 : 1)).catch(() => process.exit(1))"

# 启动命令
CMD ["bun", "index.js"]
