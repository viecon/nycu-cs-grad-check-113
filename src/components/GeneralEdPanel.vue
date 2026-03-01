<script setup>
import { useCoursesStore } from '../stores/courses.js'
import { computed } from 'vue'

const store = useCoursesStore()
const s = computed(() => store.stats)
</script>

<template>
  <div v-if="s" class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm p-5 mb-0">
    <h2 class="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-100 dark:border-zinc-800">
      通識與語言
    </h2>

    <!-- Core progress bar -->
    <div class="mb-4">
      <div class="flex justify-between text-xs font-medium mb-1.5 text-gray-600 dark:text-gray-400">
        <span>核心課程（需 18 學分）</span>
        <span :class="s.genEdStats.coreTotal >= 18 ? 'pass' : 'fail'">
          {{ s.genEdStats.coreTotal }} / 18
        </span>
      </div>
      <div class="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-1.5">
        <div
          class="h-1.5 rounded-full transition-all"
          :class="s.genEdStats.coreTotal >= 18 ? 'bg-emerald-500' : 'bg-blue-500'"
          :style="{ width: Math.min((s.genEdStats.coreTotal / 18) * 100, 100) + '%' }"
        />
      </div>
    </div>

    <!-- Basic -->
    <div class="mb-3">
      <div class="flex justify-between text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">
        <span>基本素養</span>
        <span :class="s.genEdStats.basic >= 6 ? 'pass' : 'fail'">{{ s.genEdStats.basic }} / 6</span>
      </div>
      <ul class="text-xs text-gray-500 dark:text-gray-400 space-y-0.5 pl-2">
        <li v-for="entry in s.genEdLogs.basic" :key="entry">
          <span class="badge badge-basic">基本</span>{{ entry }}
        </li>
        <li v-if="s.genEdLogs.basic.length === 0" class="text-gray-300 dark:text-gray-600">無</li>
      </ul>
    </div>

    <!-- Area -->
    <div class="mb-4">
      <div class="flex justify-between text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">
        <span>領域課程</span>
        <span :class="s.genEdStats.area >= 8 ? 'pass' : 'fail'">{{ s.genEdStats.area }} / 8</span>
      </div>
      <ul class="text-xs text-gray-500 dark:text-gray-400 space-y-0.5 pl-2">
        <li v-for="entry in s.genEdLogs.area" :key="entry">
          <span class="badge badge-area">領域</span>{{ entry }}
        </li>
        <li v-if="s.genEdLogs.area.length === 0" class="text-gray-300 dark:text-gray-600">無</li>
      </ul>
    </div>

    <!-- Language -->
    <div class="border-t border-gray-100 dark:border-zinc-800 pt-3">
      <div class="flex justify-between text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">
        <span>語言與溝通（含英文）</span>
        <span :class="s.genEdStats.lang >= 6 ? 'pass' : 'fail'">{{ s.genEdStats.lang }} / 6</span>
      </div>
      <ul class="text-xs text-gray-500 dark:text-gray-400 space-y-0.5 pl-2">
        <li v-for="entry in s.genEdLogs.lang" :key="entry">
          <span class="badge badge-lang">語言</span>
          <span v-html="entry" />
        </li>
        <li v-if="s.genEdLogs.lang.length === 0" class="text-gray-300 dark:text-gray-600">無</li>
      </ul>
    </div>
  </div>
</template>
