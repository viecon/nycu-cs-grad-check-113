import { CORE_RULES, GRADE_TO_GPA, CATEGORIES } from './constants.js'
import { normalizeName, getGenEdCategory } from './parser.js'

/**
 * Assign an initial category to each parsed course.
 * Returns an array of enriched course objects with an `id` and `category` field.
 */
export function classifyCourses(courses) {
  let idCounter = 0
  return courses.map(c => {
    const category = detectCategory(c)
    return {
      ...c,
      id: `course-${idCounter++}`,
      normName: normalizeName(c.name),
      category,
    }
  })
}

function detectCategory(c) {
  const nName = normalizeName(c.name)
  const cCode = c.code || ''
  const cType = (c.type || '').trim()

  // 1. Excluded: PE, service learning, mentor, military
  if (c.name.includes('體育') || cType.includes('體育')) return CATEGORIES.EXCLUDED
  if (c.name.includes('服務學習')) return CATEGORIES.EXCLUDED
  if (c.name.includes('導師時間')) return CATEGORIES.EXCLUDED
  if (cType.includes('軍訓') || c.name.includes('軍訓') || c.name.includes('全民國防')) return CATEGORIES.EXCLUDED

  // 2. 系必修
  const compMatch = CORE_RULES.compulsory.find(req => {
    if (req.includes('專題')) return nName === normalizeName(req)
    return nName.includes(normalizeName(req))
  })
  if (compMatch) return CATEGORIES.COMPULSORY

  // 3. 基礎程式設計 (系必修附屬)
  if (c.name.includes('基礎程式設計')) return CATEGORIES.BASIC_PROG

  // 4. 基礎科學 - 微積分
  if (nName.includes('微積分')) return CATEGORIES.SCIENCE_CALC

  // 5. 基礎科學 - 物理/化學/生物
  if (nName.includes('物理')) return CATEGORIES.SCIENCE_OTHER
  if (nName.includes('化學')) return CATEGORIES.SCIENCE_OTHER
  if (nName.includes('生物') && !nName.includes('工程')) return CATEGORIES.SCIENCE_OTHER

  // 6. 通識與語言
  const genCat = getGenEdCategory(c)
  if (genCat === 'basic') return CATEGORIES.GEN_BASIC
  if (genCat === 'area')  return CATEGORIES.GEN_AREA
  if (genCat === 'lang')  return CATEGORIES.GEN_LANG
  if (genCat === 'core')  return CATEGORIES.GEN_CORE
  if (genCat === 'other') return CATEGORIES.GEN_OTHER

  // 7. 專業/學程選修
  if (
    c.dept.includes('資工') || c.dept.includes('網工') ||
    c.dept.includes('數據') || c.dept.includes('資安') ||
    c.dept.includes('資科') || cCode.startsWith('5')
  ) return CATEGORIES.CS_ELECTIVE

  // 8. 自由選修 (default)
  return CATEGORIES.FREE
}

/**
 * Compute statistics from an array of classified courses.
 * `overrides` is a map of { courseId: newCategory } from user drag-and-drop.
 */
