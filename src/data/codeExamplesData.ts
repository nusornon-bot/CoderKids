export interface BlockLineItem {
  text: string;
  category: 'events' | 'motion' | 'pen' | 'control' | 'looks' | 'sensors' | 'variables';
  color: string;
  explanation?: string;
  indent?: number;
}

export interface CodeExampleChallenge {
  id: string;
  title: string;
  englishTitle: string;
  platform: 'scratch' | 'microbit';
  grade: 'ป.4' | 'ป.5' | 'ป.6';
  difficulty: 'ง่าย (Beginner)' | 'ปานกลาง (Intermediate)' | 'ท้าทาย (Advanced)';
  points: number;
  timeEstimate: string;
  concepts: string[];
  thumbnailGradient: string;
  thumbnailIcon: string;
  accentColor: string;
  summary: string;
  missionScenario: string;
  presetTarget?: string; // target preset id in Scratch or Micro:bit to load live
  blocks: BlockLineItem[];
  ipo: {
    input: string;
    process: string;
    output: string;
  };
  computationalPillars: {
    decomposition: string;
    patternRecognition: string;
    abstraction: string;
    algorithms: string;
  };
  commonPitfalls: string[];
  bridgeChallenge: {
    prompt: string;
    actionHint: string;
    expectedOutcome: string;
  };
  conceptQuiz: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
}

