# Fast Next.js CLI

一个基于 Next.js 15 + React 19 的自定义脚手架，内置了以下特性：
- **国际化 (i18n)**: 集成 next-intl
- **认证系统**: 包含登录/注册页面 + 基于 Server Actions 的 JWT 鉴权
- **UI 框架**: Tailwind CSS + ShadcnUI
- **状态管理**: Zustand

## 前置条件

- Node.js 18+（推荐 20+）

## 安装

```bash
# 从 npm 安装（全局）
npm install -g fast-nextjs-cli

# 或无需安装直接运行
npx fast-nextjs-cli create my-app

# 本地开发
npm install -g .
# 或者本地链接
npm link
```

## 使用方法

创建一个新项目：

```bash
fast-nextjs-cli create my-app
```

### 选项

- `--with-i18n`: 启用国际化支持
- `--with-login`: 启用登录/注册功能（可与国际化搭配使用，并更新首页入口）

示例：

```bash
fast-nextjs-cli create my-app --with-login
```

## 权限控制说明

- 未使用 `--with-login` 时，只会生成基础或 i18n 目录结构，不包含认证逻辑，所有页面默认公开。
- 使用 `--with-login` 时，会额外生成登录/注册页面、`actions/auth.ts`、Mock `api/auth/*` 与 `src/lib/http.ts`，并写入基于 JWT 的 `src/middleware.ts` 用于保护受控路由。
  - 搭配 `--with-i18n` 时，路由为 `/{locale}/login`、`/{locale}/dashboard`，会按当前语言重定向到登录页。
  - 未启用国际化时，路由为 `/login`、`/dashboard`。
- 同时会在根目录生成 `.env.example`，如需接入真实后端，请复制为 `.env.local` 并设置 `API_URL`。

## 项目结构

生成的项目结构将根据您的选择而有所不同：

- **Simple (默认)**: 标准的 App Router 结构。
- **i18n**: 基于 `src/app/[locale]` 的目录结构，包含 `messages/` 翻译文件及语言切换器。
- **Features (功能模块)**:
    - **Auth**: 包含 `(auth)/login` 和 `(auth)/register` 路由，`actions/auth.ts` 逻辑，Mock API 接口 (`api/auth/*`) 以及受保护的 `dashboard` 页面。

## 许可证

MIT
