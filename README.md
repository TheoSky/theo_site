# HoloSpark 个人网站

一个现代化的个人网站，包含作品集展示和博客系统。使用React、TypeScript、Vite和Tailwind CSS构建，采用Firebase作为后端数据库。

## 功能特点

- **响应式设计**：在各种设备上都有出色的浏览体验
- **作品集展示**：展示个人项目和技能
- **博客系统**：
  - 博客文章列表和详情页
  - 支持Markdown格式的文章编辑
  - 文章分类和标签
  - 草稿和发布状态管理
- **管理后台**：
  - 安全的管理员登录
  - 文章的创建、编辑和删除
  - 文章状态管理

## 技术栈

- **前端**：
  - React 18
  - TypeScript
  - Vite
  - React Router
  - Tailwind CSS
  - shadcn/ui 组件库
  - Lucide React 图标
  - React Query

- **后端/数据库**：
  - Firebase Authentication
  - Firebase Firestore
  - Firebase Storage

## 开始使用

### 前提条件

- Node.js 16+
- npm 或 yarn
- Firebase 账号和项目

### 安装

1. 克隆仓库

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd holo-spark

# Step 3: Install the necessary dependencies.
npm install

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

### 配置Firebase

1. 复制 `.env.example` 文件为 `.env`，并填入您的Firebase配置信息：

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

2. 创建一个Firebase项目：https://console.firebase.google.com/
3. 启用Authentication服务，并添加Email/Password登录方式
4. 创建一个管理员用户
5. 启用Firestore数据库
6. 启用Storage存储服务
7. 设置适当的安全规则
## 项目结构

```
src/
├── assets/         # 静态资源
├── components/     # 可复用组件
│   ├── auth/       # 认证相关组件
│   ├── layout/     # 布局组件
│   ├── tech/       # 技术相关组件
│   └── ui/         # UI组件
├── contexts/       # React上下文
├── hooks/          # 自定义钩子
├── lib/            # 工具函数和服务
├── pages/          # 页面组件
└── types/          # TypeScript类型定义
```

## 部署

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

构建后的文件将位于 `dist` 目录中，可以部署到任何静态网站托管服务。

### 部署到Lovable

如果您使用Lovable平台，可以通过以下方式部署：

打开 [Lovable](https://lovable.dev/projects/d1e49052-29b8-4045-8764-832f41bd8b5e) 并点击 Share -> Publish。

### 自定义域名

您可以将自定义域名连接到您的项目。如果使用Lovable平台，可以通过 Project > Settings > Domains 页面连接域名。更多信息请参考：[设置自定义域名](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## 许可证

[MIT](LICENSE)
