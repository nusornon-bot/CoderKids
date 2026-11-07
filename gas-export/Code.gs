/**
 * ============================================================================
 * Coder Kids - Google Apps Script Backend (Code.gs)
 * หลักสูตรสื่อการเรียนการสอนวิทยาการคำนวณและเทคโนโลยี (สพฐ. & สสวท.)
 * ============================================================================
 * พัฒนาสำหรับเชื่อมต่อ Google Sheets, Web App, ระบบสมาชิก และ AI Tutor
 * Spreadsheet ID เป้าหมาย: 1tWcZ4OaGZKOcX1PEvVNadyf9mM_igaKcF3ZV_b3L7Ng
 */

// 1. กำหนดค่า Spreadsheet ID (สามารถเปลี่ยนเป็นของโรงเรียนตนเองได้)
const SPREADSHEET_ID = '1tWcZ4OaGZKOcX1PEvVNadyf9mM_igaKcF3ZV_b3L7Ng';

// 2. ชื่อแผ่นงาน (Sheets) ในฐานข้อมูล
const SHEETS = {
  STUDENTS: 'Students',
  DAILY_JOURNALS: 'DailyJournals',
  QUIZ_RESULTS: 'QuizResults',
  SHOWCASE: 'ShowcaseProjects',
  LOGIN_LOGS: 'Logs',
  LEADERBOARD: 'Leaderboard'
};

/**
 * ฟังก์ชันเริ่มต้นสำหรับ Web App (HTTP GET)
 * รองรับทั้งการแสดงผลเว็บแอป (HTML Service) และการดึงข้อมูล JSON API
 */
