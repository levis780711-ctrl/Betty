# 不油自主 BÜLIO 油切發泡錠 - 一頁式導購網站

這是一個專為「不油自主 BÜLIO 油切發泡錠」設計的高質感、高轉換率一頁式導購網站（Landing Page）。
具備響應式設計（手機優先）、流暢的動畫滾動、互動式方案選擇卡片，以及完整的結帳收件表單。

## 網站特點
- **極致視覺體驗**：以產品形象色（暖橘、紅棕）為主調，搭配精美字型與毛玻璃（Glassmorphism）UI。
- **響應式排版**：針對行動端（手機）進行深度優化，90% 以上的手機皆能完美呈現。
- **延遲載入 (Lazy Loading)**：除了首要的 Hero Banner，其他大圖皆使用懶載入，提升網頁加載速度與流暢度。
- **互動式結帳表單**：
  - 點擊「立即搶購」會平滑滾動至結帳區。
  - 點擊「方案卡片」會即時更新表單的商品種類與金額。
  - 欄位即時驗證（手機格式、姓名、地址等必填欄位）。
  - 提供模擬訂單成功通知，並預留 Formspree / Google Forms 串接介面。

---

## 檔案結構
- `index.html`：網頁主結構，包含 9 大視覺區塊、方案選擇及收件表單。
- `style.css`：網頁視覺樣式、動畫效果、響應式排版。
- `script.js`：網頁互動邏輯、表單驗證、方案切換計算。
- `*.png`：網頁使用的 9 張高解析度視覺設計圖。

---

## 部署教學

### 部署至 GitHub Pages
1. 將此專案推送（Push）至您的 GitHub 儲存庫（Repository）。
2. 在 GitHub 該專案頁面，點擊 **Settings** (設定)。
3. 在左側選單中找到 **Pages**。
4. 在 **Build and deployment** 下的 **Source** 選擇 `Deploy from a branch`。
5. 在 **Branch** 選擇 `main` (或您目前的分支) 且資料夾選擇 `/ (root)`，點擊 **Save**。
6. 等待數分鐘後，GitHub 將提供您的專案網址（例如：`https://username.github.io/Betty/`）。

### 部署至 Zeabur
Zeabur 支援一鍵部署 GitHub 儲存庫，並會自動偵測靜態網站。
1. 註冊並登入 [Zeabur 控制台](https://zeabur.com/)。
2. 點擊 **Create Project** (建立專案) 並選擇您的部署區域。
3. 點擊 **Deploy Service** (部署服務) -> **GitHub**，授權並選擇您的 `Betty` 儲存庫。
4. Zeabur 會自動偵測到 `index.html` 並將其識別為 **Static** (靜態網站) 服務開始部署。
5. 部署完成後，點擊該服務的 **Domain** (網域) 設定，即可綁定 Zeabur 提供的免費子網域（如 `bulio.zeabur.app`）或您自己的自訂網域。
