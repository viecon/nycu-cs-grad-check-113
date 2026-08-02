# NYCU CS 畢業學分檢核工具 (113學年度修訂版)

Website: https://nycu-cs-grad-check-113.viecon.site/

適用 **113 學年度 (2024)** 課綱的 NYCU 資工系畢業學分自動檢核工具。

## 功能特色

- **自動解析成績單**：將校務系統複製的表格文字貼入，即可自動分類課程。
- **拖拉課程卡片**：解析結果以可拖拉卡片呈現，若自動分類有誤，可直接將卡片拖到正確欄位，統計數字即時更新。
- **完整學分檢核**：總學分、GPA、系必修、通識/語言、基礎科學、七大主題學程（115 學年度起規則）、專業選修、自由選修。
- **深色模式**：支援系統偏好自動切換，亦可手動切換。

## 技術棧

- [Vue 3](https://vuejs.org/) + Composition API
- [Vite 7](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Pinia](https://pinia.vuejs.org/) (狀態管理)
- [vuedraggable](https://github.com/SortableJS/vue.draggable.next) (拖拉功能)
- [@vueuse/core](https://vueuse.org/) (localStorage 持久化)

## 開發

```bash
npm install
npm run dev     # 開發伺服器 http://localhost:5173
npm run build   # 生產打包
```

