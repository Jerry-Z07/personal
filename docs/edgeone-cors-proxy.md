# EdgeOne Functions CORS 代理迁移说明

## 目标

将当前外部 CORS 代理能力迁移到 EdgeOne Pages 内置 API（Pages Edge Functions）：

- 路径：`/api/proxy`
- 参数：`quest=<目标 URL>`
- 方法：`GET` 和 `OPTIONS`

## 函数代码

函数实现位于：`edge-functions/api/proxy.js`。

实现要点：

- 仅允许 HTTPS 上游地址。
- 上游域名白名单：`uapis.cn`、`v1.jinrishici.com`、`blog.078465.xyz`。
- 前端 Origin 白名单校验并回写 `Access-Control-Allow-Origin`。
- 针对预检请求返回 `204`。
- 按域名设置短期缓存策略，降低回源频率。

## 前端配置

项目新增了 `VITE_CORS_PROXY_ENDPOINT` 环境变量。

```env
VITE_CORS_PROXY_ENDPOINT=https://cors1.078465.xyz/v1/proxy/
```

说明：

- 建议在 EdgeOne Pages 生产环境配置为 `/api/proxy`，代码会自动追加 `quest` 查询参数。
- 若变量未配置，代码会回退到当前外部代理地址 `https://cors1.078465.xyz/v1/proxy/`。

## 切换步骤

1. 将 `edge-functions/api/proxy.js` 提交到仓库并触发 Pages 部署。
2. 在 EdgeOne Pages 项目环境变量中将 `VITE_CORS_PROXY_ENDPOINT` 配置为 `/api/proxy`。
3. 本地联调可使用 `edgeone pages dev`，或在本地 `.env` 继续使用外部代理绝对地址。
4. 执行 `npm run typecheck && npm run lint && npm run build`。
5. 验证四条数据链路：B 站用户、B 站视频、每日诗词、博客 RSS。

## 回滚策略

- 保留旧代理服务入口。
- 切换初期出现异常时，将域名路由或环境变量指回旧代理地址即可快速恢复。
