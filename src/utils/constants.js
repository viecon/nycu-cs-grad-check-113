const alternatives = (...courses) => courses

export const SEVEN_TOPICS = [
  {
    title: '人工智慧與數據科學',
    requirements: [
      {
        label: '左列課程任選 3 科',
        required: 3,
        courses: [
          '資料庫系統概論',
          alternatives('人工智慧', '人工智慧概論'),
          alternatives('機器學習', '機器學習概論'),
          alternatives('自然語言處理', '自然語言處理概論'),
          '資料探勘',
        ],
      },
      { label: '總整課程', required: 1, courses: ['人工智慧總整與實作'] },
    ],
  },
  {
    title: '資訊安全',
    requirements: [
      {
        label: '左列課程任選 3 科',
        required: 3,
        courses: [
          alternatives('計算機網路', '計算機網路概論'),
          alternatives('網路程式設計', '網路程式設計概論'),
          alternatives('機器學習', '機器學習概論'),
          '密碼學概論',
          alternatives('編譯器設計', '編譯器設計概論'),
          '密碼工程',
          '網路安全',
        ],
      },
      { label: '總整課程', required: 1, courses: ['電腦安全總整與實作'] },
    ],
  },
  {
    title: '多媒體工程',
    requirements: [
      {
        label: '左列課程任選 3 科',
        required: 3,
        courses: [
          '數值方法',
          alternatives('計算機圖學', '計算機圖學概論'),
          alternatives('機器學習', '機器學習概論'),
          alternatives('影像處理', '影像處理概論'),
          '電腦視覺',
        ],
      },
      { label: '總整課程', required: 1, courses: ['多媒體與人機互動總整與實作'] },
    ],
  },
  {
    title: '網路工程',
    requirements: [
      {
        label: '必修',
        required: 1,
        courses: [alternatives('計算機網路', '計算機網路概論')],
      },
      {
        label: '通訊與無線網路課程任選 1 科',
        required: 1,
        courses: ['通訊原理與無線網路', '無線多媒體網路'],
      },
      {
        label: '網路進階課程任選 1 科',
        required: 1,
        courses: [
          alternatives('網路程式設計', '網路程式設計概論'),
          alternatives('圖形理論', '圖形理論概論', '圖形理論導論'),
          '軟體定義網路及網路功能虛擬化',
          '網路規劃與管理實務',
        ],
      },
      { label: '總整課程', required: 1, courses: ['網路系統總整與實作'] },
    ],
  },
  {
    title: '系統軟體',
    requirements: [
      {
        label: '左列課程任選 3 科',
        required: 3,
        courses: [
          '資料庫系統概論',
          alternatives('編譯器設計', '編譯器設計概論'),
          '計算機系統管理',
          '高等UNIX程式設計',
          '記憶體與儲存系統',
        ],
      },
      { label: '總整課程', required: 1, courses: ['作業系統總整與實作'] },
    ],
  },
  {
    title: '軟硬體整合',
    requirements: [
      {
        label: '左列課程任選 3 科',
        required: 3,
        courses: [
          '數位電路實驗',
          alternatives('編譯器設計', '編譯器設計概論'),
          '微處理機系統原理與實作',
          '計算機架構',
          'VLSI設計與實作',
          '機器學習晶片架構設計',
        ],
      },
      { label: '總整課程', required: 1, courses: ['嵌入式系統總整與實作'] },
    ],
  },
  {
    title: '計算理論',
    requirements: [
      {
        label: '左列課程任選 4 科',
        required: 4,
        courses: [
          alternatives('人工智慧', '人工智慧概論'),
          '數值方法',
          '組合數學',
          '競技程式設計(一)',
          alternatives('圖形理論', '圖形理論概論', '圖形理論導論'),
          '正規語言概論',
          '正規語言與計算理論',
          '隨機演算法',
          '資訊理論與壓縮編碼的應用',
          '機器學習演算法理論基礎',
          '近似演算法',
        ],
      },
    ],
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
  csElective:  '專業/學程選修',
  free:        '自由選修',
  excluded:    '排除 (體育/服學/導師/軍訓)',
}
