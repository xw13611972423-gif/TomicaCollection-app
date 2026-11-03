# 多美卡收藏（Tomica Collection）

一款用 **React Native + Expo** 打造的多美卡（TOMICA）合金小车收藏管理 App，支持 iOS / Android / Web。

## ✨ 功能

- 📷 **照片记录**：拍照或从相册选择，支持旋转 / 翻转 / 裁切
- 🚗 **车型库**：60+ 真实多美卡现役车型（含编号）+ 自定义车型（自动记忆）
- 🔢 **编号记录与搜索**：按包装盒编号记录，输入编号即可找到车型
- 🎨 **颜色管理**：快捷色 + 细节色盘（色相/饱和度/明度）+ 十六进制精确输入
- 💰 **价格**：金额 + 多币种（¥ / JPY / $ / € / £ / HK$ / NT$）
- 📍 **购买地**：快捷选项 + 自由输入
- 🔍 **搜索与筛选**：按型号/编号/颜色/备注/价格/购买地搜索，按颜色筛选
- 🖼 **空状态自定义图片**：可设置首页空状态展示图
- 🌗 **深色 / 浅色模式**：跟随系统 / 浅色 / 深色三档
- 🧊 **液态玻璃质感**：半透明磨砂 + 过渡动画（可在设置中开关）
- 📱 **iPad 自适应**：卡片自动换列、详情左右分栏、横竖屏

## 🛠 技术栈

- React Native 0.88 / Expo SDK 58 / React 19
- 数据本地持久化：AsyncStorage（照片存 App 文档目录）

## 🚀 构建

```bash
npm install

# 开发调试
npm run start

# Web
npm run web

# iOS / Android
npm run ios
npm run android
```

## 📦 未签名 IPA

[Release](https://github.com/xw13611972423-gif/TomicaCollection-app/releases) 页面提供在 macOS（Xcode 26）上编译出的**未签名 IPA**，需自行签名后安装（如 AltStore、爱思助手等）。

> 编号为现行常规版参考值，可能因年份/版本不同，请以包装盒为准（字段可编辑）。

## 📝 更新日志

见 [CHANGELOG.md](CHANGELOG.md)。
