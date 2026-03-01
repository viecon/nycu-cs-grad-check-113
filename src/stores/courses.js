import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { parseTranscript } from '../utils/parser.js'
import { classifyCourses, computeStats } from '../utils/classifier.js'
import { SEVEN_TOPICS } from '../utils/constants.js'
import { normalizeName } from '../utils/parser.js'

export const useCoursesStore = defineStore('courses', () => {
  // --- Persisted input state ---
  const rawInput = useLocalStorage('nycu-grad-check-input', '')
  const englishType = useLocalStorage('nycu-grad-check-english', 'none')

  // --- Parsed & classified courses ---
  const classifiedCourses = ref([])

  // User drag-and-drop overrides: { courseId: newCategory }
  const categoryOverrides = useLocalStorage('nycu-grad-check-overrides', {})

  // Whether analysis has been run
  const analyzed = ref(false)

  // --- Actions ---
  function analyze() {
    const courses = parseTranscript(rawInput.value)
    classifiedCourses.value = classifyCourses(courses)
    // Clear overrides that no longer map to a valid course id
    const validIds = new Set(classifiedCourses.value.map(c => c.id))
    Object.keys(categoryOverrides.value).forEach(id => {
      if (!validIds.has(id)) delete categoryOverrides.value[id]
    })
    analyzed.value = true
  }

  function moveCourse(courseId, newCategory) {
    categoryOverrides.value = { ...categoryOverrides.value, [courseId]: newCategory }
  }

  function resetOverrides() {
    categoryOverrides.value = {}
  }

  // --- Computed: effective categories per course ---
  const effectiveCourses = computed(() =>
    classifiedCourses.value.map(c => ({
      ...c,
      category: categoryOverrides.value[c.id] ?? c.category,
    }))
  )

  // --- Computed: statistics ---
  const stats = computed(() =>
    classifiedCourses.value.length > 0
      ? computeStats(classifiedCourses.value, categoryOverrides.value, englishType.value)
      : null
  )

  // --- Computed: courses grouped by category ---
  const coursesByCategory = computed(() => {
    const groups = {}
    effectiveCourses.value.forEach(c => {
      if (!groups[c.category]) groups[c.category] = []
      groups[c.category].push(c)
    })
    return groups
  })

  // --- Computed: seven topics status ---
  const topicStatus = computed(() => {
    const userNames = effectiveCourses.value.map(c => c.normName)
    return SEVEN_TOPICS.map(topic => {
      let takenCount = 0
      const items = topic.courses.map(req => {
        const isTaken = checkCourseTaken(req, userNames)
        if (isTaken) takenCount++
        return {
          displayName: Array.isArray(req) ? req.join(' / ') : req,
          isTaken,
        }
      })
      let isComplete = false
      let statusText = ''
      if (topic.type === 'fixed') {
        isComplete = takenCount >= topic.courses.length
        statusText = `已修習: ${takenCount} / ${topic.courses.length} 門`
      } else {
        isComplete = takenCount >= 4
        statusText = `已修習: ${takenCount} / 4 門`
      }
      return { ...topic, items, isComplete, statusText }
    })
  })

  return {
    rawInput,
    englishType,
    classifiedCourses,
    categoryOverrides,
    analyzed,
    effectiveCourses,
    stats,
    coursesByCategory,
    topicStatus,
    analyze,
    moveCourse,
    resetOverrides,
  }
})

function checkCourseTaken(target, userCoursesNormalized) {
  if (Array.isArray(target)) {
    return target.some(t => checkCourseTaken(t, userCoursesNormalized))
  }
  const targetNorm = normalizeName(target)
  if (userCoursesNormalized.includes(targetNorm)) return true
  if (targetNorm.includes('專題')) {
    return userCoursesNormalized.some(uc => uc === targetNorm)
  }
  return userCoursesNormalized.some(uc => uc.includes(targetNorm))
}
