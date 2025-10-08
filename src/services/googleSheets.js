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
    
    // 從指定的起始列開始讀取
    for (let i = startRow - 1; i < rows.length; i++) {
      const row = rows[i]
      if (row.c && row.c[columnIndex] && row.c[columnIndex].v) {
        const value = row.c[columnIndex].v
        // 只加入非空白的值
        if (value && value.toString().trim() !== '') {
          columnData.push(value.toString().trim())
        }
      }
    }
    
    console.log('提取的欄位資料:', columnData)
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
