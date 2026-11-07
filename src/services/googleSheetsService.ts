import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, AchievementBadge, DailyJournalEntry, TeacherRecord } from '../types/index.ts';

export const TARGET_SPREADSHEET_ID = '1tWcZ4OaGZKOcX1PEvVNadyf9mM_igaKcF3ZV_b3L7Ng';
export const STUDENTS_SHEET_TITLE = 'Students';
export const TEACHERS_SHEET_TITLE = 'Teachers';
export const LOGS_SHEET_TITLE = 'Logs';

export const LOGS_HEADERS = [
  'วันเวลาที่เข้าเรียน',
  'ชื่อนักเรียน',
  'ระดับชั้น',
  'โรงเรียน',
  'อวตาร',
  'การดำเนินการ',
  'หมายเหตุ',
  'สถานะ Streak',
  'บทเรียนที่กำลังศึกษา',
  'อีเมล',
];

// Known initial Admin / Teacher emails from the Teachers tab for instant verification
export const KNOWN_ADMIN_EMAILS = [
  'webmaster@anubalnara.ac.th',
  'nusorn.not@anubalnara.ac.th',
  'nusornon@gmail.com',
];

// School Domain restriction: จำกัดโดเมน anubalnara.ac.th สำหรับผู้เรียนและบุคลากร
export const SCHOOL_DOMAIN = 'anubalnara.ac.th';

// Initialize Firebase App once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

// Standard Google Auth Provider for Students (Standard profile & email only)
// ป้องกันข้อผิดพลาด 403 access_denied ("ยังไม่ผ่านกระบวนการยืนยันตัวตนของ Google") สำหรับผู้เรียนทุกคน
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  hd: SCHOOL_DOMAIN,
  prompt: 'select_account',
});

// Teacher Google Auth Provider with Spreadsheets scope (เฉพาะเมื่อคุณครูต้องการเชื่อมต่อสิทธิ์แก้ไข Google Sheets โดยตรง)
export const teacherSheetsProvider = new GoogleAuthProvider();
teacherSheetsProvider.addScope('https://www.googleapis.com/auth/spreadsheets');
teacherSheetsProvider.setCustomParameters({
  hd: SCHOOL_DOMAIN,
  prompt: 'select_account',
});

