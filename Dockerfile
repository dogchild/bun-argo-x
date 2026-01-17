FROM oven/bun:alpine

# 安装必要的系统依赖
# tzdata: 用于时区设置
# procps: 包含 pkill 命令 (代码中使用了 exec('pkill ...'))
RUN apk add --no-cache tzdata procps bash

# 设置时区
ENV TZ=Asia/Shanghai

WORKDIR /app

# 复制应用文件
# 由于 package.json 中没有依赖，我们跳过 bun install，直接复制文件
COPY package.json index.js ./

# 暴露端口
EXPOSE 3005

# 启动命令
CMD ["bun", "index.js"]
