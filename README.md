# 照片網格應用

一個簡單的應用程式，讓用戶上傳照片、裁剪及排列成 4x5 網格。

## 功能

- 上傳最多 20 張照片
- 自動裁剪成正方形
- 可拖動排序照片
- 點擊照片可細調裁剪
- 預覽最終排列效果
- 提交照片到服務器

## 開發環境

本項目使用 React 18 和 Vite 構建。

```bash
# 安裝依賴
npm install

# 啟動開發服務器
npm run dev
```

## 部署

應用可以部署到 Vercel 上。默認配置已經提供在 `vercel.json` 文件中。

```bash
# 構建應用
npm run build

# 使用 Vercel CLI 部署
vercel
```

## 查看提交的照片

### 本地開發環境

在開發環境中，提交的照片數據會被保存在 localStorage 中。您可以通過訪問以下頁面查看提交的數據：

```
http://localhost:5173/pages/admin/submissions
```

或在部署後訪問：

```
https://your-domain.com/pages/admin/submissions
```

### 登入憑據

管理頁面需要登入才能訪問，預設憑據為：

- 用戶名：`admin`
- 密碼：`slaviaadmin`

您可以通過環境變量 `ADMIN_PASSWORD` 修改默認密碼。

### 生產環境

在生產環境中，照片數據會被保存在 Vercel KV 存儲中（需要啟用 Vercel KV）。提交的數據可以通過管理頁面或通過 Vercel 儀表板查看。

## 數據持久化

- **開發環境**: 數據保存在瀏覽器的 localStorage 中
- **生產環境**: 數據保存在 Vercel KV 存儲中（需要配置 KV 存儲）

照片數據會被保存 90 天，之後自動過期。
