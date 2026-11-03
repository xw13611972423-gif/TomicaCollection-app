# 多美卡收藏（Tomica Collection）

一款用 **React Native + Expo** 打造的多美卡（TOMICA）合金小车收藏管理 App，支持 iOS / Android / Web。

## ✨ 功能

- 📷 **照片记录**：拍照或从相册选择每辆车的照片
- 🚗 **车型库**：内置 60+ 常见多美卡车型，支持自定义型号 + 型号搜索
- 🔢 **编号记录与搜索**：按包装盒上的两位编号记录，搜索框输入编号即可找到车型
- 🎨 **颜色管理**：快捷色 + 细节色盘（色相 / 饱和度 / 明度）+ 十六进制精确输入
- 💰 **价格**：金额 + 多币种（¥ / $ / € / £ / HK$ / NT$）
- 📍 **购买地**：快捷选项 + 自由输入
- 🔍 **搜索与筛选**：按型号 / 编号 / 颜色 / 备注 / 价格 / 购买地搜索，按型号 / 颜色筛选
- 🌗 **深色 / 浅色模式**：跟随系统 / 浅色 / 深色三档
- 🧊 **液态玻璃质感**：卡片、顶栏与按钮的半透明磨砂质感（可在设置中开关）
- 📱 **iPad 自适应**：卡片自动换列、详情页左右分栏、支持横竖屏旋转

## 🛠 技术栈

- React Native 0.88 / Expo SDK 58 / React 19
- 数据本地持久化：AsyncStorage（照片存 App 文档目录，Web 存 localStorage）

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

> 编号说明：预置车型的编号字段默认留空，请按你收藏的车包装盒上的两位编号自行填写（字段可编辑，搜索按你填的编号匹配）。
