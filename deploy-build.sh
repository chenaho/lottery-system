#!/bin/bash

# 部署腳本 - 用於建置和檢查部署設定

echo "🚀 開始建置部署版本..."
echo ""

# 檢查 .env 檔案是否存在
if [ ! -f .env ]; then
    echo "⚠️  未找到 .env 檔案，將使用預設設定"
    echo "💡 建議：複製 .env.example 為 .env 並設定 VITE_BASE_PATH"
    echo ""
fi

# 顯示目前的 BASE_PATH 設定
if [ -f .env ]; then
    source .env
    if [ -n "$VITE_BASE_PATH" ]; then
        echo "📍 BASE PATH: $VITE_BASE_PATH"
    else
        echo "📍 BASE PATH: / (預設)"
    fi
else
    echo "📍 BASE PATH: / (預設)"
fi

echo ""
echo "🔨 執行建置..."

# 清除舊的 dist
rm -rf dist

# 執行建置
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 建置成功！"
    echo ""
    echo "📦 建置檔案位於: ./dist"
    echo ""
    
    # 檢查 index.html 中的資源路徑
    if [ -f dist/index.html ]; then
        echo "🔍 檢查資源路徑..."
        
        # 提取 script 和 link 標籤的 src/href 屬性
        SCRIPT_SRC=$(grep -o 'src="[^"]*"' dist/index.html | head -1)
        LINK_HREF=$(grep -o 'href="[^"]*\.css"' dist/index.html | head -1)
        
        if [ -n "$SCRIPT_SRC" ]; then
            echo "   JavaScript: $SCRIPT_SRC"
        fi
        
        if [ -n "$LINK_HREF" ]; then
            echo "   CSS: $LINK_HREF"
        fi
        
        echo ""
    fi
    
    echo "📋 下一步："
    echo "   1. 檢查上述路徑是否正確"
    echo "   2. 如果使用自訂網域，路徑應該是 /assets/..."
    echo "   3. 如果使用 GitHub Pages，路徑應該是 /repo-name/assets/..."
    echo ""
    echo "🚀 部署方式："
    echo "   • GitHub Pages: git push (自動部署)"
    echo "   • 手動部署: 上傳 dist/ 目錄到伺服器"
    echo ""
else
    echo ""
    echo "❌ 建置失敗！"
    echo "請檢查錯誤訊息並修正問題"
    exit 1
fi
