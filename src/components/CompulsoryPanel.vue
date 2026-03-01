<script setup>
import { useCoursesStore } from '../stores/courses.js'
import { computed } from 'vue'

const store = useCoursesStore()
const s = computed(() => store.stats)
</script>

<template>
  <div v-if="s" class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm p-5 mb-0">
    <h2 class="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-100 dark:border-zinc-800">
      共同必修
    </h2>
    <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
      <li class="flex justify-between">
        <span>體育（6學期）</span>
        <span :class="s.peCount >= 6 ? 'pass' : 'fail'">{{ s.peCount }} / 6</span>
      </li>
      <li class="flex justify-between">
        <span>服務學習（2門）</span>
        <span :class="s.serviceCount >= 2 ? 'pass' : 'fail'">{{ s.serviceCount }} / 2</span>
      </li>
      <li class="flex justify-between">
        <span>導師時間</span>
        <span :class="s.mentorPassed ? 'pass' : 'fail'">{{ s.mentorPassed ? '✔' : '✘' }}</span>
      </li>
    </ul>

    <h2 class="text-base font-semibold text-gray-800 dark:text-gray-200 mt-5 mb-3 pb-2 border-b border-gray-100 dark:border-zinc-800">
      系必修
    </h2>
    <ul class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
      <li
        v-for="(passed, course) in s.compCheck"
        :key="course"
        class="flex justify-between"
      >
        <span>{{ course }}</span>
        <span :class="passed ? 'pass' : 'fail'">{{ passed ? '✔' : '✘' }}</span>
      </li>
      <li class="flex justify-between">
        <span>基礎程式設計</span>
        <span :class="s.basicProgCheck ? 'pass' : 'fail'">{{ s.basicProgCheck ? '✔' : '✘' }}</span>
      </li>
    </ul>
  </div>
</template>
