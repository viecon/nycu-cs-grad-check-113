<script setup>
import { useCoursesStore } from '../stores/courses.js'
import { computed } from 'vue'

const store = useCoursesStore()
const s = computed(() => store.stats)
</script>

<template>
  <div v-if="s" class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm p-5 mb-0">
    <h2 class="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-100 dark:border-zinc-800">
      基礎科學
    </h2>
    <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
      <li class="flex justify-between">
        <span>微積分</span>
        <span :class="s.sciCredits.calc >= 8 ? 'pass' : 'fail'">{{ s.sciCredits.calc }} / 8</span>
      </li>
      <li class="flex justify-between">
        <span>三選一：{{ s.bestSci.name }}</span>
        <span :class="s.bestSci.credit >= 6 ? 'pass' : 'fail'">{{ s.bestSci.credit }} / 6</span>
      </li>
    </ul>
  </div>
</template>
