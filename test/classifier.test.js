import test from 'node:test'
import assert from 'node:assert/strict'

import { classifyCourses, computeStats } from '../src/utils/classifier.js'
import { CATEGORIES } from '../src/utils/constants.js'

test('service-learning courses stay excluded without creating a graduation requirement', () => {
  const [serviceLearning] = classifyCourses([{
    term: '1151',
    name: '服務學習(一)',
    type: '共同必修',
    credit: 0,
    grade: 'P',
  }])
  const stats = computeStats([serviceLearning])

  assert.equal(serviceLearning.category, CATEGORIES.EXCLUDED)
  assert.equal(stats.totalCredits, 0)
  assert.equal(Object.hasOwn(stats, 'serviceCount'), false)
})
