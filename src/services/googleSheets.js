import axios from 'axios'

/**
 * Google Sheets API 服務
 * 用於從公開的 Google Sheets 讀取資料
 */

// 將 Google Sheets 公開連結轉換為 JSON API 網址
export const getSheetJsonUrl = (spreadsheetId, sheetGid = 0) => {
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&gid=${sheetGid}`
}

// 從 Google Sheets URL 中提取 spreadsheet ID
export const extractSpreadsheetId = (url) => {
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/)
  return match ? match[1] : null
}

// 從 Google Sheets URL 中提取 GID (工作表 ID)
export const extractGid = (url) => {
  const match = url.match(/[#&]gid=([0-9]+)/)
  return match ? match[1] : '0'
}

// 解析 Google Sheets JSON 回應
const parseGoogleSheetsResponse = (responseText) => {
  // Google Sheets API 會回傳一個帶有 JSONP callback 的回應
  // 我們需要去掉前綴和後綴來取得純 JSON
  let jsonString = responseText
  
  // 移除 JSONP callback 包裝
  // 格式通常是: /*O_o*/\ngoogle.visualization.Query.setResponse({...});
  
  // 移除開頭的註解 /*O_o*/
  jsonString = jsonString.replace(/^\/\*.*?\*\/\s*/, '')
  
  // 移除 google.visualization.Query.setResponse( 前綴
  jsonString = jsonString.replace(/^\s*google\.visualization\.Query\.setResponse\s*\(\s*/, '')
  
  // 移除結尾的 );
  jsonString = jsonString.replace(/\s*\)\s*;?\s*$/, '')
  
  return JSON.parse(jsonString)
}

// 從特定欄位提取資料
export const getColumnData = async (spreadsheetUrl, columnLetter = 'C', startRow = 2) => {
  try {
    // 驗證起始列至少為 2（因為第 1 列是表頭）
    const validStartRow = Math.max(2, startRow)
    if (startRow < 2) {
      console.warn(`起始列設定為 ${startRow}，已自動調整為 2（第 1 列為表頭）`)
    }
    
    const spreadsheetId = extractSpreadsheetId(spreadsheetUrl)
    const gid = extractGid(spreadsheetUrl)
    
    if (!spreadsheetId) {
      throw new Error('無法從 URL 中提取 Spreadsheet ID')
    }

    const apiUrl = getSheetJsonUrl(spreadsheetId, gid)
    console.log('請求 API URL:', apiUrl)
    
    const response = await axios.get(apiUrl)
    console.log('原始回應:', response.data.substring(0, 200))
    
    // 解析回應
    const data = parseGoogleSheetsResponse(response.data)
    console.log('解析後的資料:', data)
    
    // 檢查是否有錯誤
    if (data.status === 'error') {
      throw new Error(`Google Sheets API 錯誤: ${data.errors[0].detailed_message || data.errors[0].message}`)
    }
    
    // 取得欄位索引 (A=0, B=1, C=2, ...)
    const columnIndex = columnLetter.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0)
    
    // 提取資料
    const rows = data.table.rows
    const columnData = []
    
    console.log(`📊 Google Sheets 讀取資訊:`)
    console.log(`   - 總列數: ${rows.length}`)
    console.log(`   - 欄位: ${columnLetter} (索引: ${columnIndex})`)
    console.log(`   - 起始列設定: ${startRow}`)
    console.log(`   - 驗證後起始列: ${validStartRow}`)
    console.log(`   - 陣列起始索引: ${validStartRow - 1}`)
    console.log(`   - 實際讀取範圍: 第 ${validStartRow} 列到第 ${rows.length} 列`)
    
    // 從指定的起始列開始讀取（使用驗證後的起始列）
    for (let i = validStartRow - 1; i < rows.length; i++) {
      const row = rows[i]
      console.log(`   [列 ${i + 1}] 檢查中...`, row.c ? `有資料` : `無資料`)
      
      if (row.c && row.c[columnIndex] && row.c[columnIndex].v) {
        const value = row.c[columnIndex].v
        console.log(`   [列 ${i + 1}] 欄位 ${columnLetter} 的值: "${value}"`)
        // 只加入非空白的值
        if (value && value.toString().trim() !== '') {
          columnData.push(value.toString().trim())
          console.log(`   ✅ [列 ${i + 1}] 已加入: "${value.toString().trim()}"`)
        } else {
          console.log(`   ⚠️ [列 ${i + 1}] 值為空，跳過`)
        }
      } else {
        console.log(`   ⚠️ [列 ${i + 1}] 欄位 ${columnLetter} 無資料`)
      }
    }
    
    console.log('✅ 最終提取的欄位資料:', columnData)
    console.log(`✅ 共提取 ${columnData.length} 筆資料`)
    return columnData
  } catch (error) {
    console.error('讀取 Google Sheets 資料時發生錯誤:', error)
    throw new Error(`無法讀取 Google Sheets 資料: ${error.message}`)
  }
}

// 取得完整的工作表資料
export const getSheetData = async (spreadsheetUrl) => {
  try {
    const spreadsheetId = extractSpreadsheetId(spreadsheetUrl)
    const gid = extractGid(spreadsheetUrl)
    
    if (!spreadsheetId) {
      throw new Error('無法從 URL 中提取 Spreadsheet ID')
    }

    const apiUrl = getSheetJsonUrl(spreadsheetId, gid)
    const response = await axios.get(apiUrl)
    
    // 解析回應
    const data = parseGoogleSheetsResponse(response.data)
    
    return data.table
  } catch (error) {
    console.error('讀取 Google Sheets 資料時發生錯誤:', error)
    throw new Error(`無法讀取 Google Sheets 資料: ${error.message}`)
  }
}

// 取得 Google Sheets 的文件標題
export const getSheetTitle = async (spreadsheetUrl) => {
  try {
    const spreadsheetId = extractSpreadsheetId(spreadsheetUrl)
    
    if (!spreadsheetId) {
      throw new Error('無法從 URL 中提取 Spreadsheet ID')
    }

    // 方法 1: 嘗試從 HTML 頁面抓取標題
    try {
      const htmlUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
      const response = await axios.get(htmlUrl)
      const html = response.data
      
      // 從 HTML 中提取標題
      // Google Sheets 的標題在 <title> 標籤中，格式為 "文件標題 - Google 試算表"
      const titleMatch = html.match(/<title>([^<]*)<\/title>/)
      if (titleMatch && titleMatch[1]) {
        let title = titleMatch[1]
        // 移除 " - Google 試算表" 或 " - Google Sheets" 後綴
        title = title.replace(/\s*-\s*Google\s*(試算表|Sheets|スプレッドシート)\s*$/i, '').trim()
        
        if (title && title !== '') {
          return {
            title: title,
            spreadsheetId: spreadsheetId,
            source: 'html'
          }
        }
      }
    } catch (htmlError) {
      console.log('從 HTML 抓取標題失敗，嘗試備用方法:', htmlError.message)
    }

    // 方法 2: 備用方案 - 從 JSON API 抓取（這會是工作表標題，但至少有資訊）
    const gid = extractGid(spreadsheetUrl)
    const apiUrl = getSheetJsonUrl(spreadsheetId, gid)
    const response = await axios.get(apiUrl)
    const data = parseGoogleSheetsResponse(response.data)
    
    // 嘗試從不同欄位獲取標題
    const sheetTitle = data.table?.label || '未命名的試算表'
    
    return {
      title: `📑 ${sheetTitle}`,
      spreadsheetId: spreadsheetId,
      gid: gid,
      source: 'api',
      note: '顯示的是工作表名稱'
    }
  } catch (error) {
    console.error('取得 Google Sheets 標題時發生錯誤:', error)
    return {
      title: '無法取得標題',
      error: error.message
    }
  }
}
