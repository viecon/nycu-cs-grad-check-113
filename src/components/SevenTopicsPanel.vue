<script setup>
import { useCoursesStore } from '../stores/courses.js'

const store = useCoursesStore()
</script>

<template>
  <div class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm p-5 mb-0 h-full">
    <h2 class="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-100 dark:border-zinc-800">
      七大主題學程
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      <div
        v-for="topic in store.topicStatus"
        :key="topic.title"
        class="border rounded-xl p-4 flex flex-col transition-colors"
        :class="topic.isComplete
          ? 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30'
          : 'border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50'"
      >
        <div class="flex justify-between items-center mb-2 pb-2 border-b border-gray-100 dark:border-zinc-700">
          <span class="font-medium text-sm" :class="topic.isComplete ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'">
            {{ topic.title }}
          </span>
          <span v-if="topic.isComplete" class="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-md font-medium">通過</span>
        </div>
        <p class="text-xs text-gray-400 dark:text-gray-500 mb-2">{{ topic.statusText }}</p>
        <ul class="flex-1 space-y-1">
          <li v-for="item in topic.items" :key="item.displayName" class="flex items-start text-xs">
            <span class="mr-1.5 shrink-0 mt-0.5" :class="item.isTaken ? 'text-emerald-500 dark:text-emerald-400' : 'text-gray-300 dark:text-zinc-600'">
              {{ item.isTaken ? '✔' : '✘' }}
            </span>
            <span :class="item.isTaken ? 'text-gray-700 dark:text-gray-200 font-medium' : 'text-gray-400 dark:text-gray-500'">
              {{ item.displayName }}
            </span>
          </li>
        </ul>
        <p v-if="topic.note" class="text-xs text-gray-400 dark:text-gray-500 mt-2 border-t border-gray-100 dark:border-zinc-700 pt-1.5">
          {{ topic.note }}
        </p>
      </div>
    </div>
  </div>
</template>