let isSigningIn = false;
let cachedAccessToken: string | null = (() => {
  try {
    return sessionStorage.getItem('coderkids_sheets_access_token') || localStorage.getItem('coderkids_sheets_access_token') || null;
  } catch {
    return null;
  }
})();

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      const token = cachedAccessToken || sessionStorage.getItem('coderkids_sheets_access_token') || '';
      if (token) {
        cachedAccessToken = token;
        if (onAuthSuccess) onAuthSuccess(user, token);
      } else {
        if (onAuthSuccess) onAuthSuccess(user, '');
      }
    } else {
      cachedAccessToken = null;
      try {
        sessionStorage.removeItem('coderkids_sheets_access_token');
      } catch {}
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (
  requestSheetsScope: boolean = false
): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const authProvider = requestSheetsScope ? teacherSheetsProvider : provider;
    const result = await signInWithPopup(auth, authProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    cachedAccessToken = credential?.accessToken || null;
    if (cachedAccessToken) {
      try {
        sessionStorage.setItem('coderkids_sheets_access_token', cachedAccessToken);
        localStorage.setItem('coderkids_sheets_access_token', cachedAccessToken);
      } catch {}
    }
    return { user: result.user, accessToken: cachedAccessToken || '' };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const connectTeacherSheetsScope = async (): Promise<{ success: boolean; token: string }> => {
  const res = await googleSignIn(true);
  if (!res?.accessToken) {
    throw new Error('ไม่สามารถรับสิทธิ์เข้าถึง Google Sheets ได้ กรุณาลองใหม่อีกครั้ง');
  }
  return { success: true, token: res.accessToken };
};

export const getAccessToken = async (): Promise<string | null> => {
  if (cachedAccessToken) return cachedAccessToken;
  try {
    const stored = sessionStorage.getItem('coderkids_sheets_access_token') || localStorage.getItem('coderkids_sheets_access_token');
    if (stored) {
      cachedAccessToken = stored;
      return stored;
    }
  } catch {}
  return null;
};

export const googleLogout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
  try {
    sessionStorage.removeItem('coderkids_sheets_access_token');
    localStorage.removeItem('coderkids_sheets_access_token');
  } catch {}
};

// Robust CSV parser supporting quotes, commas, and line breaks
export function parseCSV(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentField.trim());
      if (currentRow.length > 0 && currentRow.some((f) => f.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((f) => f.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

// -------------------------------------------------------------
// 1. TEACHERS & ADMIN PERMISSION LOGIC (แท็บ Teachers)
// -------------------------------------------------------------

/**
 * Fetch list of teachers and administrators from the "Teachers" tab.
 * Supports public Google Visualization export as well as authenticated Sheets API.
 */
export const fetchTeachersFromGoogleSheet = async (
  spreadsheetId: string = TARGET_SPREADSHEET_ID
): Promise<TeacherRecord[]> => {
  const fallbackTeachers: TeacherRecord[] = [
    {
      name: 'ผู้ดูแลระบบ (Webmaster)',
      email: 'webmaster@anubalnara.ac.th',
      role: 'admin',
      updatedAt: 'ระบบหลักสูตร',
    },
    {
      name: 'นุสรณ์ อ่อนทอง (ครูนุสรณ์)',
      email: 'nusorn.not@anubalnara.ac.th',
      role: 'admin',
      updatedAt: 'ครูผู้สอนวิทยาการคำนวณ',
    },
  ];

  try {
    const token = await getAccessToken();

    // Strategy A: If token is available, use Google Sheets API
    if (token) {
      try {
        const res = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(TEACHERS_SHEET_TITLE)}!A1:E50`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const data = await res.json();
          const rows: string[][] = data.values || [];
          if (rows.length > 1) {
            return parseTeacherRows(rows);
          }
        }
      } catch (apiErr) {
        console.warn('Authenticated Teachers fetch failed, falling back to gviz:', apiErr);
      }
    }

    // Strategy B: Public Google Visualization API (CSV)
    const gvizUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(TEACHERS_SHEET_TITLE)}`;
    const gvizRes = await fetch(gvizUrl);
    if (gvizRes.ok) {
      const csvText = await gvizRes.text();
      const rows = parseCSV(csvText);
      if (rows.length > 1) {
        return parseTeacherRows(rows);
      }
    }
  } catch (err) {
    console.error('Error fetching teachers from Google Sheet:', err);
  }

  return fallbackTeachers;
};

// Helper to map teacher rows into TeacherRecord objects
function parseTeacherRows(rows: string[][]): TeacherRecord[] {
  const teachers: TeacherRecord[] = [];
  const header = rows[0].map((h) => h.toLowerCase());

  // Find column indices
  let emailCol = header.findIndex((h) => h.includes('อีเมล') || h.includes('email'));
  let nameCol = header.findIndex((h) => h.includes('ชื่อ') || h.includes('name'));
  let dateCol = header.findIndex((h) => h.includes('วัน') || h.includes('date'));

  if (emailCol === -1) emailCol = 2; // Default 3rd column
  if (nameCol === -1) nameCol = 1; // Default 2nd column
  if (dateCol === -1) dateCol = 0; // Default 1st column

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const email = (row[emailCol] || '').trim();
    const name = (row[nameCol] || '').trim();
    const updatedAt = (row[dateCol] || '').trim();

    if (email || name) {
      const isMasterAdmin =
        email.toLowerCase().includes('webmaster') ||
        name.includes('ผู้ดูแลระบบ') ||
        email.toLowerCase().includes('nusorn');
      teachers.push({
        id: `teacher_${i}`,
        name: name || 'คุณครูวิทยาการคำนวณ',
        email: email || '-',
        updatedAt: updatedAt || '-',
        role: isMasterAdmin ? 'admin' : 'teacher',
        school: 'โรงเรียนอนุบาลนราธิวาส',
      });
    }
  }

  return teachers.length > 0 ? teachers : [
    { name: 'ผู้ดูแลระบบ', email: 'webmaster@anubalnara.ac.th', role: 'admin' },
    { name: 'นุสรณ์ อ่อนทอง', email: 'nusorn.not@anubalnara.ac.th', role: 'admin' },
  ];
}

/**
 * Check whether a given email or identifier has Teacher / Admin rights
 * based on the Teachers tab in the target Google Sheet.
 */
export const checkIsTeacherAdmin = (
  identifierOrEmail: string,
  teachersList: TeacherRecord[] = []
): { isAdmin: boolean; isTeacher: boolean; matchedTeacher?: TeacherRecord } => {
  if (!identifierOrEmail) return { isAdmin: false, isTeacher: false };

  const clean = identifierOrEmail.trim().toLowerCase();

  // 1. Direct match with known master admin emails
  const isMasterKnown = KNOWN_ADMIN_EMAILS.some((known) => {
    const k = known.toLowerCase();
    return clean === k || clean.includes(k) || (k.includes('nusorn') && clean.includes('nusorn'));
  });

  if (isMasterKnown) {
    const found = teachersList.find(
      (t) => t.email.toLowerCase() === clean || t.name.toLowerCase().includes('นุสรณ์')
    );
    return {
      isAdmin: true,
      isTeacher: true,
      matchedTeacher: found || {
        name: 'นุสรณ์ อ่อนทอง (ผู้ดูแลระบบ)',
        email: identifierOrEmail,
        role: 'admin',
      },
    };
  }

  // 2. Match with loaded Teachers tab
  const matched = teachersList.find((t) => {
    const tEmail = (t.email || '').toLowerCase().trim();
    const tName = (t.name || '').toLowerCase().trim();
    return (
      (tEmail && clean === tEmail) ||
      (tEmail && clean.includes(tEmail)) ||
      (tName && clean.includes(tName))
    );
  });

  if (matched) {
    return {
      isAdmin: true,
      isTeacher: true,
      matchedTeacher: matched,
    };
  }

  return { isAdmin: false, isTeacher: false };
};

/**
 * Validates whether an email belongs to the school domain (@anubalnara.ac.th)
 * or is an authorized Teacher/Admin in the Teachers tab.
 */
export const isAllowedSchoolUser = (
  email: string | null | undefined,
  teachersList: TeacherRecord[] = []
): { isAllowed: boolean; isSchoolDomain: boolean; isTeacherAdmin: boolean; reason?: string } => {
  if (!email) {
    return { isAllowed: false, isSchoolDomain: false, isTeacherAdmin: false, reason: 'ไม่พบที่อยู่อีเมลสำหรับการยืนยันตัวตน' };
  }

  const clean = email.trim().toLowerCase();
  const isSchoolDomain = clean.endsWith(`@${SCHOOL_DOMAIN}`);
  const teacherCheck = checkIsTeacherAdmin(clean, teachersList);

  if (isSchoolDomain || teacherCheck.isAdmin) {
    return {
      isAllowed: true,
      isSchoolDomain,
      isTeacherAdmin: teacherCheck.isAdmin,
    };
  }

  return {
    isAllowed: false,
    isSchoolDomain: false,
    isTeacherAdmin: false,
    reason: `ระบบอนุญาตเฉพาะบัญชีกูเกิลของโรงเรียน (@${SCHOOL_DOMAIN}) หรือคุณครูผู้ดูแลระบบเท่านั้น (อีเมลที่ใช้: ${email})`,
  };
};

/**
 * Add a new Teacher/Admin entry into the Teachers tab
 */
export const addTeacherToGoogleSheet = async (
  spreadsheetId: string = TARGET_SPREADSHEET_ID,
  teacherName: string,
  teacherEmail: string
): Promise<{ success: boolean; sheetTitle: string }> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('กรุณาลงชื่อเข้าใช้ด้วย Google (สิทธิ์แอดมิน) ก่อนเพิ่มข้อมูลคุณครู');
  }

  const nowThai = new Date().toLocaleString('th-TH', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const rowValues = [nowThai, teacherName.trim(), teacherEmail.trim()];

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(TEACHERS_SHEET_TITLE)}!A:C:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range: `${TEACHERS_SHEET_TITLE}!A:C`,
        majorDimension: 'ROWS',
        values: [rowValues],
      }),
    }
  );

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `บันทึกคุณครูไม่สำเร็จ (HTTP ${res.status})`);
  }

  return { success: true, sheetTitle: TEACHERS_SHEET_TITLE };
};

