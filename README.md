<div align="center">

# bun-argo-x 隧道代理

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

bun-argo-x 是一个基于 Bun 的强大 Argo 隧道部署工具，专为 PaaS 平台和游戏玩具平台设计。它支持 VLESS 代理协议。

---

</div>

## 说明 （部署前请仔细阅读）

* 本项目是针对 Bun 环境的 PaaS 平台设计，采用 Argo 隧道部署节点。
* 只需要 `index.js` 和 `package.json` 即可运行。
* 不填写 `A_DOMAIN` 和 `A_AUTH` 两个变量即启用临时隧道，反之则使用固定隧道。

## 📋 环境变量

| 变量名 | 是否必须 | 默认值 | 说明 |
|--------|----------|--------|------|
| PORT | 否 | 3005 | HTTP服务监听端口 |
| A_PORT | 否 | 8001 | Argo隧道端口 |
| UID | 否 | 75de94bb-b5cb-4ad4-b72b-251476b36f3a | 用户ID |
| A_DOMAIN | 否 | - | Argo固定隧道域名 |
| A_AUTH | 否 | - | Argo固定隧道密钥 |
| CIP | 否 | cf.877774.xyz | 节点优选域名或IP |
| CPORT | 否 | 443 | 节点端口 |
| NAME | 否 | Vls | 节点名称前缀 |
| FILE_PATH | 否 | ./tmp | 运行目录 |
| S_PATH | 否 | ID的值 | 订阅路径 |
| MLKEM_S | 否 | mlkem768... | vless enc私钥 |
| MLKEM_C | 否 | mlkem768... | vless enc公钥 |
| M_AUTH | 否 | ML-KEM-768... | vless enc认证值 |

## 🌐 订阅地址

- 标准端口：`https://your-domain.com/{S_PATH}`
- 非标端口：`http://your-domain.com:port/{S_PATH}`
*注：`S_PATH` 变量默认为 `UID` 的值*

---

## 🚀 使用方法

### 环境要求

需要安装 [Bun](https://bun.sh/) 1.0 或更高版本。

### 本地运行

```bash
# 安装依赖 (其实没有依赖，但这是标准流程)
bun install

# 启动服务
bun start

# 或者直接运行文件
bun index.js
```

### 环境变量配置

可使用 `.env` 文件来配置环境变量运行，Bun 会自动读取 `.env` 文件。

或者直接在命令行中设置：

```bash
export PORT=3005
export UID="your-id-here"
bun start
```

### Docker 运行

本项目包含针对 Bun 优化的 `Dockerfile`。

```bash
# 构建镜像
docker build -t bun-argo-x .

# 运行容器
docker run -p 3005:3005 --name argo-app -d bun-argo-x

# 运行容器 (带变量)
docker run -p 3005:3005 --name argo-app -d \
  -e UID="your-custom-id" \
  -e A_DOMAIN="your.domain.com" \
  -e A_AUTH="your-argo-token" \
  bun-argo-x
```

## 🔧 后台运行

### 使用 nohup
```bash
nohup bun index.js > run.log 2>&1 &
```

### 使用 systemd（Linux系统服务）
```ini
[Unit]
Description=Bun Argo Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/bun-argo-x
Environment=PATH=/root/.bun/bin:/usr/local/bin:/usr/bin:/bin
Environment=A_PORT=8001
Environment=PORT=3005
ExecStart=/root/.bun/bin/bun index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# 启动服务
sudo systemctl start bun-argo-x
sudo systemctl enable bun-argo-x
```

## 📚 更多信息

- [Bun 官网](https://bun.sh)
- [问题反馈](https://github.com/dogchild/bun-argo-x/issues)

---
  
# 免责声明
* 本程序仅供学习了解, 非盈利目的，请于下载后 24 小时内删除, 不得用作任何商业用途, 文字、数据及图片均有所属版权, 如转载须注明来源。
* 使用本程序必循遵守部署免责声明，使用本程序必循遵守部署服务器所在地、所在国家和用户所在国家的法律法规, 程序作者不对使用者任何不当行为负责。