function doGet(e) {
  // หากมีการร้องขอ JSON API ผ่าน Query parameter เช่น ?api=1&action=getProfiles
  if (e && e.parameter && e.parameter.api === '1') {
    return handleApiGet(e.parameter);
  }

  // แสดงผลหน้าเว็บแอป Coder Kids
  const template = HtmlService.createTemplateFromFile('Index');
  template.appName = 'Coder Kids วิทยาการคำนวณ';
  template.spreadsheetId = getActiveSpreadsheetId();

  return template.evaluate()
    .setTitle('Coder Kids - สื่อการเรียนรู้วิทยาการคำนวณ & Coding Lab')
    .setFaviconUrl('https://img.icons8.com/color/48/source-code.png')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * ฟังก์ชันสำหรับรับคำร้องขอข้อมูล (HTTP POST) จากเว็บหรือ Mobile App
 */
function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;
    let result = { success: false, message: 'Invalid action' };

    switch (action) {
      case 'saveProfile':
        result = saveProfileToSheet(postData.profile, postData.points, postData.completedCount, postData.badges, postData.userEmail);
        break;
      case 'saveMultipleProfiles':
        result = saveMultipleProfilesToSheet(postData.profiles, postData.userEmail);
        break;
      case 'recordLogin':
        result = recordStudentLogin(postData.profile, postData.userEmail);
        break;
      case 'saveDailyJournal':
        result = saveDailyJournal(postData.entry, postData.userEmail);
        break;
      case 'saveQuizResult':
        result = saveQuizResult(postData.quizData);
        break;
      case 'submitShowcase':
        result = submitShowcaseProject(postData.project);
        break;
      case 'getLeaderboard':
        result = getLeaderboard();
        break;
      case 'aiTutor':
        result = handleAiTutorQuery(postData.message, postData.studentContext);
        break;
      case 'sendCertificate':
        result = sendCertificateEmail(postData.email, postData.studentName, postData.courseTitle);
        break;
      default:
        result = { success: false, message: 'Unknown action: ' + action };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * รวมไฟล์ HTML ย่อย (Include Helper สำหรับ GAS)
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * ดึง Spreadsheet ID จาก Script Properties หรือค่าคงที่
 */
function getActiveSpreadsheetId() {
  const prop = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  return prop || SPREADSHEET_ID;
}

/**
 * ดึง Spreadsheet Object
 */
function getDatabaseSpreadsheet() {
  const id = getActiveSpreadsheetId();
  try {
    return SpreadsheetApp.openById(id);
  } catch (e) {
    // กรณีที่รันเป็น Container-bound Script
    return SpreadsheetApp.getActiveSpreadsheet();
  }
}

/**
 * ค้นหาหรือสร้างแผ่นงานตามชื่อ
 */
function getOrCreateSheet(sheetName, headers) {
  const ss = getDatabaseSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
      // จัดรูปแบบหัวตาราง
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#4F46E5') // Indigo-600
        .setFontColor('#FFFFFF')
        .setFontWeight('bold')
        .setHorizontalAlignment('center');
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}

/**
 * ============================================================================
 * ระบบจัดการโปรไฟล์นักเรียน (Student Profiles)
 * ============================================================================
 */
function saveProfileToSheet(profile, points, completedCount, badges, userEmail) {
  const sheet = getOrCreateSheet(SHEETS.STUDENTS, [
    'วันที่อัปเดต', 'ชื่อ-นามสกุล', 'ระดับชั้น/ห้อง', 'โรงเรียน', 'อวตาร',
    'ฉายาที่เลือก', 'คำแนะนำตัว (Bio)', 'แต้มสะสม', 'เลเวล',
    'ภารกิจที่สำเร็จ (จาก 4)', 'เหรียญตราที่ปลดล็อก', 'อีเมลผู้ใช้งาน'
  ]);

  const nowThai = Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyy-MM-dd HH:mm:ss');
  const level = Math.max(1, Math.floor((points || 0) / 75) + 1);
  const badgeTitles = Array.isArray(badges) ? badges.map(b => b.title || b).join(', ') : '';

  const row = [
    nowThai,
    (profile.name || '') + (profile.nickname ? ` (${profile.nickname})` : '') + (profile.studentId ? ` [${profile.studentId}]` : ''),
    profile.grade || '',
    profile.school || '',
    `${profile.avatarEmoji || '🐱'} (${profile.avatarId || 'avatar_1'})`,
    profile.selectedTitle || 'นักเขียนโค้ดมือใหม่',
    (profile.bio || '') + (profile.motto ? ` | ${profile.motto}` : ''),
    points || 0,
    `LV.${level}`,
    `${completedCount || 0}/4`,
    badgeTitles || 'เริ่มต้นการเรียนรู้',
    userEmail || profile.contactEmail || Session.getActiveUser().getEmail() || 'นักเรียน Coder Kids'
  ];

  sheet.appendRow(row);
  return { success: true, updatedRow: sheet.getLastRow() };
}

function saveMultipleProfilesToSheet(profiles, userEmail) {
  if (!Array.isArray(profiles) || profiles.length === 0) {
    return { success: false, message: 'ไม่มีข้อมูลโปรไฟล์' };
  }

  const sheet = getOrCreateSheet(SHEETS.STUDENTS, [
    'วันที่อัปเดต', 'ชื่อ-นามสกุล', 'ระดับชั้น/ห้อง', 'โรงเรียน', 'อวตาร',
    'ฉายาที่เลือก', 'คำแนะนำตัว (Bio)', 'แต้มสะสม', 'เลเวล',
    'ภารกิจที่สำเร็จ (จาก 4)', 'เหรียญตราที่ปลดล็อก', 'อีเมลผู้ใช้งาน'
  ]);

  const nowThai = Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyy-MM-dd HH:mm:ss');
  const rows = profiles.map(p => {
    const level = Math.max(1, Math.floor((p.points || 65) / 75) + 1);
    return [
      nowThai,
      (p.name || '') + (p.nickname ? ` (${p.nickname})` : '') + (p.studentId ? ` [${p.studentId}]` : ''),
      p.grade || '',
      p.school || '',
      `${p.avatarEmoji || '🐱'} (${p.avatarId || 'avatar_1'})`,
      p.selectedTitle || 'นักเขียนโค้ดมือใหม่',
      (p.bio || '') + (p.motto ? ` | ${p.motto}` : ''),
      p.points || 65,
      `LV.${level}`,
      `${p.completedModulesCount || 0}/4`,
      p.unlockedBadgesText || 'เริ่มต้นการเรียนรู้',
      userEmail || p.contactEmail || Session.getActiveUser().getEmail() || 'นักเรียน Coder Kids'
    ];
  });

  const startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, rows.length, rows[0].length).setValues(rows);
  return { success: true, count: rows.length };
}

/**
 * บันทึกการลงชื่อเข้าใช้งานของนักเรียน (Classroom Login Logs)
 */
function recordStudentLogin(profile, userEmail) {
  const sheet = getOrCreateSheet(SHEETS.LOGIN_LOGS, [
    'วันเวลาที่เข้าเรียน', 'ชื่อนักเรียน', 'ระดับชั้น', 'โรงเรียน', 'อวตาร',
    'การดำเนินการ', 'หมายเหตุ', 'สถานะ Streak', 'บทเรียนที่กำลังศึกษา', 'อีเมล'
  ]);

  const nowThai = Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyy-MM-dd HH:mm:ss');
  const row = [
    nowThai,
    (profile.name || '') + (profile.nickname ? ` (${profile.nickname})` : ''),
    profile.grade || '',
    profile.school || '',
    profile.avatarEmoji || '🐱',
    'ลงชื่อเข้าใช้งานห้องเรียน Coder Kids',
    'เข้าเรียนผ่านระบบคลาวด์ Google Apps Script',
    `Streak ${profile.streakDays || 1} วัน`,
    profile.activeModule || 'Dashboard',
    userEmail || Session.getActiveUser().getEmail() || 'นักเรียน'
  ];

  sheet.appendRow(row);
  return { success: true };
}

/**
 * บันทึกสมุดบันทึกประจำวัน (Daily Journal)
 */
function saveDailyJournal(entry, userEmail) {
  const sheet = getOrCreateSheet(SHEETS.DAILY_JOURNALS, [
    'วันที่บันทึก', 'เวลา', 'รหัสนักเรียน', 'ชื่อนักเรียน', 'อารมณ์ (Mood)',
    'กิจกรรมที่ทำ', 'สิ่งที่ได้เรียนรู้', 'อุปสรรคที่พบ', 'เป้าหมายวันพรุ่งนี้',
    'แต้มที่ได้รับ', 'Streak', 'อีเมล'
  ]);

  const row = [
    entry.date || Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyy-MM-dd'),
    entry.time || Utilities.formatDate(new Date(), 'Asia/Bangkok', 'HH:mm:ss'),
    entry.studentId || '',
    entry.studentName || '',
    `${entry.moodEmoji || '😊'} ${entry.mood || 'สนุกสนาน'}`,
    entry.activity || '',
    entry.learningKey || '',
    entry.challengeFaced || '-',
    entry.tomorrowGoal || '-',
    entry.pointsEarned || 15,
    entry.streakDayCount || 1,
    userEmail || Session.getActiveUser().getEmail() || 'นักเรียน'
  ];

  sheet.appendRow(row);
  return { success: true };
}

/**
 * บันทึกคะแนนแบบทดสอบ (Quiz Results)
 */
function saveQuizResult(quizData) {
  const sheet = getOrCreateSheet(SHEETS.QUIZ_RESULTS, [
    'วันเวลาที่ทำข้อสอบ', 'ชื่อนักเรียน', 'โมดูล', 'คะแนนที่ได้', 'คะแนนเต็ม',
    'เปอร์เซ็นต์', 'สถานะการผ่าน', 'เวลาที่ใช้ (วินาที)', 'ข้อที่ตอบถูก'
  ]);

  const nowThai = Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyy-MM-dd HH:mm:ss');
  const percent = Math.round((quizData.score / (quizData.total || 1)) * 100);
  const isPassed = percent >= 70;

  const row = [
    nowThai,
    quizData.studentName || 'นักเรียน',
    quizData.moduleTitle || 'วิทยาการคำนวณ',
    quizData.score || 0,
    quizData.total || 5,
    `${percent}%`,
    isPassed ? 'ผ่านเกณฑ์ (Passed)' : 'ควรทบทวนเพิ่มเติม',
    quizData.timeSpentSeconds || 0,
    (quizData.correctIndices || []).join(', ')
  ];

  sheet.appendRow(row);
  return { success: true, isPassed: isPassed };
}

/**
 * นำส่งโครงงานเข้าสู่ Showcase Gallery
 */
function submitShowcaseProject(project) {
  const sheet = getOrCreateSheet(SHEETS.SHOWCASE, [
    'วันเวลาที่ส่ง', 'ชื่อโครงงาน', 'ผู้พัฒนา', 'ระดับชั้น', 'โรงเรียน',
    'หมวดหมู่', 'ลิงก์โครงงาน (Scratch/Microbit)', 'คำอธิบายโครงงาน', 'จำนวนไลก์', 'สถานะ'
  ]);

  const nowThai = Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyy-MM-dd HH:mm:ss');
  const row = [
    nowThai,
    project.title || '',
    project.authorName || '',
    project.grade || '',
    project.school || '',
    project.category || 'scratch',
    project.projectUrl || '',
    project.description || '',
    project.likesCount || 0,
    'อนุมัติจัดแสดง (Approved)'
  ];

  sheet.appendRow(row);
  return { success: true };
}

/**
 * ดึงข้อมูลกระดานผู้นำ (Leaderboard)
 */
function getLeaderboard() {
  const sheet = getOrCreateSheet(SHEETS.STUDENTS);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    return { success: true, leaderboard: [] };
  }

  const students = [];
  // แถวแรกเป็น Header
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    students.push({
      name: row[1],
      grade: row[2],
      school: row[3],
      avatar: row[4],
      points: parseInt(row[7], 10) || 0,
      level: row[8],
      completedModules: row[9]
    });
  }

  // เรียงลำดับตามแต้มสะสมมากไปหาน้อย
  students.sort((a, b) => b.points - a.points);

  return {
    success: true,
    leaderboard: students.slice(0, 20)
  };
}

