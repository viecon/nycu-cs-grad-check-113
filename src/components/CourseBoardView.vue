<script setup>
import CategoryLane from './CategoryLane.vue'
import { useCoursesStore } from '../stores/courses.js'
import { CATEGORIES, CATEGORY_LABELS } from '../utils/constants.js'

const store = useCoursesStore()

const lanes = [
  { key: CATEGORIES.COMPULSORY,    label: CATEGORY_LABELS[CATEGORIES.COMPULSORY] },
  { key: CATEGORIES.BASIC_PROG,    label: CATEGORY_LABELS[CATEGORIES.BASIC_PROG] },
  { key: CATEGORIES.SCIENCE_CALC,  label: CATEGORY_LABELS[CATEGORIES.SCIENCE_CALC] },
  { key: CATEGORIES.SCIENCE_OTHER, label: CATEGORY_LABELS[CATEGORIES.SCIENCE_OTHER] },
  { key: CATEGORIES.GEN_BASIC,     label: CATEGORY_LABELS[CATEGORIES.GEN_BASIC] },
  { key: CATEGORIES.GEN_AREA,      label: CATEGORY_LABELS[CATEGORIES.GEN_AREA] },
  { key: CATEGORIES.GEN_LANG,      label: CATEGORY_LABELS[CATEGORIES.GEN_LANG] },
  { key: CATEGORIES.CS_ELECTIVE,   label: CATEGORY_LABELS[CATEGORIES.CS_ELECTIVE] },
  { key: CATEGORIES.FREE,          label: CATEGORY_LABELS[CATEGORIES.FREE] },
  { key: CATEGORIES.EXCLUDED,      label: CATEGORY_LABELS[CATEGORIES.EXCLUDED] },
]
</script>

<template>
  <div class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm p-5 mb-6">
    <div class="flex justify-between items-center mb-1">
      <h2 class="text-base font-semibold text-gray-800 dark:text-gray-200">課程分類</h2>
      <button
        @click="store.resetOverrides()"
        class="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
      >
        重置分類
      </button>
    </div>
    <p class="text-xs text-gray-400 dark:text-gray-500 mb-4">
      若分類有誤，直接拖拉課程卡片到正確欄位，統計即時更新。
    </p>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      <CategoryLane
        v-for="lane in lanes"
        :key="lane.key"
        :category-key="lane.key"
        :label="lane.label"
      />
    </div>
  </div>
</template>
