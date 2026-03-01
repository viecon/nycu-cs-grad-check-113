<script setup>
import { useCoursesStore } from '../stores/courses.js'

const store = useCoursesStore()

function handleAnalyze() {
  if (!store.rawInput.trim()) {
    alert('請先貼上成績單資料！')
    return
  }
  store.analyze()
}
</script>

<template>
  <div class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 mb-6 shadow-sm">
    <label class="block mb-1.5 font-semibold text-gray-800 dark:text-gray-200 text-sm">
      成績單資料
    </label>
    <p class="text-xs text-gray-400 dark:text-gray-500 mb-3">
      請貼上校務系統複製的表格文字（含標題列與「向度」欄位）
    </p>
    <textarea
      v-model="store.rawInput"
      class="w-full h-36 p-3 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 resize-none transition"
      placeholder="筆	學期	課號	開課單位	課程名稱	..."
    />

    <!-- 英文課程選項 -->
    <div class="mt-4 p-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800">
      <span class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
        英文課程申請狀態
      </span>
      <div class="flex flex-col space-y-2.5">
        <label class="inline-flex items-center cursor-pointer gap-2.5">
          <input type="radio" v-model="store.englishType" value="none" class="w-3.5 h-3.5 accent-blue-600" />
          <span class="text-sm text-gray-700 dark:text-gray-300">無（依成績單計算）</span>
        </label>
        <label class="inline-flex items-start cursor-pointer gap-2.5">
          <input type="radio" v-model="store.englishType" value="exemption" class="w-3.5 h-3.5 mt-0.5 accent-blue-600" />
          <div>
            <span class="block text-sm font-medium text-gray-700 dark:text-gray-300">申請「免修」</span>
            <span class="text-xs text-gray-400 dark:text-gray-500">0 學分，須補修其他課程</span>
          </div>
        </label>
        <label class="inline-flex items-start cursor-pointer gap-2.5">
          <input type="radio" v-model="store.englishType" value="transfer" class="w-3.5 h-3.5 mt-0.5 accent-blue-600" />
          <div>
            <span class="block text-sm font-medium text-gray-700 dark:text-gray-300">申請「抵修」</span>
            <span class="text-xs text-gray-400 dark:text-gray-500">獲得 4 學分（適用高階英檢通過者）</span>
          </div>
        </label>
      </div>
    </div>

    <button
      @click="handleAnalyze"
      class="mt-4 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-2.5 rounded-xl text-sm font-semibold transition"
    >
      開始分析
    </button>
  </div>
</template>