/**
 * ระบบ AI Tutor ปรึกษาบทเรียนผ่าน Google Apps Script (UrlFetchApp)
 */
function handleAiTutorQuery(message, studentContext) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  
  if (!apiKey) {
    // โหมดตอบกลับการศึกษาอัตโนมัติ (Fallback เมื่อยังไม่ได้ตั้ง API Key ใน Apps Script)
    const lower = (message || '').toLowerCase();
    let reply = 'สวัสดีครับน้องๆ! ครูพี่โค้ดดิ้ง (Coder Kids GAS AI Tutor) ยินดีต้อนรับครับ 🤖✨\n\n';
    if (lower.includes('pdpa') || lower.includes('ความปลอดภัย')) {
      reply += '🛡️ **เกร็ดความรู้ PDPA:** ข้อมูลส่วนบุคคล เช่น ชื่อจริง เบอร์โทร และรหัสผ่าน ห้ามเปิดเผยสู่สาธารณะโดยเด็ดขาดครับ!';
    } else if (lower.includes('scratch')) {
      reply += '🐱 **เทคนิค Scratch:** บล็อก `when green flag clicked` + `forever` + `if on edge, bounce` ช่วยให้ตัวละครเคลื่อนไหวต่อเนื่องได้สวยงามครับ!';
    } else if (lower.includes('micro:bit') || lower.includes('microbit')) {
      reply += '📟 **Micro:bit IoT:** ใช้บล็อก `temperature (°C)` เพื่อตรวจวัดอุณหภูมิห้อง และสั่งเปิดพัดลมจำลองได้ง่ายๆ ครับ!';
    } else {
      reply += 'น้องๆ สามารถถามคำถามเกี่ยวกับการเขียนโค้ด Scratch, Micro:bit, กฎหมาย PDPA และการทำโครงงานได้ตลอดเวลาเลยนะครับ!';
    }
    return { success: true, reply: reply };
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{
        parts: [{
          text: `คุณคือ "ครูพี่โค้ดดิ้ง" ผู้ช่วยสอนวิชาวิทยาการคำนวณสำหรับเด็ก ป.4-ป.6 ตอบอบอุ่น เข้าใจง่าย มีอิโมจิ\nคำถาม: ${message}`
        }]
      }]
    };

    const response = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });

    const json = JSON.parse(response.getContentText());
    const reply = json.candidates[0].content.parts[0].text;
    return { success: true, reply: reply };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * ส่งเกียรติบัตรผ่านทาง Gmail (MailApp)
 */