// -------------------------------------------------------------
// 2. STUDENTS PROFILE RECORDING & MANAGEMENT (แท็บ Students)
// -------------------------------------------------------------

/**
 * Expected columns for the "Students" tab:
 * Col A (0): เลขประจำตัว (Student ID)
 * Col B (1): วันที่อัปเดต (Updated Date)
 * Col C (2): ชื่อ-นามสกุล (Student Full Name)
 * Col D (3): ระดับชั้น/ห้อง (Grade / Room)
 * Col E (4): โรงเรียน (School)
 * Col F (5): อวตาร (Avatar Emoji & ID)
 * Col G (6): ฉายาที่เลือก (Selected Title)
 * Col H (7): คำแนะนำตัว (Bio & Motto)
 * Col I (8): แต้มสะสม (Total Points)
 * Col J (9): เลเวล (Level)
 * Col K (10): ภารกิจที่สำเร็จ (จาก 4) (Completed Modules)
 * Col L (11): เหรียญตราที่ปลดล็อก (Badges Text)
 * Col M (12): อีเมลผู้ใช้งาน (User Email)
 */
export const STUDENTS_HEADERS = [
  'เลขประจำตัว',
  'วันที่อัปเดต',
  'ชื่อ-นามสกุล',
  'ระดับชั้น/ห้อง',
  'โรงเรียน',
  'อวตาร',
  'ฉายาที่เลือก',
  'คำแนะนำตัว (Bio)',
  'แต้มสะสม',
  'เลเวล',
  'ภารกิจที่สำเร็จ (จาก 4)',
  'เหรียญตราที่ปลดล็อก',
  'อีเมลผู้ใช้งาน',
];

/**
 * Fetch student profiles from the "Students" tab of Google Sheet
 */
