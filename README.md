# MetaWEBot - Web增强现实与机器人控制平台

[![Next.js](https://img.shields.io/badge/Next.js-14.2.15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![AR.js](https://img.shields.io/badge/AR.js-3.4.5-orange)](https://ar-js-org.github.io/AR.js-Docs/)
[![Three.js](https://img.shields.io/badge/Three.js-0.163.0-green?logo=three.js)](https://threejs.org/)

一个基于 Next.js 构建的先进 Web 增强现实（AR）和机器人控制平台，集成了多种 AR 技术栈和 3D 可视化解决方案。

## 🌟 项目概述

MetaWEBot 是一个全栈的 WebXR 应用程序，旨在为机器人控制和增强现实体验提供统一的 Web 平台。项目整合了最新的 Web 技术，包括增强现实、3D 渲染、实时通信等，为用户提供沉浸式的机器人交互体验。

## ✨ 核心功能

### 🎯 增强现实 (AR) 案例库

- **标记追踪**: 基于传统标记（Hiro、Kanji）的AR体验
- **图像追踪**: 支持自定义图像目标识别
- **人脸追踪**: 基于 MindAR 的面部特征检测与虚拟试戴
- **位置追踪**: GPS 定位的增强现实导航
- **场景物体放置**: 在真实环境中放置和操作虚拟3D对象

### 🎮 3D 模型查看器

- **交互式3D模型**: 支持旋转、缩放、平移操作
- **动画系统**: 播放和控制3D模型动画
- **AR模式**: 一键切换到增强现实查看模式
- **HDR光照**: 支持高动态范围环境光照
- **热点标注**: 3D模型上的交互式信息点

### 🤖 机器人控制接口

- **实时场景同步**: Web界面同步机器人视角场景
- **远程控制**: 通过Web界面操控机器人
- **WebXR集成**: VR/AR环境下的沉浸式机器人控制
- **全景视图**: 360度实时场景展示

## 🛠 技术架构

### 前端技术栈

- **框架**: Next.js 14 (App Router)
- **UI库**: React 18 + TypeScript
- **样式**: Tailwind CSS
- **3D渲染**: Three.js
- **AR引擎**:
  - AR.js (标记追踪)
  - MindAR (人脸/图像追踪)
  - A-Frame (声明式AR)
  - ARCore (移动端AR)

### 3D/AR 组件

- **ModelViewer**: Google Model Viewer 集成
- **ARScene**: 自定义Three.js AR场景
- **AFrameContainer**: A-Frame组件封装

### 项目结构

```
src/
├── app/                    # Next.js App Router页面
│   ├── ar-cases/          # AR案例演示
│   │   └── examples/      # 分类AR示例
│   │       ├── aframe/    # A-Frame实现
│   │       ├── threejs/   # Three.js实现
│   │       ├── mindar/    # MindAR实现
│   │       └── ARCore/    # ARCore实现
│   ├── modelview-cases/   # 3D模型查看案例
│   └── layout.tsx         # 全局布局
├── components/            # 可复用组件
│   ├── ModelViewer.tsx    # 3D模型查看器
│   ├── three-ar-scene.tsx # Three.js AR场景
│   └── aframe-container.tsx # A-Frame容器
├── types/                 # TypeScript类型定义
└── public/
    └── libs/              # 第三方AR库文件
        ├── ar-js/         # AR.js相关资源
        └── mindar/        # MindAR模型和目标
```

## 🚀 快速开始

### 环境要求

- Node.js 18.0+
- npm/yarn/pnpm
- 现代浏览器 (支持WebGL 2.0)
- HTTPS环境 (相机访问要求)

### 安装步骤

1. **克隆项目**

```bash
git clone https://github.com/lzhu686/MetaWEBot.git
cd MetaWEBot
```

2. **安装依赖**

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

3. **下载AR资源文件**

```bash
npm run download-ar
```

4. **启动开发服务器**

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

5. **访问应用**
   打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 生产部署

```bash
# 构建项目
npm run build

# 启动生产服务器
npm run start
```

## 📱 设备兼容性

### 桌面端

- ✅ Chrome 88+
- ✅ Firefox 78+
- ✅ Safari 14+
- ✅ Edge 88+

### 移动端

- ✅ iOS Safari 14+
- ✅ Android Chrome 88+
- ✅ Samsung Internet 15+

### AR功能支持

- **标记追踪**: 所有现代浏览器
- **图像追踪**: WebGL 2.0支持的浏览器
- **WebXR**: Chrome Android, Oculus Browser
- **ARCore**: Android Chrome (ARCore设备)

## 🎮 使用指南

### AR体验

1. 访问 `/ar-cases` 页面
2. 选择感兴趣的AR示例
3. 允许相机访问权限
4. 将相机对准对应的AR标记或目标
5. 享受增强现实体验

### 3D模型查看

1. 访问 `/modelview-cases` 页面
2. 交互操作：
   - **旋转**: 鼠标拖拽
   - **缩放**: 滚轮或双指捏合
   - **平移**: Shift + 拖拽
   - **AR查看**: 点击AR按钮

## 🔧 配置说明

### AR.js 配置

```typescript
// 标记追踪配置
const arToolkitContext = new window.THREEx.ArToolkitContext({
  cameraParametersUrl: '/libs/ar-js/data/camera_para.dat',
  detectionMode: 'mono',
  maxDetectionRate: 60,
  patternRatio: 0.5
});
```

### 性能优化

- 移动端自动降低像素比
- 低端设备性能监控
- 动态调整渲染质量
- 资源懒加载

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 贡献方式

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 开发规范

- 使用 TypeScript 进行类型安全开发
- 遵循 ESLint 代码规范
- 添加适当的注释和文档
- 确保新功能有对应的示例

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。

## 🙏 致谢

感谢以下开源项目：

- [Next.js](https://nextjs.org/) - React全栈框架
- [Three.js](https://threejs.org/) - 3D JavaScript库
- [AR.js](https://ar-js-org.github.io/AR.js-Docs/) - Web AR库
- [A-Frame](https://aframe.io/) - Web VR框架
- [MindAR](https://hiukim.github.io/mind-ar-js-doc/) - 人脸和图像追踪
- [Model Viewer](https://modelviewer.dev/) - 3D模型查看器

## 📞 联系方式

- 项目主页: [https://github.com/lzhu686/MetaWEBot](https://github.com/lzhu686/MetaWEBot)
- 问题反馈: [Issues](https://github.com/lzhu686/MetaWEBot/issues)
- 讨论交流: [Discussions](https://github.com/lzhu686/MetaWEBot/discussions)
- 邮箱联系: lzhu686@connect.hkust-gz.edu.cn

---

⭐ 如果这个项目对您有帮助，请给个Star支持！