function sendCertificateEmail(studentEmail, studentName, courseTitle) {
  if (!studentEmail) {
    return { success: false, message: 'ไม่มีที่อยู่อีเมลผู้รับ' };
  }

  const subject = `🏆 ยินดีด้วยครับ! เกียรติบัตรการเรียนรู้วิทยาการคำนวณ Coder Kids - ${studentName}`;
  const htmlBody = `
    <div style="font-family: 'Prompt', Tahoma, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 2px solid #4F46E5; border-radius: 16px; background-color: #F8FAFC;">
      <h2 style="color: #4F46E5; text-align: center;">🎉 ขอแสดงความยินดีกับคนเก่ง!</h2>
      <p>เรียน คุณครูและผู้ปกครองของ <strong>${studentName}</strong>,</p>
      <p>นักเรียนได้สำเร็จหลักสูตร <strong>${courseTitle || 'วิทยาการคำนวณและเทคโนโลยี (สพฐ. & สสวท.)'}</strong> บนแพลตฟอร์ม <strong>Coder Kids</strong> เรียบร้อยแล้ว</p>
      <div style="background: white; padding: 15px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #10B981;">
        <p style="margin: 0; color: #047857; font-weight: bold;">✅ ได้รับการรับรองสมรรถนะครบทั้ง 4 ด้าน:</p>
        <ul style="color: #374151; font-size: 14px;">
          <li>ความปลอดภัยไซเบอร์ & กฎหมาย PDPA</li>
          <li>การคิดเชิงคำนวณและขั้นตอนวิธี (Computational Thinking)</li>
          <li>การเขียนโปรแกรม Scratch & จำลองบอร์ด Micro:bit</li>
          <li>การสร้างสรรค์โครงงานและการทำงานร่วมกันในชั้นเรียน</li>
        </ul>
      </div>
      <p style="text-align: center; color: #6B7280; font-size: 12px;">ออกโดยระบบคลาวด์ Coder Kids & Google Apps Script</p>
    </div>
  `;

  MailApp.sendEmail({
    to: studentEmail,
    subject: subject,
    htmlBody: htmlBody
  });

  return { success: true, sentTo: studentEmail };
}

