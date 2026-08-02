import { normalizeName } from './parser.js'

export function evaluateTopics(topics, userCourseNames) {
  const normalizedNames = new Set(userCourseNames.map(normalizeName))

  return topics.map(topic => {
    const groups = topic.requirements.map(requirement => {
      const items = requirement.courses.map(course => ({
        displayName: Array.isArray(course) ? course.join(' / ') : course,
        isTaken: isCourseTaken(course, normalizedNames),
      }))
      const takenCount = items.filter(item => item.isTaken).length

      return {
        ...requirement,
        items,
        takenCount,
        isComplete: takenCount >= requirement.required,
        statusText: `${takenCount} / ${requirement.required} 門`,
      }
    })

    const completedCount = groups.reduce(
      (sum, group) => sum + Math.min(group.takenCount, group.required),
      0,
    )
    const requiredCount = groups.reduce((sum, group) => sum + group.required, 0)

    return {
      ...topic,
      groups,
      isComplete: groups.every(group => group.isComplete),
      statusText: `條件進度: ${completedCount} / ${requiredCount} 門`,
    }
  })
}

export function isCourseTaken(target, normalizedUserCourseNames) {
  const aliases = Array.isArray(target) ? target : [target]
  return aliases.some(alias => normalizedUserCourseNames.has(normalizeName(alias)))
}
