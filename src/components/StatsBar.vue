<script setup>
import { useCoursesStore } from '../stores/courses.js'
import { computed } from 'vue'

const store = useCoursesStore()
const s = computed(() => store.stats)
</script>


<template>
  <div v-if="s" class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
    <div class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 text-center shadow-sm">
      <p class="text-gray-400 dark:text-gray-500 text-xs mb-1.5">總學分</p>
      <p class="text-3xl font-semibold tracking-tight" :class="s.totalCredits >= 128 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'">{{ s.totalCredits }}</p>
      <p class="text-xs text-gray-400 dark:text-gray-600 mt-0.5">門檻 128</p>
    </div>
    <div class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 text-center shadow-sm">
      <p class="text-gray-400 dark:text-gray-500 text-xs mb-1.5">GPA</p>
      <p class="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">{{ s.gpa ?? 'N/A' }}</p>
    </div>
    <div class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 text-center shadow-sm">
      <p class="text-gray-400 dark:text-gray-500 text-xs mb-1.5">系必修</p>
      <p class="text-2xl font-semibold" :class="s.compulsoryCredits >= 31 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-gray-100'">{{ s.compulsoryCredits }}</p>
      <p class="text-xs text-gray-400 dark:text-gray-600 mt-0.5">門檻 31</p>
    </div>
    <div class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 text-center shadow-sm">
      <p class="text-gray-400 dark:text-gray-500 text-xs mb-1.5">專業+學程</p>
      <p class="text-2xl font-semibold" :class="s.csElectiveCredits >= 42 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-gray-100'">{{ s.csElectiveCredits }}</p>
      <p class="text-xs text-gray-400 dark:text-gray-600 mt-0.5">門檻 42</p>
    </div>
    <div class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 text-center shadow-sm">
      <p class="text-gray-400 dark:text-gray-500 text-xs mb-1.5">自由選修</p>
      <p class="text-2xl font-semibold" :class="s.freeCredits >= 17 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-gray-100'">{{ s.freeCredits }}</p>
      <p class="text-xs text-gray-400 dark:text-gray-600 mt-0.5">門檻 17</p>
    </div>
  </div>
</template>