/**
 * ============================================================================
 * ฟังก์ชันติดตั้งและเตรียมฐานข้อมูลอัตโนมัติ (Database Auto-Setup)
 * ครู/ผู้พัฒนาสามารถคลิก "Run" ฟังก์ชันนี้ครั้งเดียวใน Apps Script Editor
 * ============================================================================
 */
function setupCoderKidsDatabase() {
  const ss = getDatabaseSpreadsheet();
  
  // 1. แผ่นงานนักเรียน
  const studentSheet = getOrCreateSheet(SHEETS.STUDENTS, [
    'วันที่อัปเดต', 'ชื่อ-นามสกุล', 'ระดับชั้น/ห้อง', 'โรงเรียน', 'อวตาร',
    'ฉายาที่เลือก', 'คำแนะนำตัว (Bio)', 'แต้มสะสม', 'เลเวล',
    'ภารกิจที่สำเร็จ (จาก 4)', 'เหรียญตราที่ปลดล็อก', 'อีเมลผู้ใช้งาน'
  ]);

  // ตัวอย่างข้อมูลเริ่มต้น
  if (studentSheet.getLastRow() === 1) {
    studentSheet.appendRow([
      Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyy-MM-dd HH:mm:ss'),
      'ด.ช. ภัทรพล เจริญศิลป์ (ภัทร)',
      'ป.5/1',
      'โรงเรียนสาธิตนวัตกรรมคอมพิวเตอร์',
      '🐱 (avatar_1)',
      'เซียนโค้ดดิ้งรุ่นจิ๋ว',
      'ชอบสร้างเกม Scratch และต่อวงจร Micro:bit',
      120,
      'LV.2',
      '3/4',
      '🛡️ ผู้พิทักษ์ข้อมูล, 🧩 ยอดนักคิดอัลกอริทึม',
      'student1@coderkids.school'
    ]);
  }

  // 2. แผ่นงานบันทึกประจำวัน
  getOrCreateSheet(SHEETS.DAILY_JOURNALS, [
    'วันที่บันทึก', 'เวลา', 'รหัสนักเรียน', 'ชื่อนักเรียน', 'อารมณ์ (Mood)',
    'กิจกรรมที่ทำ', 'สิ่งที่ได้เรียนรู้', 'อุปสรรคที่พบ', 'เป้าหมายวันพรุ่งนี้',
    'แต้มที่ได้รับ', 'Streak', 'อีเมล'
  ]);

  // 3. แผ่นงานผลสอบ
  getOrCreateSheet(SHEETS.QUIZ_RESULTS, [
    'วันเวลาที่ทำข้อสอบ', 'ชื่อนักเรียน', 'โมดูล', 'คะแนนที่ได้', 'คะแนนเต็ม',
    'เปอร์เซ็นต์', 'สถานะการผ่าน', 'เวลาที่ใช้ (วินาที)', 'ข้อที่ตอบถูก'
  ]);

  // 4. แผ่นงานแสดงผลงาน
  getOrCreateSheet(SHEETS.SHOWCASE, [
    'วันเวลาที่ส่ง', 'ชื่อโครงงาน', 'ผู้พัฒนา', 'ระดับชั้น', 'โรงเรียน',
    'หมวดหมู่', 'ลิงก์โครงงาน (Scratch/Microbit)', 'คำอธิบายโครงงาน', 'จำนวนไลก์', 'สถานะ'
  ]);

  // 5. แผ่นงานบันทึกการเข้าเรียน
  getOrCreateSheet(SHEETS.LOGIN_LOGS, [
    'วันเวลาที่เข้าเรียน', 'ชื่อนักเรียน', 'ระดับชั้น', 'โรงเรียน', 'อวตาร',
    'การดำเนินการ', 'หมายเหตุ', 'สถานะ Streak', 'บทเรียนที่กำลังศึกษา', 'อีเมล'
  ]);

  Logger.log('✅ ติดตั้งฐานข้อมูล Coder Kids บน Google Sheets เรียบร้อยแล้ว!');
  return 'Database setup completed successfully!';
}
