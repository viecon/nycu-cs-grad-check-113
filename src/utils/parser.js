/**
 * Normalize course name: collapse whitespace, convert full-width parentheses,
 * fix the special CJK compatibility ideograph for 理 (U+F9F1 → U+7406).
 */
export function normalizeName(name) {
  if (!name) return ''
  let n = name.replace(/\s+/g, '')
  n = n.replace(/（/g, '(').replace(/）/g, ')')
  n = n.replace(/\uF9F1/g, '理')
  return n
}

/**
 * Determine general education category from dimension/type fields.
 * Returns one of: 'basic' | 'area' | 'lang' | 'core' | 'other' | null
 */
export function getGenEdCategory(course) {
  const dimRaw = (course.dimension || '').trim()
  const typeRaw = (course.type || '').trim()
  const dim = dimRaw.replace(/\s+/g, '')

  if (dim.startsWith('基本素養')) return 'basic'
  if (dim.startsWith('領域課程')) return 'area'
  if (dim && dim.includes('語言')) return 'lang'

  if (!dim && (typeRaw.includes('外語') || typeRaw.includes('語言'))) return 'lang'
  if (typeRaw.includes('核心課程')) return 'core'
  if (typeRaw.includes('通識')) return 'other'

  return null
}

/**
 * Parse a tab-separated transcript string into an array of course objects.
 * Skips the header row, failed/withdrawn courses.
 */
export function parseTranscript(raw) {
  const lines = raw.trim().split('\n')
  const courses = []

  lines.forEach((line, index) => {
    const cols = line.split('\t')
    if (cols.length < 5) return

    // Skip header row
    if (index === 0 && (line.includes('筆') || line.includes('學期') || line.includes('課號'))) {
      return
    }

    const grade = cols[7] ? cols[7].trim().toUpperCase() : ''
    const status = cols[8] ? cols[8].trim().toUpperCase() : ''

    const failedGrades = ['F', 'X', 'W', '不通過', '退選', '二退']
    const failedStatus = ['W', '退選', '休學']

    if (failedGrades.includes(grade) || failedStatus.some(s => status.includes(s))) {
      return
    }

    const dim = cols.length > 10 ? cols[10].trim() : ''

    courses.push({
      term:      cols[1] || '',
      code:      cols[2] || '',
      dept:      cols[3] || '',
      name:      cols[4] ? cols[4].trim() : '',
      type:      cols[5] || '',
      credit:    parseFloat(cols[6]) || 0,
      grade:     grade,
      dimension: dim,
    })
  })

  return courses
}
