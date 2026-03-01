<script setup>
import { useCoursesStore } from './stores/courses.js'
import ThemeToggle from './components/ThemeToggle.vue'
import InputSection from './components/InputSection.vue'
import StatsBar from './components/StatsBar.vue'
import CourseBoardView from './components/CourseBoardView.vue'
import GeneralEdPanel from './components/GeneralEdPanel.vue'
import SciencePanel from './components/SciencePanel.vue'
import CompulsoryPanel from './components/CompulsoryPanel.vue'
import SevenTopicsPanel from './components/SevenTopicsPanel.vue'

const store = useCoursesStore()
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 p-4 md:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex justify-end mb-6">
        <ThemeToggle />
      </div>
      <h1 class="text-2xl font-semibold text-center text-gray-900 dark:text-gray-50 mb-1 tracking-tight">
        NYCU CS 畢業學分檢核
      </h1>
      <p class="text-center text-gray-400 dark:text-gray-500 mb-8 text-sm">
        適用 113 學年度 (2024) 課綱
      </p>

      <!-- Input -->
      <InputSection />

      <!-- Results -->
      <template v-if="store.analyzed">
        <StatsBar />
        <CourseBoardView />

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div class="lg:col-span-1 flex flex-col gap-6">
            <GeneralEdPanel />
            <SciencePanel />
            <CompulsoryPanel />
          </div>
          <div class="lg:col-span-2">
            <SevenTopicsPanel />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

