<script setup>
import { useLocalStorage } from '@vueuse/core'
import { computed, watch, onMounted } from 'vue'

const storedDark = useLocalStorage('nycu-grad-check-theme', null)

function getSystemDark() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

const isDark = computed(() =>
  storedDark.value !== null ? storedDark.value : getSystemDark()
)

function applyTheme(dark) {
  document.documentElement.classList.toggle('dark', dark)
}

function toggle() {
  storedDark.value = !isDark.value
}

onMounted(() => {
  applyTheme(isDark.value)
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (storedDark.value === null) applyTheme(getSystemDark())
    })
  }
})

watch(isDark, val => applyTheme(val))
</script>

<template>
  <button
    @click="toggle"
    class="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
    :aria-label="isDark ? '切換淺色模式' : '切換深色模式'"
  >
    {{ isDark ? '淺色模式' : '深色模式' }}
  </button>
</template>
