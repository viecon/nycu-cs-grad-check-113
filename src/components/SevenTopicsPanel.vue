<script setup>
import { useCoursesStore } from '../stores/courses.js'

const store = useCoursesStore()
</script>

<template>
  <div class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm p-5 mb-0 h-full">
    <h2 class="text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-100 dark:border-zinc-800 flex items-center gap-2">
      七大主題學程
      <span class="text-xs font-normal text-gray-400 dark:text-gray-500">115 學年度起</span>
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
        <div class="flex-1 space-y-3">
          <section v-for="group in topic.groups" :key="group.label">
            <div class="flex justify-between gap-2 mb-1 text-xs">
              <span class="font-medium text-gray-600 dark:text-gray-300">{{ group.label }}</span>
              <span :class="group.isComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'">
                {{ group.statusText }}
              </span>
            </div>
            <ul class="space-y-1">
              <li v-for="item in group.items" :key="item.displayName" class="flex items-start text-xs">
                <span class="mr-1.5 shrink-0 mt-0.5" :class="item.isTaken ? 'text-emerald-500 dark:text-emerald-400' : 'text-gray-300 dark:text-zinc-600'">
                  {{ item.isTaken ? '✔' : '✘' }}
                </span>
                <span :class="item.isTaken ? 'text-gray-700 dark:text-gray-200 font-medium' : 'text-gray-400 dark:text-gray-500'">
                  {{ item.displayName }}
                </span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
