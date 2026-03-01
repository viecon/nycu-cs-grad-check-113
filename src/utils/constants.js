export const SEVEN_TOPICS = [
  {
    title: '人工智慧與數據科學',
    type: 'fixed',
    courses: ['資料庫系統概論', '人工智慧概論', '機器學習概論', '人工智慧總整與實作'],
  },
  {
    title: '資訊安全',
    type: 'fixed',
    courses: ['計算機網路概論', ['密碼學概論', '密碼工程'], '網路程式設計概論', '電腦安全總整與實作'],
    note: '密碼學概論 與 密碼工程 擇一即可',
  },
  {
    title: '多媒體工程',
    type: 'fixed',
    courses: ['數值方法', '計算機圖學概論', '影像處理概論', '多媒體與人機互動總整與實作'],
  },
  {
    title: '網路工程',
    type: 'fixed',
    courses: ['計算機網路概論', '通訊原理與無線網路', '網路程式設計概論', '網路系統總整與實作'],
  },
  {
    title: '系統軟體',
    type: 'fixed',
    courses: ['編譯器設計概論', '計算機系統管理', '高等UNIX程式設計', '作業系統總整與實作'],
  },
  {
    title: '軟硬體整合',
    type: 'fixed',
    courses: ['數位電路實驗', '編譯器設計概論', '微處理機系統原理與實作', '嵌入式系統總整與實作'],
  },
  {
    title: '計算理論',
    type: 'pick4',
    courses: [
      '人工智慧概論', '數值方法', '正規語言概論', '組合數學',
      '競技程式設計(一)', ['圖形理論', '圖形理論導論'], '隨機演算法',
      '資訊理論與壓縮編碼的應用', '機器學習演算法理論基礎', '近似演算法',
    ],
    note: '任選 4 門',
  },
]

export const CORE_RULES = {
  compulsory: [
    '線性代數', '計算機概論與程式設計', '資料結構與物件導向程式設計',
    '離散數學', '數位電路設計', '機率', '演算法概論',
    '計算機組織', '作業系統概論', '資訊工程研討',
    '資訊工程專題(一)', '資訊工程專題(二)',
  ],
  basicProg: '基礎程式設計',
}

export const GRADE_TO_GPA = {
  'A+': 4.3, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0,
  'E': 0.0, 'F': 0.0, 'X': 0.0,
}

export const CATEGORIES = {
  COMPULSORY:   'compulsory',
  BASIC_PROG:   'basicProg',
  SCIENCE_CALC: 'sciCalc',
  SCIENCE_OTHER:'sciOther',
  GEN_BASIC:    'genBasic',
  GEN_AREA:     'genArea',
  GEN_LANG:     'genLang',
  GEN_CORE:     'genCore',
  GEN_OTHER:    'genOther',
  CS_ELECTIVE:  'csElective',
  FREE:         'free',
  EXCLUDED:     'excluded',
}

export const CATEGORY_LABELS = {
  compulsory:  '系必修',
  basicProg:   '系必修 (基礎程式設計)',
  sciCalc:     '基礎科學 (微積分)',
  sciOther:    '基礎科學 (三選一)',
  genBasic:    '通識 - 基本素養',
  genArea:     '通識 - 領域課程',
  genLang:     '語言與溝通',
  genCore:     '通識 - 核心其他',
  genOther:    '通識 - 其他',
  csElective:  '專業/學程選修',
  free:        '自由選修',
  excluded:    '排除 (體育/服學/導師/軍訓)',
}
