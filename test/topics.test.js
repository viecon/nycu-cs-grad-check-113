import test from 'node:test'
import assert from 'node:assert/strict'

import { SEVEN_TOPICS } from '../src/utils/constants.js'
import { evaluateTopics } from '../src/utils/topics.js'

function evaluate(title, courses) {
  return evaluateTopics(SEVEN_TOPICS, courses).find(topic => topic.title === title)
}

test('accepts a minimal valid selection for every 115 academic year topic', () => {
  const cases = [
    [
      '人工智慧與數據科學',
      ['人工智慧', '機器學習概論', '資料探勘', '人工智慧總整與實作'],
    ],
    [
      '資訊安全',
      ['計算機網路概論', '密碼學概論', '網路安全', '電腦安全總整與實作'],
    ],
    [
      '多媒體工程',
      ['數值方法', '計算機圖學', '電腦視覺', '多媒體與人機互動總整與實作'],
    ],
    [
      '網路工程',
      ['計算機網路', '無線多媒體網路', '圖形理論概論', '網路系統總整與實作'],
    ],
    [
      '系統軟體',
      ['資料庫系統概論', '編譯器設計', '記憶體與儲存系統', '作業系統總整與實作'],
    ],
    [
      '軟硬體整合',
      ['數位電路實驗', '計算機架構', '機器學習晶片架構設計', '嵌入式系統總整與實作'],
    ],
    [
      '計算理論',
      ['人工智慧概論', '組合數學', '正規語言與計算理論', '近似演算法'],
    ],
  ]

  for (const [title, courses] of cases) {
    assert.equal(courses.length, 4, title)
    assert.equal(evaluate(title, courses).isComplete, true, title)
  }
})

test('requires exactly four courses for every topic', () => {
  for (const topic of SEVEN_TOPICS) {
    const requiredCount = topic.requirements.reduce((sum, requirement) => (
      sum + requirement.required
    ), 0)

    assert.equal(requiredCount, 4, topic.title)
  }
})

test('does not let a capstone title satisfy a similarly named elective', () => {
  const result = evaluate('人工智慧與數據科學', [
    '機器學習概論',
    '自然語言處理概論',
    '人工智慧總整與實作',
  ])

  assert.equal(result.isComplete, false)
  assert.equal(result.groups[0].takenCount, 2)
})

test('keeps the two network engineering elective groups independent', () => {
  const invalid = evaluate('網路工程', [
    '計算機網路概論',
    '通訊原理與無線網路',
    '無線多媒體網路',
    '網路系統總整與實作',
  ])
  const valid = evaluate('網路工程', [
    '計算機網路概論',
    '通訊原理與無線網路',
    '網路規劃與管理實務',
    '網路系統總整與實作',
  ])

  assert.equal(invalid.isComplete, false)
  assert.equal(invalid.groups[1].takenCount, 2)
  assert.equal(invalid.groups[2].takenCount, 0)
  assert.equal(valid.isComplete, true)
})

test('counts duplicate transcript entries only once per requirement item', () => {
  const result = evaluate('計算理論', [
    '數值方法',
    '數值方法',
    '組合數學',
    '隨機演算法',
  ])

  assert.equal(result.groups[0].takenCount, 3)
  assert.equal(result.isComplete, false)
})