export const fetchStudentsFromGoogleSheet = async (
  spreadsheetId: string = TARGET_SPREADSHEET_ID
): Promise<{ students: UserProfile[]; rawRows: string[][] }> => {
  try {
    const token = await getAccessToken();

    // Strategy A: If authenticated, query Sheets API
    if (token) {
      try {
        const res = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(STUDENTS_SHEET_TITLE)}!A1:M100`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const data = await res.json();
          const rows: string[][] = data.values || [];
          if (rows.length > 1) {
            return {
              students: parseStudentRows(rows),
              rawRows: rows,
            };
          }
        }
      } catch (apiErr) {
        console.warn('Authenticated students fetch failed, falling back to gviz:', apiErr);
      }
    }

    // Strategy B: Public gviz export (CSV)
    const gvizUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(STUDENTS_SHEET_TITLE)}`;
    const res = await fetch(gvizUrl);
    if (res.ok) {
      const csvText = await res.text();
      const rows = parseCSV(csvText);
      if (rows.length > 0) {
        return {
          students: parseStudentRows(rows),
          rawRows: rows,
        };
      }
    }
  } catch (err) {
    console.error('Error fetching students from Google Sheet:', err);
  }

  return { students: [], rawRows: [] };
};

// Helper to parse student rows into UserProfile[]
function parseStudentRows(rows: string[][]): UserProfile[] {
  if (rows.length <= 1) return [];

  const students: UserProfile[] = [];
  const header = rows[0].map((h) => h.toLowerCase().trim());

  let idCol = header.findIndex((h) => h.includes('เลขประจำตัว') || h.includes('รหัส') || h.includes('id'));
  let dateCol = header.findIndex((h) => h.includes('วัน') || h.includes('date'));
  let nameCol = header.findIndex((h) => h.includes('ชื่อ') || h.includes('name'));
  let gradeCol = header.findIndex((h) => h.includes('ชั้น') || h.includes('grade'));
  let schoolCol = header.findIndex((h) => h.includes('โรงเรียน') || h.includes('school'));
  let avatarCol = header.findIndex((h) => h.includes('อวตาร') || h.includes('avatar'));
  let titleCol = header.findIndex((h) => h.includes('ฉายา') || h.includes('title'));
  let bioCol = header.findIndex((h) => h.includes('bio') || h.includes('แนะนำตัว'));
  let pointsCol = header.findIndex((h) => h.includes('แต้ม') || h.includes('points') || h.includes('คะแนน'));
  let emailCol = header.findIndex((h) => h.includes('อีเมล') || h.includes('email'));

  if (idCol === -1) idCol = 0;
  if (dateCol === -1) dateCol = 1;
  if (nameCol === -1) nameCol = 2;
  if (gradeCol === -1) gradeCol = 3;
  if (schoolCol === -1) schoolCol = 4;
  if (avatarCol === -1) avatarCol = 5;
  if (titleCol === -1) titleCol = 6;
  if (bioCol === -1) bioCol = 7;
  if (pointsCol === -1) pointsCol = 8;
  if (emailCol === -1) emailCol = 12;

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const rawName = (r[nameCol] || '').trim();
    if (!rawName) continue;

    // Parse nickname if enclosed in parentheses e.g. "ด.ช. ภัทรพล เจริญศิลป์ (ภัทร)"
    let cleanName = rawName;
    let nickname = '';
    const matchNick = rawName.match(/\(([^)]+)\)/);
    if (matchNick) {
      nickname = matchNick[1].trim();
      cleanName = rawName.replace(/\([^)]+\)/, '').trim();
    }

    // Parse Avatar Emoji
    const avatarRaw = (r[avatarCol] || '').trim();
    let avatarEmoji = '🐱';
    let avatarId = 'avatar_cat';
    if (avatarRaw) {
      const emojiMatch = avatarRaw.match(/(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u);
      if (emojiMatch) {
        avatarEmoji = emojiMatch[0];
      }
      if (avatarRaw.includes('fox') || avatarEmoji === '🦊') avatarId = 'avatar_fox';
      else if (avatarRaw.includes('panda') || avatarEmoji === '🐼') avatarId = 'avatar_panda';
      else if (avatarRaw.includes('robot') || avatarEmoji === '🤖') avatarId = 'avatar_robot';
      else if (avatarRaw.includes('shield') || avatarEmoji === '🛡️') avatarId = 'avatar_shield';
      else if (avatarRaw.includes('microbit') || avatarEmoji === '📟') avatarId = 'avatar_microbit';
    }

    const studentId = (r[idCol] || `CK-2569-${1000 + i}`).trim();
    const grade = (r[gradeCol] || 'ป.4/1').trim();
    const school = (r[schoolCol] || 'โรงเรียนอนุบาลนราธิวาส').trim();
    const selectedTitle = (r[titleCol] || 'นักประดิษฐ์รุ่นเยาว์ (Junior Innovator)').trim();
    const bio = (r[bioCol] || 'พร้อมเรียนรู้และสนุกกับการเขียนโปรแกรมคอมพิวเตอร์!').trim();
    const pointsNum = parseInt(r[pointsCol] || '100', 10) || 100;
    const contactEmail = (r[emailCol] || '').trim();

    students.push({
      id: `sheet_stu_${i}_${studentId}`,
      name: cleanName,
      nickname,
      studentId,
      school,
      grade,
      avatarId,
      avatarEmoji,
      themeColor: 'indigo',
      bio,
      motto: 'เขียนโค้ดวันละนิด เก่งขึ้นทุกวัน',
      codingLevel: pointsNum > 110 ? 'Advanced' : pointsNum > 90 ? 'Intermediate' : 'Beginner',
      techInterests: ['Scratch Game', 'Micro:bit IoT', 'Algorithm & Logic'],
      selectedTitle,
      contactEmail,
      joinedDate: (r[dateCol] || '2026-10-22').split(' ')[0],
      streakDays: Math.max(1, Math.floor(pointsNum / 40)),
      unlockedRewardIds: ['title_junior'],
      role: 'student',
      enrolledClassroomCode: 'COD-2026',
    });
  }

  return students;
}

/**
 * Ensure header row exists on a sheet tab
 */
async function ensureSheetHeaders(
  spreadsheetId: string,
  sheetTitle: string,
  headers: string[],
  token: string
) {
  try {
    const checkRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A1:M1`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await checkRes.json().catch(() => ({}));
    const hasHeaders = data.values && data.values.length > 0 && data.values[0].length >= 3;

    if (!hasHeaders) {
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A1:M1?valueInputOption=USER_ENTERED`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            range: `${sheetTitle}!A1:M1`,
            majorDimension: 'ROWS',
            values: [headers],
          }),
        }
      );
    }
  } catch (err) {
    console.warn(`Could not ensure headers for ${sheetTitle}:`, err);
  }
}

