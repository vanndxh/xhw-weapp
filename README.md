# xhw-weapp

基于 Taro + React + TypeScript 开发的多端小程序项目。

## 技术栈

- Taro 4.0.9
- React 18
- TypeScript
- Less

## 开发环境要求

- Node.js >= 14
- npm >= 6

## 项目运行

```bash
# 安装依赖
npm install

# 开发模式运行（微信小程序）
npm run dev:weapp

# 打包（微信小程序）
npm run build:weapp
```

## 支持平台

- 微信小程序
- 支付宝小程序
- 百度小程序
- 字节跳动小程序
- QQ 小程序
- 京东小程序
- H5
- React Native
- 鸿蒙应用

## 项目结构

```
├── config                 // 项目配置
├── src                   // 源代码
├── types                 // 类型定义
├── .env.development      // 开发环境配置
├── .env.production       // 生产环境配置
├── .env.test            // 测试环境配置
└── project.config.json   // 项目配置文件
```

## 开发规范

- 使用 ESLint 进行代码检查
- 使用 TypeScript 进行类型检查
- 使用 Less 进行样式开发

## License

MIT