export const CODE_EXAMPLES_GALLERY_DATA: CodeExampleChallenge[] = [
  {
    id: 'ex_scratch_star',
    title: 'วาดรูปดาวเรขาคณิต 5 แฉก',
    englishTitle: 'Geometric 5-Pointed Star Loop',
    platform: 'scratch',
    grade: 'ป.5',
    difficulty: 'ปานกลาง (Intermediate)',
    points: 25,
    timeEstimate: '5 นาที',
    concepts: ['ลูปทำซ้ำ (Loop)', 'องศาการเลี้ยว 144°', 'ระบบปากกา (Pen)'],
    thumbnailGradient: 'from-amber-500 via-orange-500 to-yellow-400',
    thumbnailIcon: '⭐',
    accentColor: 'amber',
    summary: 'ใช้คำสั่งวนซ้ำ 5 รอบเพื่อวาดเส้นทะแยงมุมไขว้ 5 ด้าน เกิดเป็นรูปดาวห้าแฉกที่สมมาตรอย่างแม่นยำ',
    missionScenario: 'น้องแมวส้มต้องการวาดดาวติดยอดต้นไม้ในงานเทศกาลโรงเรียน แต่ไม่อยากเขียนคำสั่งซ้ำๆ 10 บล็อก ครูจึงท้าทายให้ใช้ลูป "ทำซ้ำ 5 รอบ"',
    presetTarget: 'star',
    blocks: [
      { text: 'เมื่อคลิก ธงเขียว', category: 'events', color: 'bg-amber-500 text-white', explanation: 'จุดเริ่มต้นโปรแกรมเมื่อผู้ใช้คลิกธงเขียว' },
      { text: 'ลบทั้งหมด (Erase All)', category: 'pen', color: 'bg-emerald-600 text-white', explanation: 'ล้างรอยเส้นที่วาดค้างไว้บนเวทีให้สะอาด' },
      { text: 'ไปที่ x: -30 y: 20', category: 'motion', color: 'bg-blue-600 text-white', explanation: 'ตั้งต้นพิกัดให้ตัวละครอยู่ตำแหน่งพอเหมาะ' },
      { text: 'ตั้งค่าสีปากกาเป็น [สีเหลืองทอง]', category: 'pen', color: 'bg-emerald-600 text-white', explanation: 'กำหนดสีของเส้นปากกาที่จะวาด' },
      { text: 'กำหนดขนาดปากกาเป็น (4)', category: 'pen', color: 'bg-emerald-600 text-white', explanation: 'กำหนดความหนาของเส้นปากกาให้มองเห็นชัดเจน' },
      { text: 'จรดปากกา (Pen Down)', category: 'pen', color: 'bg-emerald-600 text-white', explanation: 'วางหัวปากกาลงบนกระดาษ เมื่อตัวละครขยับจะเกิดเส้น' },
      { text: 'ทำซ้ำ (5) รอบ [วาดดาว 5 แฉก]', category: 'control', color: 'bg-amber-600 text-white', explanation: 'เริ่มบล็อกทำซ้ำ 5 ครั้งเพื่อวาดแฉกทั้ง 5 ของดวงดาว' },
      { text: '  ├─ เคลื่อนที่ (70) ก้าว', category: 'motion', color: 'bg-blue-500 text-white', explanation: 'ลากเส้นความยาวด้านละ 70 ก้าว', indent: 1 },
      { text: '  └─ หมุนตามเข็ม (144) องศา', category: 'motion', color: 'bg-blue-500 text-white', explanation: 'เลี้ยวขวา 144 องศาเพื่อตัดเส้นไขว้เข้าสู่แฉกถัดไป', indent: 1 },
      { text: 'ยกปากกา (Pen Up)', category: 'pen', color: 'bg-emerald-600 text-white', explanation: 'ยกหัวปากกาขึ้น หยุดวาดเส้นเมื่อวาดดาวเสร็จสมบูรณ์' },
      { text: 'เล่นเสียงเวทมนตร์ (Chime!)', category: 'control', color: 'bg-rose-500 text-white', explanation: 'ส่งสัญญาณเสียงฉลองความสำเร็จ' },
    ],
    ipo: {
      input: 'การคลิกธงเขียว หรือกดปุ่มรันสคริปต์',
      process: 'ลูปทำซ้ำ 5 ครั้ง โดยแต่ละรอบวาด 70 ก้าว และเลี้ยว 144° (ผลรวมมุมเลี้ยว = 5 × 144° = 720° หรือหมุน 2 รอบสมบูรณ์)',
      output: 'รูปภาพดาวเรขาคณิตสีเหลืองทอง 5 แฉกบนเวที พร้อมเสียงดนตรีเวทมนตร์',
    },
    computationalPillars: {
      decomposition: 'แยกการวาดดาว 5 แฉก ออกเป็น 5 ส่วนย่อยที่เหมือนกันทุกประการ',
      patternRecognition: 'สังเกตเห็นว่าแต่ละแฉกต้อง "เดินหน้า + เลี้ยวขวา 144°" เหมือนกันทุกรอบ',
      abstraction: 'ตัดการเดินทีละเส้นทิ้งไป แล้วใช้ตัวแปรตัวเลขรอบวนซ้ำ (5) แทน',
      algorithms: 'ลำดับขั้นตอน: ลบทั้งหมด -> ไปที่พิกัด -> จรดปากกา -> ทำซ้ำ 5 รอบ -> ยกปากกา',
    },
    commonPitfalls: [
      'ลืมใส่บล็อก "จรดปากกา (Pen Down)" ทำให้ตัวละครขยับแต่ไม่มีเส้นวาดออกมา',
      'ใช้องศาผิด เช่น 72° แทนที่จะเป็น 144° ทำให้ได้รูปห้าเหลี่ยมด้านเท่าแทนรูปดาว',
      'ลืมบล็อก "ลบทั้งหมด" ทำให้เส้นเก่าวาดทับซ้อนกันจนมองไม่เห็นรูปดาวดวงใหม่',
    ],
    bridgeChallenge: {
      prompt: '🎯 ภารกิจท้าทาย: ถ้าต้องการให้ดาวมีขนาดใหญ่ขึ้นเป็น 2 เท่า ต้องแก้บล็อกตัวเลขใด?',
      actionHint: 'เปิดใน Scratch Studio แล้วลองเปลี่ยนบล็อก "เคลื่อนที่" จาก 70 ก้าว เป็น 140 ก้าว',
      expectedOutcome: 'ดาวดวงโตขึ้น 2 เท่า โดยองศาการเลี้ยวยังคงเป็น 144 องศาเท่าเดิม',
    },
    conceptQuiz: {
      question: 'เหตุใดการวาดดาว 5 แฉกจึงต้องใช้มุมเลี้ยว 144 องศา?',
      options: [
        'เพราะ 5 × 144° = 720° หมุนตัดเส้นตัดกันครบ 2 รอบวงกลมพอดี',
        'เพราะมุมฉาก 90° บวกกับ 54° ตามสูตรคณิตศาสตร์',
        'เป็นตัวเลขสุ่มที่คอมพิวเตอร์ตั้งขึ้น',
        'เพราะมุมภายในของดาวต้องเท่ากับ 180° เสมอ',
      ],
      correctAnswer: 0,
      explanation: 'ถูกต้องยอดเยี่ยม! การวาดรูปดาวเส้นไขว้ 5 แฉกจะหมุนครบรอบวงกลม 2 รอบ (360° × 2 = 720°) นำ 720° ÷ 5 = 144° พอดี!',
    },
  },
  {
    id: 'ex_scratch_square',
    title: 'วาดสี่เหลี่ยมจัตุรัสและพิกัด x, y',
    englishTitle: 'Square Geometry with Coordinates',
    platform: 'scratch',
    grade: 'ป.4',
    difficulty: 'ง่าย (Beginner)',
    points: 20,
    timeEstimate: '4 นาที',
    concepts: ['การทำซ้ำ 4 รอบ', 'มุมฉาก 90°', 'ระบบพิกัดคาร์ทีเซียน'],
    thumbnailGradient: 'from-blue-600 via-indigo-600 to-cyan-500',
    thumbnailIcon: '⏹️',
    accentColor: 'indigo',
    summary: 'พื้นฐานสำคัญที่สุดของโค้ดดิ้งเรขาคณิต: การใช้ลูปทำซ้ำ 4 รอบ เลี้ยวขวา 90 องศาเพื่อสร้างมุมฉาก 4 มุม',
    missionScenario: 'สร้างกล่องสี่เหลี่ยมจัตุรัสบนเวทีพิกัด โดยให้มุมเริ่มต้นอยู่ที่จุด x: -40, y: -40 และมีขนาดความยาวแต่ละด้านเท่ากัน',
    presetTarget: 'square',
    blocks: [
      { text: 'เมื่อคลิก ธงเขียว', category: 'events', color: 'bg-amber-500 text-white', explanation: 'เริ่มรันสคริปต์' },
      { text: 'ลบทั้งหมด (Erase All)', category: 'pen', color: 'bg-emerald-600 text-white', explanation: 'ล้างเส้นบนกระดาน' },
      { text: 'ไปที่ x: -40 y: -40', category: 'motion', color: 'bg-blue-600 text-white', explanation: 'ย้ายแมวส้มไปยังจุดเริ่มมุมซ้ายล่าง' },
      { text: 'หันไปในทิศทาง (90)° [ขวา]', category: 'motion', color: 'bg-blue-600 text-white', explanation: 'ตั้งทิศทางตัวละครให้พร้อมเดินไปทางขวา' },
      { text: 'ตั้งค่าสีปากกาเป็น [สีน้ำเงิน]', category: 'pen', color: 'bg-emerald-600 text-white', explanation: 'เลือกปากกาสีน้ำเงินสดใส' },
      { text: 'กำหนดขนาดปากกาเป็น (5)', category: 'pen', color: 'bg-emerald-600 text-white', explanation: 'กำหนดความหนาเส้น 5 พิกเซล' },
      { text: 'จรดปากกา (Pen Down)', category: 'pen', color: 'bg-emerald-600 text-white', explanation: 'จรดหัวปากกาเพื่อเริ่มวาด' },
      { text: 'ทำซ้ำ (4) รอบ [วาดสี่เหลี่ยมจัตุรัส]', category: 'control', color: 'bg-amber-600 text-white', explanation: 'วนลูป 4 ครั้งให้ครบ 4 ด้าน' },
      { text: '  ├─ เคลื่อนที่ (60) ก้าว', category: 'motion', color: 'bg-blue-500 text-white', explanation: 'เดินหน้า 60 ก้าว', indent: 1 },
      { text: '  └─ หมุนตามเข็ม (90) องศา', category: 'motion', color: 'bg-blue-500 text-white', explanation: 'เลี้ยวฉาก 90 องศา', indent: 1 },
      { text: 'ยกปากกา (Pen Up)', category: 'pen', color: 'bg-emerald-600 text-white', explanation: 'หยุดวาดเมื่อครบรูป' },
      { text: 'พูดว่า [วาดสี่เหลี่ยมจัตุรัส 4 ด้านสำเร็จแล้ว! 🎉]', category: 'looks', color: 'bg-purple-600 text-white', explanation: 'แสดงกล่องคำพูดความสำเร็จ' },
    ],
    ipo: {
      input: 'จุดเริ่มต้นพิกัด (-40, -40) และการกดคลิกธงเขียว',
      process: 'วนลูป 4 รอบ: วาดด้านยาว 60 ก้าว แล้วเลี้ยวขวามุมฉาก 90° (4 × 90° = 360°)',
      output: 'รูปสี่เหลี่ยมจัตุรัสสีน้ำเงินสมบูรณ์บนเวที และกล่องคำพูดแมวส้ม',
    },
    computationalPillars: {
      decomposition: 'แบ่งสี่เหลี่ยมจัตุรัสออกเป็น 4 ด้านย่อยและมุมฉาก 4 มุม',
      patternRecognition: 'แต่ละด้านมีความยาวเท่ากัน และหมุนเลี้ยว 90 องศาในทิศทางเดียวกัน',
      abstraction: 'แทนที่จะเขียนคำสั่งเดินและเลี้ยว 8 บล็อก ยุบเหลือลูปทำซ้ำ 4 รอบ',
      algorithms: 'ขั้นตอนที่ชัดเจนตามลำดับและมีจุดสิ้นสุดการทำงาน',
    },
    commonPitfalls: [
      'ใส่จำนวนรอบทำซ้ำผิดเป็น 3 รอบ ทำให้ได้รูปแค่ 3 ด้าน (เป็นรูปตัว U หงาย ไม่ครบรูปสี่เหลี่ยม)',
      'ใส่เครื่องหมายลบในองศาเลี้ยว ทำให้ตัวละครเลี้ยวทวนเข็มนาฬิกาแทนที่จะเลี้ยวตามเข็ม',
    ],
    bridgeChallenge: {
      prompt: '🎯 ภารกิจท้าทาย: ถ้าต้องการวาดรูป "สามเหลี่ยมด้านเท่า (3 ด้าน)" ต้องแก้ลูปและองศาเป็นเท่าใด?',
      actionHint: 'สามเหลี่ยมมี 3 ด้าน มุมเลี้ยวภายนอกคือ 360° ÷ 3 = 120° ลองแก้เป็น ทำซ้ำ 3 รอบ และหมุน 120°',
      expectedOutcome: 'แมวส้มจะวาดรูปสามเหลี่ยมด้านเท่าได้อย่างแม่นยำ!',
    },
    conceptQuiz: {
      question: 'หากเปลี่ยนจำนวนรอบทำซ้ำจาก 4 รอบ เป็น 6 รอบ (หกเหลี่ยม) ต้องเปลี่ยนองศาการเลี้ยวเป็นกี่องศา?',
      options: ['60 องศา (360 ÷ 6)', '90 องศา', '45 องศา', '120 องศา'],
      correctAnswer: 0,
      explanation: 'ถูกต้อง! สูตรคำนวณองศาการเลี้ยวของรูปหลายเหลี่ยมด้านเท่าคือ 360° ÷ จำนวนด้าน (360 ÷ 6 = 60°)',
    },
  },
  {
    id: 'ex_scratch_circle',
    title: 'วาดวงกลมเรขาคณิต 360 องศา',
    englishTitle: 'Geometric Circle Loop 360°',
    platform: 'scratch',
    grade: 'ป.5',
    difficulty: 'ปานกลาง (Intermediate)',
    points: 25,
    timeEstimate: '5 นาที',
    concepts: ['การวนซ้ำ 36 รอบ', 'ก้าวสั้นต่อเนื่อง', 'มุมโค้งมนเรขาคณิต'],
    thumbnailGradient: 'from-purple-600 via-pink-600 to-indigo-600',
    thumbnailIcon: '⭕',
    accentColor: 'purple',
    summary: 'สร้างเส้นโค้งวงกลมที่นุ่มนวล โดยแบ่ง 360 องศาออกเป็น 36 ช่วง แต่ละช่วงก้าว 6 ก้าวและเลี้ยว 10 องศา',
    missionScenario: 'คอมพิวเตอร์ไม่มีเครื่องมือวาดวงกลมแบบวงเวียน จึงต้องอาศัยการสั่งให้ตัวละครเดินทีละนิดแล้วเลี้ยวทีละ 10 องศาจนครบรอบ',
    presetTarget: 'circle',
    blocks: [
      { text: 'เมื่อคลิก ธงเขียว', category: 'events', color: 'bg-amber-500 text-white', explanation: 'เริ่มรันสคริปต์' },
      { text: 'ลบทั้งหมด (Erase All)', category: 'pen', color: 'bg-emerald-600 text-white', explanation: 'ล้างกระดาน' },
      { text: 'ไปที่ x: 0 y: -40', category: 'motion', color: 'bg-blue-600 text-white', explanation: 'ตั้งต้นกึ่งกลางล่าง' },
      { text: 'ตั้งค่าสีปากกาเป็น [สีม่วง]', category: 'pen', color: 'bg-emerald-600 text-white', explanation: 'เลือกปากกาสีม่วงนีออน' },
      { text: 'กำหนดขนาดปากกาเป็น (4)', category: 'pen', color: 'bg-emerald-600 text-white', explanation: 'เส้นหนา 4 พิกเซล' },
      { text: 'จรดปากกา (Pen Down)', category: 'pen', color: 'bg-emerald-600 text-white', explanation: 'เริ่มวาด' },
      { text: 'ทำซ้ำ (36) รอบ [วาดวงกลมเรขาคณิต]', category: 'control', color: 'bg-amber-600 text-white', explanation: 'วนซ้ำ 36 ครั้ง (36 × 10° = 360°)' },
      { text: '  ├─ เคลื่อนที่ (6) ก้าว', category: 'motion', color: 'bg-blue-500 text-white', explanation: 'เดินหน้าทีละนิด 6 ก้าว', indent: 1 },
      { text: '  └─ หมุนตามเข็ม (10) องศา', category: 'motion', color: 'bg-blue-500 text-white', explanation: 'เลี้ยวทีละ 10 องศา', indent: 1 },
      { text: 'ยกปากกา (Pen Up)', category: 'pen', color: 'bg-emerald-600 text-white', explanation: 'หยุดวาดเมื่อบรรจบวง' },
      { text: 'พูดว่า [วาดวงกลม 360 องศาสำเร็จแล้ว! ⭕]', category: 'looks', color: 'bg-purple-600 text-white', explanation: 'แสดงคำพูดเมื่อเสร็จสิ้น' },
    ],
    ipo: {
      input: 'พิกัดเริ่มต้น (0, -40) และการเริ่มรันโปรแกรม',
      process: 'ทำซ้ำ 36 รอบ แต่ละรอบก้าว 6 ก้าว และหมุน 10° (36 × 10° = 360°)',
      output: 'เส้นรอบวงกลมสีม่วงที่เรียบเนียนสมมาตร 360 องศา',
    },
    computationalPillars: {
      decomposition: 'ย่อยวงกลม 360° ออกเป็น 36 ชิ้นส่วนเล็กๆ ชิ้นละ 10°',
      patternRecognition: 'การเคลื่อนที่ต่อเนื่องที่ระยะทางและมุมคงที่ทำให้เกิดความโค้งมน',
      abstraction: 'มองรูปหลายเหลี่ยม 36 เหลี่ยมให้เป็นวงกลมในสายตามนุษย์',
      algorithms: 'กระบวนการวนซ้ำแบบละเอียดเพื่อสร้างกราฟิกเวกเตอร์',
    },
    commonPitfalls: [
      'ใส่ก้าวเดินยาวเกินไป (เช่น 30 ก้าว) จะทำให้วงกลมใหญ่ล้นออกนอกจอเวที',
      'ลืมคำนวณรอบและองศาให้คูณกันได้ 360° ทำให้เส้นไม่มาบรรจบกัน',
    ],
    bridgeChallenge: {
      prompt: '🎯 ภารกิจท้าทาย: ถ้าอยากให้วงกลมหมุนเร็วขึ้นโดยวนซ้ำแค่ 12 รอบ ต้องปรับองศาเป็นเท่าใด?',
      actionHint: 'คำนวณจาก 360° ÷ 12 = 30° และปรับก้าวเดินให้ยาวขึ้นเป็น 18 ก้าว',
      expectedOutcome: 'ตัวละครจะวาดรูป 12 เหลี่ยมที่มองดูคล้ายวงกลมได้อย่างรวดเร็ว!',
    },
    conceptQuiz: {
      question: 'หากต้องการให้วงกลมมีขนาดเส้นรอบวงเล็กลงครึ่งหนึ่ง ควรทำอย่างไร?',
      options: [
        'ลดระยะก้าวเดินจาก 6 ก้าว เหลือ 3 ก้าว',
        'ลดองศาการเลี้ยวเหลือ 5 องศา',
        'เพิ่มจำนวนรอบเป็น 72 รอบ',
        'เปลี่ยนสีปากกา',
      ],
      correctAnswer: 0,
      explanation: 'ถูกต้อง! การลดระยะก้าวเดินในแต่ละรอบจะทำให้เส้นรอบวงสั้นลง ส่งผลให้วงกลมมีรัศมีเล็กลงตามสัดส่วน',
    },
  },
  {
    id: 'ex_scratch_pinwheel',
    title: 'กังหัน 8 ทิศทางและลวดลายสมมาตร',
    englishTitle: '8-Blade Pinwheel Pattern',
    platform: 'scratch',
    grade: 'ป.6',
    difficulty: 'ท้าทาย (Advanced)',
    points: 30,
    timeEstimate: '6 นาที',
    concepts: ['การกระจายรัศมี 8 แฉก', 'พิกัดกลับจุดศูนย์กลาง', 'มุมสมมาตร 45°'],
    thumbnailGradient: 'from-rose-500 via-red-600 to-orange-500',
    thumbnailIcon: '🌸',
    accentColor: 'rose',
    summary: 'สร้างลวดลายกังหันดอกไม้ 8 ทิศ โดยวาดแฉกออกจากจุดศูนย์กลาง แล้วถอยกลับมาจุดเดิมก่อนหมุน 45 องศา',
    missionScenario: 'สร้างลวดลายผ้าบาติกหรือกังหันพลังงานลม โดยใช้คณิตศาสตร์ความสมมาตรแบบรัศมี (Radial Symmetry)',
    presetTarget: 'pinwheel',
    blocks: [
      { text: 'เมื่อคลิก ธงเขียว', category: 'events', color: 'bg-amber-500 text-white', explanation: 'เริ่มรันสคริปต์' },
      { text: 'ลบทั้งหมด (Erase All)', category: 'pen', color: 'bg-emerald-600 text-white', explanation: 'ล้างกระดาน' },
      { text: 'ไปที่ x: 0 y: 0 (จุดกึ่งกลาง)', category: 'motion', color: 'bg-blue-600 text-white', explanation: 'วางตัวละครตรงกลางเวที' },
      { text: 'ตั้งค่าสีปากกาเป็น [สีแดง]', category: 'pen', color: 'bg-emerald-600 text-white', explanation: 'เลือกปากกาสีแดงสด' },
      { text: 'จรดปากกา (Pen Down)', category: 'pen', color: 'bg-emerald-600 text-white', explanation: 'เริ่มวาด' },
      { text: 'ทำซ้ำ (8) รอบ [วาดกังหัน 8 ทิศ]', category: 'control', color: 'bg-amber-600 text-white', explanation: 'ลูป 8 แฉก (8 × 45° = 360°)' },
      { text: '  ├─ เคลื่อนที่ (50) ก้าว', category: 'motion', color: 'bg-blue-500 text-white', explanation: 'วาดกิ่งกังหันออกไปด้านนอก 50 ก้าว', indent: 1 },
      { text: '  ├─ ยกปากกา (Pen Up)', category: 'pen', color: 'bg-emerald-600 text-white', explanation: 'ยกปากกาเพื่อไม่ให้วาดซ้ำตอนถอย', indent: 1 },
      { text: '  ├─ ไปที่ x: 0 y: 0', category: 'motion', color: 'bg-blue-600 text-white', explanation: 'พากลับมาจุดกึ่งกลางเวที', indent: 1 },
      { text: '  ├─ จรดปากกา (Pen Down)', category: 'pen', color: 'bg-emerald-600 text-white', explanation: 'จรดปากกาเตรียมวาดแฉกถัดไป', indent: 1 },
      { text: '  └─ หมุนตามเข็ม (45) องศา', category: 'motion', color: 'bg-blue-500 text-white', explanation: 'หมุนกระจายมุม 45 องศา', indent: 1 },
      { text: 'เล่นเสียงเวทมนตร์ (Chime!)', category: 'control', color: 'bg-rose-500 text-white', explanation: 'ส่งเสียงฉลองเมื่อวาดครบ 8 ทิศ' },
    ],
    ipo: {
      input: 'จุดศูนย์กลางเวที (0, 0) และการเริ่มรันโปรแกรม',
      process: 'ทำซ้ำ 8 รอบ: วาดกิ่ง 50 ก้าว -> ถอยกลับ (0, 0) -> หมุนเลี้ยว 45°',
      output: 'ลวดลายกังหัน 8 ทิศสมมาตร พร้อมเสียงกระดิ่ง Chime',
    },
    computationalPillars: {
      decomposition: 'แบ่งลวดลายกังหันออกเป็น 8 กิ่งรอบแกนหมุน',
      patternRecognition: 'ทุกกิ่งเริ่มที่จุด (0, 0) และมีองศาห่างกัน 45 องศาเท่ากันทุกกิ่ง',
      abstraction: 'ละเว้นการเขียนพิกัดปลายกิ่งแต่ละอัน โดยใช้มุมเลี้ยว 45 องศาคุมทิศทาง',
      algorithms: 'วนซ้ำแบบมีจังหวะยกปากกาและจรดปากกากลับจุดเดิม',
    },
    commonPitfalls: [
      'ลืมยกปากกาก่อนกลับมาจุด (0, 0) ทำให้เกิดเส้นวาดซ้ำลากทับขากลับ',
      'ลืมคำนวณองศาเลี้ยว (360 ÷ 8 = 45°) ถ้าใส่ 90° จะได้แค่ 4 แฉกเป็นรูปกากบาท',
    ],
    bridgeChallenge: {
      prompt: '🎯 ภารกิจท้าทาย: ถ้าต้องการกังหัน 12 แฉก ต้องแก้องศาและจำนวนรอบเป็นเท่าใด?',
      actionHint: 'แก้จำนวนรอบเป็น 12 และแก้องศาเป็น 360 ÷ 12 = 30 องศา',
      expectedOutcome: 'ได้ลวดลายดอกไม้ 12 แฉกที่ละเอียดสวยงาม!',
    },
    conceptQuiz: {
      question: 'ทำไมในลูปต้องมีคำสั่ง "ไปที่ x: 0 y: 0" ทุกรอบ?',
      options: [
        'เพื่อให้กิ่งกังหันทุกแฉกเริ่มต้นกระจายออกจากจุดศูนย์กลางเดียวกัน',
        'เพื่อป้องกันไม่ให้แมวส้มเดินตกขอบเวที',
        'เป็นคำสั่งบังคับของ Scratch',
        'เพื่อล้างหน้าจอ',
      ],
      correctAnswer: 0,
      explanation: 'ถูกต้อง! การกลับมาที่จุดศูนย์กลาง (0, 0) ก่อนหมุนองศา ทำให้เกิดลวดลายแบบกระจายรัศมี (Radial Symmetry) ที่สวยงาม',
    },
  },
  {
    id: 'ex_microbit_tally',
    title: 'เครื่องนับคนอัจฉริยะ (Tally Counter A/B)',
    englishTitle: 'Smart Tally Counter with Validation',
    platform: 'microbit',
    grade: 'ป.5',
    difficulty: 'ปานกลาง (Intermediate)',
    points: 25,
    timeEstimate: '5 นาที',
    concepts: ['ตัวแปร (Variables)', 'ปุ่มกด A/B/AB', 'เงื่อนไขตรวจสอบ (Validation)'],
    thumbnailGradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    thumbnailIcon: '🔢',
    accentColor: 'emerald',
    summary: 'สร้างเครื่องนับจำนวนคนที่เข้า-ออกห้องสมุด โดยปุ่ม A เพิ่มค่า (+1), ปุ่ม B ลดค่า (-1 ไม่ให้ติดลบ), และปุ่ม A+B รีเซ็ตเป็น 0',
    missionScenario: 'คุณครูห้องสมุดต้องการทราบจำนวนนักเรียนที่อยู่ในห้องสมุดแบบเรียลไทม์ และต้องการให้ตัวเลขไม่สามารถนับติดลบได้เด็ดขาด',
    presetTarget: 'tally',
    blocks: [
      { text: 'let count = 0;', category: 'variables', color: 'bg-amber-500 text-white', explanation: 'สร้างตัวแปร count เก็บจำนวนคน เริ่มต้นที่ 0' },
      { text: 'basic.showNumber(count);', category: 'looks', color: 'bg-emerald-600 text-white', explanation: 'แสดงเลข 0 บนหน้าจอ LED 5x5' },
      { text: 'input.onButtonPressed(Button.A, () => {', category: 'events', color: 'bg-sky-500 text-white', explanation: 'เมื่อกดปุ่ม A (คนเดินเข้าห้อง)' },
      { text: '  count += 1;', category: 'variables', color: 'bg-amber-500 text-white', explanation: 'เพิ่มค่าในตัวแปร count ขึ้น 1', indent: 1 },
      { text: '  basic.showNumber(count);', category: 'looks', color: 'bg-emerald-600 text-white', explanation: 'อัปเดตตัวเลขล่าสุดบนจอ LED', indent: 1 },
      { text: '  music.playTone(440, Beat.Quarter);', category: 'looks', color: 'bg-purple-600 text-white', explanation: 'เล่นเสียงปี๊บรับสัญญาณคนเข้า', indent: 1 },
      { text: '});', category: 'events', color: 'bg-sky-500 text-white', explanation: 'จบล็อกปุ่ม A' },
      { text: 'input.onButtonPressed(Button.B, () => {', category: 'events', color: 'bg-sky-500 text-white', explanation: 'เมื่อกดปุ่ม B (คนเดินออก)' },
      { text: '  if (count > 0) {', category: 'control', color: 'bg-rose-500 text-white', explanation: 'ตรวจสอบเงื่อนไข: ต้องมีคนอย่างน้อย 1 คนถึงจะลดได้', indent: 1 },
      { text: '    count -= 1;', category: 'variables', color: 'bg-amber-500 text-white', explanation: 'ลดค่าตัวแปร count ลง 1', indent: 2 },
      { text: '  }', category: 'control', color: 'bg-rose-500 text-white', explanation: 'จบเงื่อนไข', indent: 1 },
      { text: '  basic.showNumber(count);', category: 'looks', color: 'bg-emerald-600 text-white', explanation: 'แสดงผลค่าล่าสุด', indent: 1 },
      { text: '  music.playTone(330, Beat.Quarter);', category: 'looks', color: 'bg-purple-600 text-white', explanation: 'เล่นเสียงต่ำแจ้งเตือนคนออก', indent: 1 },
      { text: '});', category: 'events', color: 'bg-sky-500 text-white', explanation: 'จบล็อกปุ่ม B' },
      { text: 'input.onButtonPressed(Button.AB, () => {', category: 'events', color: 'bg-sky-500 text-white', explanation: 'เมื่อกดปุ่ม A+B พร้อมกัน (รีเซ็ตประจำวัน)' },
      { text: '  count = 0;', category: 'variables', color: 'bg-amber-500 text-white', explanation: 'รีเซ็ตตัวแปรกลับเป็น 0', indent: 1 },
      { text: '  basic.showNumber(0);', category: 'looks', color: 'bg-emerald-600 text-white', explanation: 'แสดงเลข 0', indent: 1 },
      { text: '  music.playTone(700, Beat.Half);', category: 'looks', color: 'bg-purple-600 text-white', explanation: 'เสียงพิเศษแจ้งเตือนการรีเซ็ต', indent: 1 },
      { text: '});', category: 'events', color: 'bg-sky-500 text-white', explanation: 'จบล็อกปุ่ม AB' },
    ],
    ipo: {
      input: 'ปุ่มกด A (เข้า), ปุ่มกด B (ออก), ปุ่ม A+B (รีเซ็ต)',
      process: 'ตัวแปร `count` เพิ่มค่า (+1), ลดค่า (-1 พร้อมตรวจสอบ `count > 0`), หรือคืนค่าเป็น 0',
      output: 'ตัวเลขจำนวนคนบนหน้าจอ LED 5x5 และเสียงตอบรับแยกความถี่',
    },
    computationalPillars: {
      decomposition: 'แบ่งระบบนับคนออกเป็น 3 การกระทำ: นับเข้า, นับออก, และรีเซ็ต',
      patternRecognition: 'การนับทุกครั้งคือการเพิ่มหรือลดค่าของตัวแปรเดิมทีละ 1',
      abstraction: 'เก็บสถานะของระบบทั้งหมดไว้ในตัวแปรตัวเลขตัวเดียวชื่อ `count`',
      algorithms: 'มีขั้นตอนการตรวจสอบเงื่อนไข (Validation) ป้องกันข้อมูลผิดพลาด (ติดลบ)',
    },
    commonPitfalls: [
      'ลืมใส่เงื่อนไข `if (count > 0)` ทำให้เวลากดปุ่ม B เมื่อค่าเป็น 0 จะกลายเป็น -1 ซึ่งผิดหลักความเป็นจริง',
      'ลืมอัปเดต `basic.showNumber(count)` หลังเปลี่ยนค่าตัวแปร ทำให้หน้าจอไม่เปลี่ยนตัวเลข',
    ],
    bridgeChallenge: {
      prompt: '🎯 ภารกิจท้าทาย: ถ้าต้องการให้มีเสียงเตือนพิเศษเมื่อมีคนครบ 10 คน ต้องเพิ่มโค้ดบล็อกใด?',
      actionHint: 'ใส่เงื่อนไข `if (count >= 10) { music.playTone(880, Beat.Whole); }` ในปุ่ม A',
      expectedOutcome: 'เมื่อมีคนเข้าครบ 10 คน บอร์ดจะส่งเสียงแจ้งเตือนความจุเต็มทันที!',
    },
    conceptQuiz: {
      question: 'ทำไมในปุ่ม B จึงต้องมีคำสั่ง `if (count > 0)` ก่อนคำสั่ง `count -= 1`?',
      options: [
        'เพื่อป้องกันไม่ให้จำนวนคนนับได้ค่าติดลบ เช่น -1 หรือ -2',
        'เพื่อให้ปุ่ม B ทำงานเร็วขึ้น',
        'เพื่อประหยัดแบตเตอรี่ของบอร์ด',
        'เพื่อให้ตัวเลขแสดงผลเป็นสีแดง',
      ],
      correctAnswer: 0,
      explanation: 'ถูกต้อง! การตรวจสอบความถูกต้องของข้อมูล (Data Validation) เป็นหัวใจสำคัญของโปรแกรม เพื่อไม่ให้ข้อมูลขัดกับหลักความจริง (จำนวนคนจริงไม่มีทางติดลบ)',
    },
  },
  {
    id: 'ex_microbit_dice',
    title: 'ลูกเต๋าดิจิทัลเมื่อเขย่าบอร์ด',
    englishTitle: 'Shake to Roll Digital Dice',
    platform: 'microbit',
    grade: 'ป.4',
    difficulty: 'ง่าย (Beginner)',
    points: 20,
    timeEstimate: '4 นาที',
    concepts: ['เซ็นเซอร์ตรวจจับการเขย่า', 'การสุ่มตัวเลข randint(1, 6)', 'การจำลองทางคอมพิวเตอร์'],
    thumbnailGradient: 'from-amber-600 via-orange-600 to-rose-600',
    thumbnailIcon: '🎲',
    accentColor: 'amber',
    summary: 'ใช้เซ็นเซอร์วัดความเร่ง (Accelerometer) ตรวจจับเมื่อผู้ใช้เขย่าบอร์ด แล้วสุ่มแต้มลูกเต๋า 1 ถึง 6 ทันที',
    missionScenario: 'กลุ่มนักเรียนลืมพกลูกเต๋ามาเล่นบอร์ดเกม จึงร่วมมือกันเขียนโปรแกรมจำลองลูกเต๋าเสมือนจริงบน Micro:bit',
    presetTarget: 'dice',
    blocks: [
      { text: 'input.onGesture(Gesture.Shake, () => {', category: 'events', color: 'bg-sky-500 text-white', explanation: 'เซ็นเซอร์ความเร่งตรวจจับการสั่นสะเทือนเมื่อเขย่าบอร์ด' },
      { text: '  music.playTone(880, Beat.Quarter);', category: 'looks', color: 'bg-purple-600 text-white', explanation: 'ส่งเสียงปี๊บให้ความรู้สึกเหมือนเขย่าลูกเต๋าจริง', indent: 1 },
      { text: '  let roll = randint(1, 6);', category: 'variables', color: 'bg-amber-500 text-white', explanation: 'สุ่มตัวเลขจำนวนเต็มตั้งแต่ 1 ถึง 6 เก็บในตัวแปร roll', indent: 1 },
      { text: '  basic.showNumber(roll);', category: 'looks', color: 'bg-emerald-600 text-white', explanation: 'แสดงตัวเลขแต้มที่สุ่มได้บนหน้าจอ LED 5x5', indent: 1 },
      { text: '});', category: 'events', color: 'bg-sky-500 text-white', explanation: 'จบล็อกการเขย่า' },
    ],
    ipo: {
      input: 'แรงสั่นสะเทือนจากการเขย่าบอร์ด (Gesture.Shake)',
      process: 'ฟังก์ชันสุ่มทางคณิตศาสตร์ `randint(1, 6)` คำนวณสุ่มตัวเลข 1, 2, 3, 4, 5 หรือ 6',
      output: 'ตัวเลขแต้มลูกเต๋าบนหน้าจอ LED 5x5 และเสียงสังเคราะห์ความถี่ 880Hz',
    },
    computationalPillars: {
      decomposition: 'แบ่งการทำงานเป็น: ตรวจจับการเขย่า -> สุ่มตัวเลข -> แสดงผลลัพธ์',
      patternRecognition: 'ลูกเต๋าจริงมี 6 หน้า ดังนั้นผลลัพธ์คอมพิวเตอร์ต้องมี 6 ค่าที่เป็นไปได้เท่าๆ กัน',
      abstraction: 'แทนการทอดลูกเต๋าทางกายภาพด้วยตัวเลขสุ่มในหน่วยความจำ',
      algorithms: 'โปรแกรมเชิงเหตุการณ์ (Event-Driven): รอรับการกระตุ้น แล้วตอบสนองตามที่กำหนด',
    },
    commonPitfalls: [
      'ใส่พารามิเตอร์ผิด เช่น `randint(0, 6)` ทำให้ลูกเต๋ามีโอกาสออกแต้ม 0 ซึ่งลูกเต๋าจริงไม่มีแต้ม 0',
      'ลืมใส่เสียง ทำให้ผู้เล่นไม่รู้ว่าบอร์ดได้รับคำสั่งเขย่าแล้วหรือไม่',
    ],
    bridgeChallenge: {
      prompt: '🎯 ภารกิจท้าทาย: ถ้าต้องการเปลี่ยนเป็นลูกเต๋า 12 หน้า (D12) สำหรับเกมผจญภัย ต้องแก้ตัวเลขใด?',
      actionHint: 'แก้คำสั่ง `randint(1, 6)` เป็น `randint(1, 12)`',
      expectedOutcome: 'บอร์ดจะสุ่มตัวเลขตั้งแต่ 1 ถึง 12 ได้ทันที!',
    },
    conceptQuiz: {
      question: 'ฟังก์ชัน `randint(1, 6)` มีโอกาสที่จะสุ่มได้ตัวเลขใดบ้าง?',
      options: [
        'ตัวเลขจำนวนเต็ม 1, 2, 3, 4, 5, 6 เท่านั้น',
        'ตัวเลขทศนิยม เช่น 2.5 หรือ 4.8',
        'ตัวเลขตั้งแต่ 0 ถึง 6',
        'ตัวเลข 1 และ 6 เท่านั้น',
      ],
      correctAnswer: 0,
      explanation: 'ถูกต้อง! `randint(min, max)` ใน MakeCode จะสุ่มเฉพาะตัวเลขจำนวนเต็ม (Integer) ที่อยู่ระหว่างค่าต่ำสุดและสูงสุดที่ระบุ',
    },
  },
  {
    id: 'ex_microbit_temp',
    title: 'เซ็นเซอร์วัดอุณหภูมิแจ้งเตือนภัย (Smart Thermometer)',
    englishTitle: 'IoT Temperature Warning System',
    platform: 'microbit',
    grade: 'ป.5',
    difficulty: 'ปานกลาง (Intermediate)',
    points: 25,
    timeEstimate: '5 นาที',
    concepts: ['เซ็นเซอร์อุณหภูมิในตัวชิป', 'เงื่อนไข If-Else', 'ระบบตรวจวัดอัตโนมัติ (Forever)'],
    thumbnailGradient: 'from-rose-600 via-red-600 to-amber-600',
    thumbnailIcon: '🌡️',
    accentColor: 'rose',
    summary: 'สร้างระบบตรวจวัดอุณหภูมิห้องเซิร์ฟเวอร์หรือโรงเพาะชำ หากอุณหภูมิเกิน 32°C จะส่งเสียง Buzzer เตือนภัยและแสดงหน้าบึ้ง',
    missionScenario: 'โรงเพาะเห็ดของโรงเรียนต้องการระบบเตือนภัยอัตโนมัติ หากอุณหภูมิร้อนเกิน 32°C จะทำให้เห็ดเสียหาย ต้องส่งเสียงเตือนครูเวรทันที',
    presetTarget: 'temp',
    blocks: [
      { text: 'basic.forever(() => {', category: 'control', color: 'bg-amber-600 text-white', explanation: 'วนลูปทำงานตลอดเวลาแบบไม่รู้จบ ตรวจวัดอย่างต่อเนื่อง' },
      { text: '  let temp = input.temperature();', category: 'variables', color: 'bg-amber-500 text-white', explanation: 'อ่านค่าอุณหภูมิจากเซ็นเซอร์บนบอร์ด (°C)', indent: 1 },
      { text: '  if (temp >= 32) {', category: 'control', color: 'bg-rose-500 text-white', explanation: 'เงื่อนไข: หากอุณหภูมิสูงกว่าหรือเท่ากับ 32 องศาเซลเซียส', indent: 1 },
      { text: '    basic.showIcon(IconNames.Sad);', category: 'looks', color: 'bg-emerald-600 text-white', explanation: 'แสดงไอคอนหน้าบึ้ง/เตือนภัยบน LED', indent: 2 },
      { text: '    music.playTone(300, Beat.Whole);', category: 'looks', color: 'bg-purple-600 text-white', explanation: 'ส่งเสียงเตือนภัย Buzzer เสียงต่ำและดังยาว', indent: 2 },
      { text: '  } else {', category: 'control', color: 'bg-rose-500 text-white', explanation: 'มิฉะนั้น (กรณีอุณหภูมิปกติต่ำกว่า 32°C)', indent: 1 },
      { text: '    basic.showNumber(temp);', category: 'looks', color: 'bg-emerald-600 text-white', explanation: 'แสดงตัวเลขอุณหภูมิปกติบนหน้าจอ', indent: 2 },
      { text: '  }', category: 'control', color: 'bg-rose-500 text-white', explanation: 'จบโครงสร้างเงื่อนไข If-Else', indent: 1 },
      { text: '  basic.pause(1000);', category: 'control', color: 'bg-slate-500 text-white', explanation: 'หน่วงเวลาตรวจวัดซ้ำทุกๆ 1 วินาที', indent: 1 },
      { text: '});', category: 'control', color: 'bg-amber-600 text-white', explanation: 'จบลูปตลอดเวลา' },
    ],
    ipo: {
      input: 'ค่าอุณหภูมิห้องจริงจากเซ็นเซอร์ภายในของ Micro:bit (`input.temperature()`)',
      process: 'เปรียบเทียบเงื่อนไข `temp >= 32` หากเป็นจริงเข้าส่วนเตือนภัย หากเท็จเข้าส่วนแสดงค่าปกติ',
      output: 'เสียงเตือน Buzzer และไอคอน Sad เมื่อร้อนเกิน หรือตัวเลของศาเซลเซียสเมื่อปกติ',
    },
    computationalPillars: {
      decomposition: 'แยกเป็นระบบตรวจวัด -> ระบบตัดสินใจด้วยเงื่อนไข -> ระบบส่งสัญญาณเตือน',
      patternRecognition: 'เมื่ออุณหภูมิขึ้นสูง ค่าตัวเลขจะเพิ่มขึ้นตามลำดับเชิงปริมาณ',
      abstraction: 'กำหนดเกณฑ์ตัดสินใจ (Threshold) ไว้ที่ 32°C เป็นตัวแบ่งสภาวะปลอดภัยกับอันตราย',
      algorithms: 'การตัดสินใจแบบมีสองทางเลือก (If - Else) ภายใต้ลูปทำงานตลอดเวลา (Infinite Loop)',
    },
    commonPitfalls: [
      'ใช้เครื่องหมายผิด เช่น `>` แทน `>=` ทำให้ที่ 32°C พอดีระบบยังไม่ยอมส่งเสียงเตือน',
      'ลืมใส่ `basic.pause(1000)` ทำให้โปรแกรมประมวลผลเร็วเกินไปและกินพลังงานแบตเตอรี่โดยไม่จำเป็น',
    ],
    bridgeChallenge: {
      prompt: '🎯 ภารกิจท้าทาย: ถ้าต้องการเพิ่มการแจ้งเตือนกรณี "หนาวเกินไป (น้อยกว่า 18°C)" ต้องเขียนเงื่อนไขอย่างไร?',
      actionHint: 'ใช้โครงสร้าง `if (temp >= 32) ... else if (temp < 18) { basic.showIcon(IconNames.Confused); } else ...`',
      expectedOutcome: 'ระบบกลายเป็นเทอร์โมมิเตอร์ 3 สภาวะ (ร้อนเกิน, ปกติ, หนาวเกิน) อย่างชาญฉลาด!',
    },
    conceptQuiz: {
      question: 'หากอุณหภูมิที่วัดได้คือ 28°C โปรแกรมจะทำงานในส่วนใด?',
      options: [
        'ทำงานในบล็อก `else` และแสดงตัวเลข 28 บนหน้าจอ LED',
        'ทำงานในบล็อก `if` และส่งเสียงเตือน Buzzer',
        'เครื่องจะหยุดทำงานทันที',
        'แสดงไอคอนหน้าบึ้ง',
      ],
      correctAnswer: 0,
      explanation: 'ถูกต้อง! เพราะ 28°C น้อยกว่า 32°C เงื่อนไข `temp >= 32` จึงเป็นเท็จ (False) โปรแกรมจะข้ามไปทำในส่วนของ `else` คือแสดงตัวเลข 28 นั่นเอง',
    },
  },
  {
    id: 'ex_microbit_rps',
    title: 'เกมเป่ายิ้งฉุบสุ่มอาวุธ (Rock-Paper-Scissors)',
    englishTitle: 'Shake Gesture Multi-branch Game',
    platform: 'microbit',
    grade: 'ป.4',
    difficulty: 'ง่าย (Beginner)',
    points: 20,
    timeEstimate: '4 นาที',
    concepts: ['เงื่อนไข 3 ทางเลือก (If-Else If-Else)', 'สุ่มเลข 1-3', 'ไอคอนภาพกราฟิก'],
    thumbnailGradient: 'from-blue-600 via-indigo-600 to-purple-600',
    thumbnailIcon: '✊',
    accentColor: 'indigo',
    summary: 'เขย่าบอร์ดเพื่อสุ่มออก ค้อน (Rock), กระดาษ (Paper), หรือ กรรไกร (Scissors) บนหน้าจอ LED อย่างยุติธรรม',
    missionScenario: 'สร้างกรรมการเป่ายิ้งฉุบดิจิทัลที่ไม่มีการโกง โดยเมื่อเขย่าบอร์ดพร้อมกัน จะสุ่มออกสัญลักษณ์ทันที',
    presetTarget: 'rps',
    blocks: [
      { text: 'input.onGesture(Gesture.Shake, () => {', category: 'events', color: 'bg-sky-500 text-white', explanation: 'ตรวจจับการเขย่าบอร์ดเพื่อเริ่มเป่ายิ้งฉุบ' },
      { text: '  music.playTone(880, Beat.Quarter);', category: 'looks', color: 'bg-purple-600 text-white', explanation: 'เสียงสัญญาณตอนเริ่มสุ่ม', indent: 1 },
      { text: '  let tool = randint(1, 3);', category: 'variables', color: 'bg-amber-500 text-white', explanation: 'สุ่มตัวเลข 1, 2 หรือ 3 (1=ค้อน, 2=กระดาษ, 3=กรรไกร)', indent: 1 },
      { text: '  if (tool == 1) {', category: 'control', color: 'bg-rose-500 text-white', explanation: 'ถ้าสุ่มได้เลข 1: ออก ค้อน ✊', indent: 1 },
      { text: '    basic.showIcon(IconNames.Square);', category: 'looks', color: 'bg-emerald-600 text-white', explanation: 'แสดงสี่เหลี่ยมทึบแทนค้อนหิน', indent: 2 },
      { text: '  } else if (tool == 2) {', category: 'control', color: 'bg-rose-500 text-white', explanation: 'ถ้าสุ่มได้เลข 2: ออก กระดาษ ✋', indent: 1 },
      { text: '    basic.showIcon(IconNames.SmallSquare);', category: 'looks', color: 'bg-emerald-600 text-white', explanation: 'แสดงกรอบสี่เหลี่ยมแทนแผ่นกระดาษ', indent: 2 },
      { text: '  } else {', category: 'control', color: 'bg-rose-500 text-white', explanation: 'มิฉะนั้น (ต้องเป็นเลข 3 แน่นอน): ออก กรรไกร ✌️', indent: 1 },
      { text: '    basic.showIcon(IconNames.Scissors);', category: 'looks', color: 'bg-emerald-600 text-white', explanation: 'แสดงรูปกรรไกร', indent: 2 },
      { text: '  }', category: 'control', color: 'bg-rose-500 text-white', explanation: 'จบโครงสร้างเงื่อนไข 3 ทางเลือก', indent: 1 },
      { text: '});', category: 'events', color: 'bg-sky-500 text-white', explanation: 'จบล็อกการเขย่า' },
    ],
    ipo: {
      input: 'การเขย่าบอร์ดของผู้เล่น (Gesture.Shake)',
      process: 'สุ่มตัวเลข 1 ถึง 3 และตรวจสอบเงื่อนไขแบบ If - Else If - Else เพื่อกำหนดสัญลักษณ์',
      output: 'ภาพกราฟิก ค้อน, กระดาษ หรือ กรรไกร บนไฟ LED 5x5',
    },
    computationalPillars: {
      decomposition: 'แยกเกมเป่ายิ้งฉุบออกเป็น 3 ผลลัพธ์ที่เป็นไปได้ (ค้อน, กระดาษ, กรรไกร)',
      patternRecognition: 'แต่ละผลลัพธ์มีโอกาสเกิดขึ้นเท่ากัน คือ 1 ใน 3 (ประมาณ 33.3%)',
      abstraction: 'แปลงแนวคิดอาวุธเป่ายิ้งฉุบให้เป็นตัวเลข 1, 2, 3 ในคอมพิวเตอร์',
      algorithms: 'การเลือกทำแบบหลายทางเลือก (Multi-way Selection) เพื่อจับคู่ตัวเลขกับรูปภาพ',
    },
    commonPitfalls: [
      'ใช้เครื่องหมาย `=` ตัวเดียวแทนที่จะเป็น `==` (ในภาษาโปรแกรม `= คือกำหนดค่า` ส่วน `== คือเปรียบเทียบความเท่ากัน`)',
      'เขียน `else if (tool == 3)` แทนที่จะเป็น `else` ธรรมดา (การใช้ `else` บรรทัดสุดท้ายจะครอบคลุมกรณีที่เหลือทั้งหมด)',
    ],
    bridgeChallenge: {
      prompt: '🎯 ภารกิจท้าทาย: ถ้าต้องการเพิ่มทางเลือกที่ 4 เป็น "หลุมดำ (Black Hole)" ต้องแก้อย่างไร?',
      actionHint: 'แก้ `randint(1, 4)` แล้วเพิ่ม `else if (tool == 3)` และใช้ `else` เป็นหลุมดำรูปกากบาท',
      expectedOutcome: 'เกมเป่ายิ้งฉุบจะมี 4 อาวุธ เพิ่มความสนุกยิ่งขึ้น!',
    },
    conceptQuiz: {
      question: 'ทำไมเงื่อนไขสุดท้ายของกรรไกรจึงใช้เพียงคำว่า `else` โดยไม่ต้องใส่ `else if (tool == 3)`?',
      options: [
        'เพราะเมื่อสุ่มเลข 1 ถึง 3 หากไม่ใช่ 1 และไม่ใช่ 2 ค่าที่เหลืออยู่ย่อมต้องเป็น 3 เสมอ',
        'เพราะคอมพิวเตอร์ไม่รู้จักเลข 3',
        'เพื่อประหยัดจำนวนตัวอักษรเท่านั้น',
        'เป็นกฎตายตัวของภาษา TypeScript',
      ],
      correctAnswer: 0,
      explanation: 'ถูกต้อง! การใช้ `else` ปิดท้ายเงื่อนไขหลายทางเลือก จะรองรับกรณีที่เหลือทั้งหมดโดยอัตโนมัติ ทำให้โค้ดกระชับและป้องกันกรณีหลุดเงื่อนไข',
    },
  },
  {
    id: 'ex_microbit_nightlight',
    title: 'โคมไฟส่องสว่างกลางคืนอัตโนมัติ (IoT Night Light)',
    englishTitle: 'Automated Night Light Sensor',
    platform: 'microbit',
    grade: 'ป.6',
    difficulty: 'ท้าทาย (Advanced)',
    points: 30,
    timeEstimate: '6 นาที',
    concepts: ['เซ็นเซอร์วัดความสว่าง (Light Level)', 'ไฟส่องสว่าง LED เต็มจอ 25 ดวง', 'การประหยัดพลังงาน'],
    thumbnailGradient: 'from-amber-500 via-yellow-600 to-slate-800',
    thumbnailIcon: '💡',
    accentColor: 'amber',
    summary: 'ใช้เซ็นเซอร์วัดระดับแสง หากพบว่าห้องมืดลง (ระดับแสง < 50) จะสั่งเปิดไฟ LED เต็มความสว่าง 25 ดวง และดับไฟเมื่อสว่าง',
    missionScenario: 'สร้างโคมไฟหัวเตียงอัจฉริยะที่จะติดเองเมื่อเราปิดไฟนอน และจะดับเองเมื่อตอนเช้าพระอาทิตย์ขึ้น ช่วยประหยัดพลังงาน',
    presetTarget: 'temp',
    blocks: [
      { text: 'basic.forever(() => {', category: 'control', color: 'bg-amber-600 text-white', explanation: 'ทำงานวนซ้ำตลอดเวลาเพื่อตรวจระดับแสง' },
      { text: '  let light = input.lightLevel();', category: 'sensors', color: 'bg-amber-500 text-white', explanation: 'อ่านค่าความสว่างจาก 0 (มืดสนิท) ถึง 255 (สว่างจ้า)', indent: 1 },
      { text: '  if (light < 50) {', category: 'control', color: 'bg-rose-500 text-white', explanation: 'ถ้าห้องมืด (ระดับแสงน้อยกว่าเกณฑ์ 50)', indent: 1 },
      { text: '    basic.showLeds(`', category: 'looks', color: 'bg-emerald-600 text-white', explanation: 'เปิดไฟ LED สีแดงครบทั้ง 25 ดวงสว่างเต็มที่', indent: 2 },
      { text: '      # # # # #', category: 'looks', color: 'bg-emerald-500 text-white', indent: 3 },
      { text: '      # # # # #', category: 'looks', color: 'bg-emerald-500 text-white', indent: 3 },
      { text: '      # # # # #', category: 'looks', color: 'bg-emerald-500 text-white', indent: 3 },
      { text: '      # # # # #', category: 'looks', color: 'bg-emerald-500 text-white', indent: 3 },
      { text: '      # # # # #', category: 'looks', color: 'bg-emerald-500 text-white', indent: 3 },
      { text: '    `);', category: 'looks', color: 'bg-emerald-600 text-white', indent: 2 },
      { text: '  } else {', category: 'control', color: 'bg-rose-500 text-white', explanation: 'มิฉะนั้น (ห้องสว่างเพียงพอแล้ว)', indent: 1 },
      { text: '    basic.clearScreen();', category: 'looks', color: 'bg-emerald-600 text-white', explanation: 'ดับไฟหน้าจอทั้งหมดเพื่อประหยัดพลังงาน', indent: 2 },
      { text: '  }', category: 'control', color: 'bg-rose-500 text-white', explanation: 'จบเงื่อนไข If-Else', indent: 1 },
      { text: '  basic.pause(500);', category: 'control', color: 'bg-slate-500 text-white', explanation: 'หน่วงเวลาตรวจวัดทุก 0.5 วินาที', indent: 1 },
      { text: '});', category: 'control', color: 'bg-amber-600 text-white', explanation: 'จบลูปตลอดเวลา' },
    ],
    ipo: {
      input: 'ระดับแสงจากเซ็นเซอร์วัดแสงของ Micro:bit (ค่า 0 ถึง 255)',
      process: 'ตรวจสอบเงื่อนไข `light < 50` เพื่อประเมินว่าห้องอยู่ในสภาวะมืดหรือไม่',
      output: 'ไฟ LED สว่างเต็มแผง 25 ดวงเมื่อมืด หรือดับหน้าจอเมื่อสว่าง',
    },
    computationalPillars: {
      decomposition: 'แบ่งเป็นเซ็นเซอร์วัดแสง -> ตรรกะเปรียบเทียบระดับแสง -> การควบคุมการเปิดปิดหลอดไฟ',
      patternRecognition: 'กลางคืนค่าแสงจะต่ำกว่า 50 ส่วนกลางวันจะสูงกว่า 100 เสมอ',
      abstraction: 'แปลงความมืดสว่างเชิงกายภาพให้เป็นตัวเลข 0-255 และเกณฑ์ 50',
      algorithms: 'ระบบควบคุมแบบวงรอบปิด (Closed-loop Control) ที่ปรับตัวตามสิ่งแวดล้อม',
    },
    commonPitfalls: [
      'ตั้งค่าเกณฑ์แสงสูงเกินไป (เช่น 200) จะทำให้ไฟเปิดตลอดเวลาแม้ในห้องจะมีแสงสว่างอยู่แล้ว',
      'ลืมคำสั่ง `basic.clearScreen()` ในส่วน `else` ทำให้เมื่อห้องสว่างแล้วไฟก็ยังคงติดค้างอยู่',
    ],
    bridgeChallenge: {
      prompt: '🎯 ภารกิจท้าทาย: ถ้าต้องการให้มี 2 ระดับแสง เช่น มืดปานกลางติดไฟหรี่ มืดสนิทติดไฟจ้า ต้องทำอย่างไร?',
      actionHint: 'ใช้เงื่อนไขซ้อน `if (light < 20) { ...ไฟ 25 ดวง... } else if (light < 60) { ...ไฟ 9 ดวง... } else { clearScreen(); }`',
      expectedOutcome: 'ได้โคมไฟหรี่แสงอัจฉริยะ (Dimmable Smart Lamp) 2 ระดับ!',
    },
    conceptQuiz: {
      question: 'เซ็นเซอร์วัดความสว่างของ Micro:bit ให้ค่าตัวเลขอยู่ในช่วงใด?',
      options: [
        '0 (มืดที่สุด) ถึง 255 (สว่างที่สุด)',
        '1 ถึง 100 เปอร์เซ็นต์',
        '0 ถึง 10 เท่านั้น',
        '-50 ถึง 50',
      ],
      correctAnswer: 0,
      explanation: 'ถูกต้อง! เซ็นเซอร์วัดระดับแสงของ Micro:bit ทำงานในระบบอนาล็อก 8 บิต จึงให้ค่าระหว่าง 0 (มืดสนิท) ถึง 255 (สว่างจ้าที่สุด)',
    },
  },
];
