# 貢獻指南

感謝您考慮為抽籤系統做出貢獻！

## 如何貢獻

### 回報 Bug

如果您發現了 Bug，請：

1. 檢查 [Issues](../../issues) 確認該問題尚未被回報
2. 使用 Bug 回報模板建立新的 Issue
3. 提供詳細的重現步驟和環境資訊
4. 如果可能，請附上截圖或錯誤訊息

### 建議新功能

如果您有功能建議：

1. 檢查 [Issues](../../issues) 確認該功能尚未被建議
2. 使用功能請求模板建立新的 Issue
3. 清楚描述功能的用途和預期行為
4. 如果可能，提供使用案例

### 提交 Pull Request

1. **Fork 專案**
   ```bash
   git clone https://github.com/YOUR_USERNAME/lottery-system.git
   ```

2. **建立分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

3. **進行變更**
   - 遵循現有的程式碼風格
   - 為新功能添加適當的註釋
   - 確保程式碼可以正常運行

4. **測試您的變更**
   ```bash
   npm run dev
   ```

5. **提交變更**
   ```bash
   git add .
   git commit -m "feat: 新增某功能" 
   # 或
   git commit -m "fix: 修復某問題"
   ```

6. **推送到您的 Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **建立 Pull Request**
   - 使用 PR 模板
   - 清楚描述您的變更
   - 連結相關的 Issue

## Commit 訊息規範

請使用以下格式：

- `feat:` 新功能
- `fix:` Bug 修復
- `docs:` 文件更新
- `style:` 程式碼格式調整（不影響功能）
- `refactor:` 重構
- `test:` 測試相關
- `chore:` 建置或輔助工具的變動

範例：
```
feat: 新增自動更新功能
fix: 修正 Google Sheets API 解析錯誤
docs: 更新 README 使用說明
```

## 程式碼風格

- 使用 2 個空格縮排
- 使用單引號 `'` 而非雙引號 `"`（除非必要）
- 組件名稱使用 PascalCase
- 變數和函數使用 camelCase
- 常數使用 UPPER_SNAKE_CASE

## 開發環境設定

1. **安裝依賴**
   ```bash
   npm install
   ```

2. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

3. **建置專案**
   ```bash
   npm run build
   ```

## 需要幫助？

- 查看 [README.md](README.md) 了解專案資訊
- 在 [Issues](../../issues) 中尋找答案
- 建立新的 Issue 提問

再次感謝您的貢獻！ 🎉
