<script setup>
defineProps({
  course: { type: Object, required: true },
})
</script>

<template>
  <div
    class="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 shadow-sm cursor-grab active:cursor-grabbing select-none hover:shadow-md hover:border-gray-300 dark:hover:border-zinc-600 transition-all"
  >
    <div class="flex justify-between items-start gap-2">
      <span class="text-sm text-gray-800 dark:text-gray-100 leading-snug flex-1">
        {{ course.name }}
      </span>
      <span class="text-xs font-mono text-gray-400 dark:text-gray-500 whitespace-nowrap shrink-0">
        {{ course.credit }}學分
      </span>
    </div>
    <div class="flex gap-2 mt-1">
      <span class="text-xs text-gray-400 dark:text-gray-500">{{ course.grade }}</span>
      <span v-if="course.dept" class="text-xs text-gray-400 dark:text-gray-500 truncate max-w-28">{{ course.dept }}</span>
    </div>
  </div>
</template>