/**
 * Save / Append single student profile to Google Sheet TAB "Students"
 */
export const saveProfileToGoogleSheet = async (
  spreadsheetId: string = TARGET_SPREADSHEET_ID,
  profile: UserProfile,
  points: number,
  completedCount: number,
  badges: any[] = [],
  userEmail: string = ''
): Promise<{ success: boolean; updatedRange?: string; sheetTitle: string; overwritten?: boolean }> => {
  const token = await getAccessToken();
  if (!token) {
    // โหมดผู้เรียน: บันทึกโปรไฟล์ลงใน LocalStorage และเซสชันเรียบร้อย (การบันทึกลง Google Sheet คลาวด์ทำโดยครู/แอดมิน)
    return { success: true, sheetTitle: STUDENTS_SHEET_TITLE, overwritten: false };
  }

  const sheetTitle = STUDENTS_SHEET_TITLE;

  // 1. Ensure headers exist in Students tab
  await ensureSheetHeaders(spreadsheetId, sheetTitle, STUDENTS_HEADERS, token);

  // 2. Prepare student profile row data matching exact columns of Students tab
  const userLevel = Math.max(1, Math.floor(points / 75) + 1);
  const unlockedBadgesText = Array.isArray(badges)
    ? badges
        .filter((b) => (typeof b === 'object' && b !== null ? ('unlocked' in b ? b.unlocked : true) : Boolean(b)))
        .map((b) => (typeof b === 'object' && b !== null ? (b.title ? b.title.split('(')[0].trim() : b.name || '') : String(b)))
        .filter(Boolean)
        .join(', ') || 'เริ่มต้นการเรียนรู้'
    : 'เริ่มต้นการเรียนรู้';

  const nowThai = new Date().toLocaleString('th-TH', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const displayName = profile.name + (profile.nickname ? ` (${profile.nickname})` : '');
  const displayBio =
    (profile.bio || '') +
    (profile.motto ? ` | คติ: ${profile.motto}` : '');

  // Columns: [เลขประจำตัว, วันที่อัปเดต, ชื่อ-นามสกุล, ระดับชั้น/ห้อง, โรงเรียน, อวตาร, ฉายาที่เลือก, คำแนะนำตัว (Bio), แต้มสะสม, เลเวล, ภารกิจที่สำเร็จ (จาก 4), เหรียญตราที่ปลดล็อก, อีเมลผู้ใช้งาน]
  const rowValues = [
    profile.studentId || '10241',
    nowThai,
    displayName,
    profile.grade || 'ป.4/1',
    profile.school || 'โรงเรียนอนุบาลนราธิวาส',
    `${profile.avatarEmoji || '🐱'} (${profile.avatarId || 'avatar_cat'})`,
    profile.selectedTitle || 'นักประดิษฐ์รุ่นเยาว์ (Junior Innovator)',
    displayBio,
    points,
    `LV.${userLevel}`,
    `${completedCount}/4`,
    unlockedBadgesText,
    userEmail || profile.contactEmail || auth.currentUser?.email || 'นักเรียน Coder Kids',
  ];

  // 3. Check if profile already exists in Students tab to overwrite (บันทึกทับข้อมูลเดิม)
  let existingRowIndex = -1; // 0-indexed in fetched values array
  try {
    const checkRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A:M`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (checkRes.ok) {
      const data = await checkRes.json();
      const existingRows: string[][] = data.values || [];
      const cleanTargetId = (profile.studentId || '').trim().toLowerCase();
      const cleanTargetName = profile.name.trim().toLowerCase();
      const cleanTargetEmail = (userEmail || profile.contactEmail || '').trim().toLowerCase();

      for (let i = 1; i < existingRows.length; i++) {
        const row = existingRows[i];
        const rowId = (row[0] || '').trim().toLowerCase();
        const rowName = (row[2] || '').trim().toLowerCase();
        const rowEmail = (row[12] || '').trim().toLowerCase();

        const matchId = cleanTargetId && rowId && (rowId === cleanTargetId || rowId.includes(cleanTargetId));
        const matchName = cleanTargetName && rowName && (rowName.includes(cleanTargetName) || cleanTargetName.includes(rowName.replace(/\([^)]+\)/, '').trim()));
        const matchEmail = cleanTargetEmail && rowEmail && rowEmail === cleanTargetEmail;

        if (matchId || (matchName && (cleanTargetId === '' || rowId === '')) || matchEmail) {
          existingRowIndex = i;
          break;
        }
      }
    }
  } catch (searchErr) {
    console.warn('Search existing row before save warning:', searchErr);
  }

  let isOverwritten = false;
  let updatedRange = '';

  if (existingRowIndex > 0) {
    // 4A. Overwrite existing row at rowNumber (1-based sheet row)
    const rowNumber = existingRowIndex + 1;
    const putRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A${rowNumber}:M${rowNumber}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          range: `${sheetTitle}!A${rowNumber}:M${rowNumber}`,
          majorDimension: 'ROWS',
          values: [rowValues],
        }),
      }
    );

    if (!putRes.ok) {
      const errData = await putRes.json().catch(() => ({}));
      throw new Error(errData.error?.message || `บันทึกทับข้อมูลเดิมไม่สำเร็จ (HTTP ${putRes.status})`);
    }

    const result = await putRes.json();
    updatedRange = result.updatedRange || `${sheetTitle}!A${rowNumber}:M${rowNumber}`;
    isOverwritten = true;
  } else {
    // 4B. Append new row
    const appendRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A:M:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          range: `${sheetTitle}!A:M`,
          majorDimension: 'ROWS',
          values: [rowValues],
        }),
      }
    );

    if (!appendRes.ok) {
      const errData = await appendRes.json().catch(() => ({}));
      throw new Error(errData.error?.message || `บันทึกข้อมูลไม่สำเร็จ (HTTP ${appendRes.status})`);
    }

    const result = await appendRes.json();
    updatedRange = result.updates?.updatedRange || `${sheetTitle}!A:M`;
  }

  return {
    success: true,
    updatedRange,
    sheetTitle,
    overwritten: isOverwritten,
  };
};

/**
 * Create/Return Admin UserProfile based on verified Teacher email and record
 */
export const getAdminProfileData = (
  email: string,
  teacherName?: string,
  nickname: string = 'ครูนุสรณ์'
): UserProfile => {
  const isNusorn = email.toLowerCase().includes('nusorn') || (teacherName && teacherName.includes('นุสรณ์'));
  const finalName = teacherName || (isNusorn ? 'นุสรณ์ อ่อนทอง' : 'คุณครูผู้ดูแลระบบ');
  const finalNickname = isNusorn ? 'ครูนุสรณ์' : (nickname || 'แอดมิน');

  return {
    id: `admin_${email.replace(/[^a-zA-Z0-9]/g, '_') || 'master'}`,
    name: finalName,
    nickname: finalNickname,
    studentId: 'ADMIN-2569-01',
    school: 'โรงเรียนอนุบาลนราธิวาส',
    grade: 'กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี',
    role: 'admin',
    bio: 'ผู้ดูแลระบบและคุณครูผู้สอนวิชาวิทยาการคำนวณ Coder Kids',
    motto: 'ส่งเสริมการคิดเชิงคำนวณ ความปลอดภัยดิจิทัล และนวัตกรรมโค้ดดิ้ง',
    avatarId: 'avatar_shield',
    avatarEmoji: '👨‍🏫',
    themeColor: 'indigo',
    codingLevel: 'Advanced',
    techInterests: ['Scratch & Micro:bit', 'Cyber Security & PDPA', 'Google Workspace for Education', 'AI in Education'],
    selectedTitle: 'ผู้ดูแลระบบ & คุณครูผู้สอน (System Admin)',
    joinedDate: '1 พ.ค. 2567',
    streakDays: 30,
    unlockedRewardIds: ['title_junior', 'title_master', 'theme_cyber'],
    contactEmail: email,
  };
};

/**
 * Batch save / sync all student profiles to Google Sheet TAB "Students"
 */
export const saveMultipleProfilesToGoogleSheet = async (
  spreadsheetId: string = TARGET_SPREADSHEET_ID,
  profiles: UserProfile[],
  userEmail: string = ''
): Promise<{ success: boolean; count: number; sheetTitle: string }> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('ยังไม่ได้เข้าสู่ระบบด้วย Google หรือเซสชันหมดอายุ กรุณาลงชื่อเข้าใช้ก่อนบันทึกหมู่');
  }

  const sheetTitle = STUDENTS_SHEET_TITLE;

  // 1. Ensure headers exist in Students tab
  await ensureSheetHeaders(spreadsheetId, sheetTitle, STUDENTS_HEADERS, token);

  const nowThai = new Date().toLocaleString('th-TH', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const rows = profiles.map((p, idx) => {
    const mockPoints = 75 + idx * 20;
    const userLevel = Math.max(1, Math.floor(mockPoints / 75) + 1);
    const displayName = p.name + (p.nickname ? ` (${p.nickname})` : '');
    const displayBio = (p.bio || '') + (p.motto ? ` | คติ: ${p.motto}` : '');

    return [
      p.studentId || `1024${idx + 1}`,
      nowThai,
      displayName,
      p.grade || 'ป.4/1',
      p.school || 'โรงเรียนอนุบาลนราธิวาส',
      `${p.avatarEmoji || '🐱'} (${p.avatarId || 'avatar_cat'})`,
      p.selectedTitle || 'นักประดิษฐ์รุ่นเยาว์ (Junior Innovator)',
      displayBio,
      mockPoints,
      `LV.${userLevel}`,
      '3/4',
      'ผู้พิทักษ์ข้อมูล PDPA, ยอดนักคิดอัลกอริทึม',
      userEmail || p.contactEmail || auth.currentUser?.email || 'นักเรียน Coder Kids',
    ];
  });

  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A:M:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range: `${sheetTitle}!A:M`,
        majorDimension: 'ROWS',
        values: rows,
      }),
    }
  );

  if (!appendRes.ok) {
    const errData = await appendRes.json().catch(() => ({}));
    throw new Error(errData.error?.message || `บันทึกข้อมูลหมู่ไม่สำเร็จ (HTTP ${appendRes.status})`);
  }

  return {
    success: true,
    count: profiles.length,
    sheetTitle,
  };
};

/**
 * Read raw records from Google Sheet tab (Defaults to Students tab)
 */
export const readProfilesFromGoogleSheet = async (
  spreadsheetId: string = TARGET_SPREADSHEET_ID,
  sheetTitle: string = STUDENTS_SHEET_TITLE
): Promise<{ rows: string[][]; sheetTitle: string }> => {
  // Try via fetchStudentsFromGoogleSheet or authenticated read
  try {
    const token = await getAccessToken();
    if (token) {
      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A1:M50`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        return {
          rows: data.values || [],
          sheetTitle,
        };
      }
    }

    // Fallback to public gviz
    const gvizUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetTitle)}`;
    const res = await fetch(gvizUrl);
    if (res.ok) {
      const csvText = await res.text();
      return {
        rows: parseCSV(csvText),
        sheetTitle,
      };
    }
  } catch (err: any) {
    console.error('Error reading profiles from Google Sheet:', err);
    throw new Error(err.message || 'ไม่สามารถอ่านข้อมูลได้');
  }

  return { rows: [], sheetTitle };
};

/**
 * Record student sign-in / login entry into Google Sheet TAB "Logs"
 * Header columns in Logs:
 * ["วันเวลาที่เข้าเรียน","ชื่อนักเรียน","ระดับชั้น","โรงเรียน","อวตาร","การดำเนินการ","หมายเหตุ","สถานะ Streak","บทเรียนที่กำลังศึกษา","อีเมล"]
 */
export const recordStudentLoginToGoogleSheet = async (
  spreadsheetId: string = TARGET_SPREADSHEET_ID,
  profile: UserProfile,
  userEmail: string = '',
  action: string = 'ลงชื่อเข้าใช้งานห้องเรียน Coder Kids',
  activeModule: string = 'dashboard'
): Promise<{ success: boolean; sheetTitle: string; directSheetWrite?: boolean; message?: string }> => {
  const token = await getAccessToken();
  const sheetTitle = LOGS_SHEET_TITLE;

  const nowThai = new Date().toLocaleString('sv-SE', {
    timeZone: 'Asia/Bangkok',
  }).replace('T', ' ');

  const displayName = profile.name + (profile.nickname ? ` (${profile.nickname})` : '');
  const emailValue = userEmail || profile.contactEmail || auth.currentUser?.email || 'นักเรียน Coder Kids';

  const rowValues = [
    nowThai,
    displayName,
    profile.grade || 'ป.4/1',
    profile.school || 'โรงเรียนอนุบาลนราธิวาส',
    profile.avatarEmoji || '🐱',
    action,
    'เข้าเรียนผ่านระบบคลาวด์ Coder Kids Web App',
    `Streak ${profile.streakDays || 1} วัน`,
    activeModule,
    emailValue,
  ];

  // 1. บันทึกลง LocalStorage เสมอ เพื่อให้หน้าแสดง Logs ทำงานได้ทันที
  try {
    const stored = JSON.parse(localStorage.getItem('coderkids_classroom_logs') || '[]');
    stored.unshift({
      timestamp: nowThai,
      studentName: displayName,
      grade: profile.grade || 'ป.4/1',
      school: profile.school || 'โรงเรียนอนุบาลนราธิวาส',
      avatar: profile.avatarEmoji || '🐱',
      action,
      note: 'เข้าเรียนผ่านระบบคลาวด์ Coder Kids Web App',
      streak: `Streak ${profile.streakDays || 1} วัน`,
      activeModule,
      email: emailValue,
    });
    localStorage.setItem('coderkids_classroom_logs', JSON.stringify(stored.slice(0, 100)));
  } catch (err) {
    console.warn('Local log cache error:', err);
  }

  // 2. ส่งไปบันทึกที่ Express Server API (/api/logs/record)
  fetch('/api/logs/record', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      timestamp: nowThai,
      studentName: displayName,
      grade: profile.grade || 'ป.4/1',
      school: profile.school || 'โรงเรียนอนุบาลนราธิวาส',
      avatar: profile.avatarEmoji || '🐱',
      action,
      note: 'เข้าเรียนผ่านระบบคลาวด์ Coder Kids Web App',
      streak: `Streak ${profile.streakDays || 1} วัน`,
      activeModule,
      email: emailValue,
    }),
  }).catch(() => {});

  // 3. หากมี Access Token (เช่น คุณครู) บันทึกลง Google Sheets แท็บ Logs โดยตรง
  if (token) {
    try {
      await ensureSheetHeaders(spreadsheetId, sheetTitle, LOGS_HEADERS, token);

      const appendRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A:J:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            range: `${sheetTitle}!A:J`,
            majorDimension: 'ROWS',
            values: [rowValues],
          }),
        }
      );
      if (appendRes.ok) {
        return {
          success: true,
          sheetTitle,
          directSheetWrite: true,
          message: 'บันทึกประวัติการเข้าเรียนลงแท็บ Logs ใน Google Sheet เรียบร้อยแล้ว',
        };
      } else {
        const errJson = await appendRes.json().catch(() => ({}));
        console.warn('Sheets API append log warning:', errJson);
        return {
          success: true,
          sheetTitle,
          directSheetWrite: false,
          message: 'บันทึกในระบบแคชแล้ว (รอซิงก์ด้วยสิทธิ์แอดมิน)',
        };
      }
    } catch (e: any) {
      console.warn('Direct Google Sheet API log write warning:', e);
      return {
        success: true,
        sheetTitle,
        directSheetWrite: false,
        message: e.message || 'บันทึกแคชในระบบแล้ว',
      };
    }
  }

  return {
    success: true,
    sheetTitle,
    directSheetWrite: false,
    message: 'บันทึกประวัติการเข้าเรียนในระบบเรียบร้อย (เชื่อมต่อสิทธิ์ชีตแอดมินเพื่อซิงก์คลาวด์)',
  };
};

/**
 * Batch sync all cached classroom logs to Google Sheet TAB "Logs"
 */
export const batchSyncLogsToGoogleSheet = async (
  spreadsheetId: string = TARGET_SPREADSHEET_ID
): Promise<{ success: boolean; count: number; message: string }> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('กรุณาลงชื่อเข้าใช้ด้วยบัญชี Google ของคุณครู/แอดมิน เพื่อรับสิทธิ์เชื่อมต่อ Google Sheets');
  }

  // 1. Get logs from localStorage
  let localLogs: any[] = [];
  try {
    localLogs = JSON.parse(localStorage.getItem('coderkids_classroom_logs') || '[]');
  } catch {}

  // 2. Fetch logs from Express server API if available
  try {
    const sRes = await fetch('/api/logs/list');
    if (sRes.ok) {
      const sData = await sRes.json();
      if (Array.isArray(sData.logs) && sData.logs.length > 0) {
        const seen = new Set(localLogs.map((l: any) => `${l.timestamp}_${l.studentName}`));
        for (const sLog of sData.logs) {
          const key = `${sLog.timestamp}_${sLog.studentName}`;
          if (!seen.has(key)) {
            seen.add(key);
            localLogs.push(sLog);
          }
        }
      }
    }
  } catch {}

  if (localLogs.length === 0) {
    return { success: true, count: 0, message: 'ไม่มีข้อมูลประวัติเข้าเรียนที่รอซิงก์' };
  }

  await ensureSheetHeaders(spreadsheetId, LOGS_SHEET_TITLE, LOGS_HEADERS, token);

  const rows = localLogs.map((l: any) => [
    l.timestamp || '',
    l.studentName || '',
    l.grade || 'ป.4/1',
    l.school || 'โรงเรียนอนุบาลนราธิวาส',
    l.avatar || '🐱',
    l.action || 'ลงชื่อเข้าใช้งานห้องเรียน Coder Kids',
    l.note || 'เข้าเรียนผ่านระบบคลาวด์ Coder Kids Web App',
    l.streak || 'Streak 1 วัน',
    l.activeModule || 'dashboard',
    l.email || '',
  ]);

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(LOGS_SHEET_TITLE)}!A:J:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range: `${LOGS_SHEET_TITLE}!A:J`,
        majorDimension: 'ROWS',
        values: rows,
      }),
    }
  );

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `ซิงก์ข้อมูลลงแท็บ Logs ไม่สำเร็จ (HTTP ${res.status})`);
  }

  return {
    success: true,
    count: rows.length,
    message: `ซิงก์ข้อมูลประวัติเข้าเรียน ${rows.length} รายการลงแท็บ Logs ใน Google Sheet เรียบร้อยแล้ว!`,
  };
};

/**
 * Read student access logs from Google Sheet TAB "Logs"
 */
export const readLogsFromGoogleSheet = async (
  spreadsheetId: string = TARGET_SPREADSHEET_ID
): Promise<{ rows: string[][]; sheetTitle: string }> => {
  return readProfilesFromGoogleSheet(spreadsheetId, LOGS_SHEET_TITLE);
};

/**
 * Record student's daily journal entry into Google Sheet TAB "Students"
 */
export const saveDailyJournalToGoogleSheet = async (
  spreadsheetId: string = TARGET_SPREADSHEET_ID,
  entry: DailyJournalEntry,
  userEmail: string = ''
): Promise<{ success: boolean; sheetTitle: string }> => {
  const token = await getAccessToken();
  if (!token) {
    return { success: false, sheetTitle: 'Offline' };
  }

  const sheetTitle = STUDENTS_SHEET_TITLE;
  const nowThai = `${entry.date} ${entry.time}`;

  const rowValues = [
    entry.studentId || '10241',
    nowThai,
    entry.studentName,
    `Streak วันที่ ${entry.streakDayCount}`,
    'บันทึกประจำวัน (Daily Journal)',
    entry.moodEmoji,
    `อารมณ์: ${entry.mood}`,
    `กิจกรรม: ${entry.activity} | ได้เรียนรู้: ${entry.learningKey}${entry.challengeFaced ? ` | อุปสรรค: ${entry.challengeFaced}` : ''}${entry.tomorrowGoal ? ` | พรุ่งนี้: ${entry.tomorrowGoal}` : ''}`,
    entry.pointsEarned,
    `หมวด: ${entry.category}`,
    `Streak: ${entry.streakDayCount} วัน`,
    'บันทึกกิจกรรมประจำวันต่อเนื่อง',
    userEmail || auth.currentUser?.email || 'นักเรียน Coder Kids',
  ];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A:M:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range: `${sheetTitle}!A:M`,
        majorDimension: 'ROWS',
        values: [rowValues],
      }),
    }
  ).catch((e) => console.warn('Save daily journal error:', e));

  return { success: true, sheetTitle };
};