export function computeStats(classifiedCourses, overrides = {}, englishType = 'none') {
  // Apply overrides
  const courses = classifiedCourses.map(c => ({
    ...c,
    category: overrides[c.id] ?? c.category,
  }))

  let totalCredits = 0
  let compulsoryCredits = 0
  let csElectiveCredits = 0
  let freeCredits = 0
  let basicProgCheck = false

  const genEdStats = { basic: 0, area: 0, lang: 0, coreTotal: 0, otherGen: 0 }
  const genEdLogs = { basic: [], area: [], lang: [] }

  let peTerms = new Set()
  let serviceCount = 0
  let mentorPassed = false

  const sciCredits = { calc: 0, phy: 0, chem: 0, bio: 0 }
  const compCheck = {}
  CORE_RULES.compulsory.forEach(name => { compCheck[name] = false })

  // Handle English transfer/exemption
  if (englishType === 'transfer') {
    genEdStats.lang += 4
    totalCredits += 4
    genEdLogs.lang.push('[抵修] 英文課程 (4)')
  } else if (englishType === 'exemption') {
    genEdLogs.lang.push('[免修] 英文課程 (0)')
  }

  // GPA
  let gpaPoints = 0
  let gpaCredits = 0

  courses.forEach(c => {
    const cat = c.category
    const gpaVal = GRADE_TO_GPA[c.grade]
    if (gpaVal !== undefined && c.credit > 0) {
      gpaPoints += gpaVal * c.credit
      gpaCredits += c.credit
    }

    if (cat === CATEGORIES.EXCLUDED) {
      if (c.name.includes('體育') || (c.type || '').includes('體育')) peTerms.add(c.term)
      else if (c.name.includes('服務學習')) serviceCount++
      else if (c.name.includes('導師時間')) mentorPassed = true
      return
    }

    if (cat === CATEGORIES.COMPULSORY) {
      totalCredits += c.credit
      const matched = CORE_RULES.compulsory.find(req => {
        if (req.includes('專題')) return c.normName === normalizeName(req)
        return c.normName.includes(normalizeName(req))
      })
      if (matched && !compCheck[matched]) {
        compCheck[matched] = true
        compulsoryCredits += c.credit
      }
      return
    }

    if (cat === CATEGORIES.BASIC_PROG) {
      basicProgCheck = true
      return
    }

    if (cat === CATEGORIES.SCIENCE_CALC) {
      sciCredits.calc += c.credit
      totalCredits += c.credit
      return
    }

    if (cat === CATEGORIES.SCIENCE_OTHER) {
      const nName = c.normName
      if (nName.includes('物理')) sciCredits.phy += c.credit
      else if (nName.includes('化學')) sciCredits.chem += c.credit
      else if (nName.includes('生物')) sciCredits.bio += c.credit
      else {
        // generic other science
        sciCredits.phy += c.credit
      }
      totalCredits += c.credit
      return
    }

    if (cat === CATEGORIES.GEN_BASIC) {
      genEdStats.basic += c.credit
      genEdStats.coreTotal += c.credit
      genEdLogs.basic.push(`${c.name} (${c.credit})`)
      totalCredits += c.credit
      return
    }
    if (cat === CATEGORIES.GEN_AREA) {
      genEdStats.area += c.credit
      genEdStats.coreTotal += c.credit
      genEdLogs.area.push(`${c.name} (${c.credit})`)
      totalCredits += c.credit
      return
    }
    if (cat === CATEGORIES.GEN_LANG) {
      genEdStats.lang += c.credit
      genEdLogs.lang.push(`${c.name} (${c.credit})`)
      totalCredits += c.credit
      return
    }
    if (cat === CATEGORIES.GEN_CORE) {
      genEdStats.coreTotal += c.credit
      totalCredits += c.credit
      return
    }
    if (cat === CATEGORIES.GEN_OTHER) {
      genEdStats.otherGen += c.credit
      totalCredits += c.credit
      return
    }

    if (cat === CATEGORIES.CS_ELECTIVE) {
      csElectiveCredits += c.credit
      totalCredits += c.credit
      return
    }

    if (cat === CATEGORIES.FREE) {
      freeCredits += c.credit
      totalCredits += c.credit
      return
    }
  })

  // Overflow logic
  // Physics overflow → CS elective
  const sciOptions = [
    { name: '物理', credit: sciCredits.phy },
    { name: '化學', credit: sciCredits.chem },
    { name: '生物', credit: sciCredits.bio },
  ]
  const bestSci = sciOptions.reduce((a, b) => (a.credit > b.credit ? a : b))
  let phyOverflow = 0
  if (bestSci.name === '物理' && bestSci.credit >= 8) {
    phyOverflow = bestSci.credit - 6
    csElectiveCredits += phyOverflow
  }

  // CS elective overflow → free
  let csOverflow = 0
  if (csElectiveCredits > 42) {
    csOverflow = csElectiveCredits - 42
    freeCredits += csOverflow
  }

  // Core/lang overflow → free (max 4)
  const coreOverflow = Math.max(0, genEdStats.coreTotal - 18)
  const langOverflow = Math.max(0, genEdStats.lang - 6)
  const genEdOverflow = Math.min(coreOverflow + langOverflow, 4)
  if (genEdOverflow > 0) freeCredits += genEdOverflow

  const gpa = gpaCredits > 0 ? (gpaPoints / gpaCredits).toFixed(2) : null

  return {
    totalCredits,
    compulsoryCredits,
    csElectiveCredits,
    freeCredits,
    gpa,
    genEdStats,
    genEdLogs,
    sciCredits,
    bestSci,
    compCheck,
    basicProgCheck,
    peCount: peTerms.size,
    serviceCount,
    mentorPassed,
    phyOverflow,
    csOverflow,
    genEdOverflow,
  }
}
