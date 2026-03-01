<script setup>
import draggable from 'vuedraggable'
import CourseCard from './CourseCard.vue'
import { useCoursesStore } from '../stores/courses.js'
import { computed } from 'vue'

const props = defineProps({
  categoryKey: { type: String, required: true },
  label: { type: String, required: true },
})

const store = useCoursesStore()

const courses = computed({
  get: () => store.coursesByCategory[props.categoryKey] || [],
  set: (newList) => {
    // Called when an item is dropped into this lane.
    // Mark every item in the new list as belonging to this category.
    newList.forEach(c => {
      const effectiveCat = store.categoryOverrides[c.id] ?? c.category
      if (effectiveCat !== props.categoryKey) {
        store.moveCourse(c.id, props.categoryKey)
      }
    })
  },
})

const totalCredits = computed(() =>
  (store.coursesByCategory[props.categoryKey] || []).reduce((sum, c) => sum + c.credit, 0)
)
</script>

<template>
  <div class="flex flex-col bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden min-h-32">
    <!-- Lane Header -->
    <div class="flex justify-between items-center px-3 py-2.5 border-b border-gray-100 dark:border-zinc-800">
      <span class="font-medium text-sm text-gray-700 dark:text-gray-300">{{ label }}</span>
      <span class="text-xs font-mono text-gray-400 dark:text-gray-500">{{ totalCredits }}cr · {{ courses.length }}</span>
    </div>

    <!-- Drag area -->
    <draggable
      v-model="courses"
      :group="{ name: 'courses' }"
      item-key="id"
      class="flex-1 p-2 space-y-1.5 overflow-y-auto max-h-72"
      ghost-class="sortable-ghost"
    >
      <template #item="{ element }">
        <CourseCard :course="element" />
      </template>
      <template #footer>
        <div v-if="courses.length === 0" class="text-xs text-gray-300 dark:text-gray-600 text-center py-4 select-none">
          拖拉課程到此
        </div>
      </template>
    </draggable>
  </div>
</template>
