import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, AchievementBadge, DailyJournalEntry } from '../types/index.ts';

export const TARGET_SPREADSHEET_ID = '1tWcZ4OaGZKOcX1PEvVNadyf9mM_igaKcF3ZV_b3L7Ng';

// Initialize Firebase App once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/spreadsheets');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('ไม่สามารถดึง Access Token จาก Google Sign-In ได้');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const googleLogout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

// Helper to get the first sheet's title dynamically (avoid hardcoding "Sheet1")
export const getFirstSheetTitle = async (
  spreadsheetId: string,
  accessToken: string
): Promise<string> => {
  try {
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    if (data.sheets && data.sheets.length > 0 && data.sheets[0].properties?.title) {
      return data.sheets[0].properties.title;
    }
    return 'Sheet1';
  } catch (e) {
    console.warn('Could not fetch sheet title, falling back to Sheet1', e);
    return 'Sheet1';
  }
};

// Sync and Append/Update Student Profile to Google Sheet
export const saveProfileToGoogleSheet = async (
  spreadsheetId: string,
  profile: UserProfile,
  points: number,
  completedCount: number,
  badges: AchievementBadge[],
  userEmail: string = ''
): Promise<{ success: boolean; updatedRange?: string; sheetTitle?: string }> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('ยังไม่ได้เข้าสู่ระบบด้วย Google หรือเซสชันหมดอายุ กรุณาลงชื่อเข้าใช้ก่อน');
  }

  const sheetTitle = await getFirstSheetTitle(spreadsheetId, token);

  // 1. Check if headers exist
  const headerCheckRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A1:L1`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const headerData = await headerCheckRes.json().catch(() => ({}));
  const hasHeaders = headerData.values && headerData.values.length > 0 && headerData.values[0].length >= 5;

  if (!hasHeaders) {
    // Add header row
    const headers = [
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

    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A1:L1?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          range: `${sheetTitle}!A1:L1`,
          majorDimension: 'ROWS',
          values: [headers],
        }),
      }
    );
  }

  // 2. Prepare student profile row data
  const userLevel = Math.max(1, Math.floor(points / 75) + 1);
  const unlockedBadgesText = badges
    .filter((b) => b.unlocked)
    .map((b) => b.title.split('(')[0].trim())
    .join(', ') || 'เริ่มต้นการเรียนรู้';

  const nowThai = new Date().toLocaleString('th-TH', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const displayName = profile.name +
    (profile.nickname ? ` (${profile.nickname})` : '') +
    (profile.studentId ? ` [${profile.studentId}]` : '');

  const displayBio = (profile.bio || '') +
    (profile.motto ? ` | คำคม: "${profile.motto}"` : '') +
    (profile.codingLevel ? ` | ระดับ: ${profile.codingLevel}` : '');

  const rowValues = [
    nowThai,
    displayName,
    profile.grade,
    profile.school,
    `${profile.avatarEmoji} (${profile.avatarId})`,
    profile.selectedTitle,
    displayBio,
    points,
    `LV.${userLevel}`,
    `${completedCount}/4`,
    unlockedBadgesText,
    userEmail || profile.contactEmail || auth.currentUser?.email || 'นักเรียน Coder Kids',
  ];

  // 3. Append row
  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A:L:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range: `${sheetTitle}!A:L`,
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
  return {
    success: true,
    updatedRange: result.updates?.updatedRange,
    sheetTitle,
  };
};

// Read records from the sheet to display inside the management view
export const readProfilesFromGoogleSheet = async (
  spreadsheetId: string
): Promise<{ rows: string[][]; sheetTitle: string }> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('กรุณาลงชื่อเข้าใช้ Google เพื่ออ่านข้อมูลจาก Google Sheets');
  }

  const sheetTitle = await getFirstSheetTitle(spreadsheetId, token);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A1:L50`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `ไม่สามารถอ่านข้อมูลได้ (HTTP ${res.status})`);
  }

  const data = await res.json();
  return {
    rows: data.values || [],
    sheetTitle,
  };
};

// Batch save / sync all student profiles to Google Sheet
export const saveMultipleProfilesToGoogleSheet = async (
  spreadsheetId: string,
  profiles: UserProfile[],
  userEmail: string = ''
): Promise<{ success: boolean; count: number; sheetTitle: string }> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('ยังไม่ได้เข้าสู่ระบบด้วย Google หรือเซสชันหมดอายุ กรุณาลงชื่อเข้าใช้ก่อน');
  }

  const sheetTitle = await getFirstSheetTitle(spreadsheetId, token);

  // 1. Ensure headers exist
  const headerCheckRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A1:L1`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const headerData = await headerCheckRes.json().catch(() => ({}));
  const hasHeaders = headerData.values && headerData.values.length > 0 && headerData.values[0].length >= 5;

  if (!hasHeaders) {
    const headers = [
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

    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A1:L1?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          range: `${sheetTitle}!A1:L1`,
          majorDimension: 'ROWS',
          values: [headers],
        }),
      }
    );
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

  const rows = profiles.map((p, idx) => {
    const mockPoints = 60 + idx * 25;
    const userLevel = Math.max(1, Math.floor(mockPoints / 75) + 1);
    const displayName = p.name +
      (p.nickname ? ` (${p.nickname})` : '') +
      (p.studentId ? ` [${p.studentId}]` : '');
    const displayBio = (p.bio || '') +
      (p.motto ? ` | คำคม: "${p.motto}"` : '') +
      (p.codingLevel ? ` | ระดับ: ${p.codingLevel}` : '');

    return [
      nowThai,
      displayName,
      p.grade,
      p.school,
      `${p.avatarEmoji} (${p.avatarId})`,
      p.selectedTitle,
      displayBio,
      mockPoints,
      `LV.${userLevel}`,
      '3/4',
      'เยาวชนโค้ดเดอร์, นักผจญภัย Scratch',
      userEmail || p.contactEmail || auth.currentUser?.email || 'นักเรียน Coder Kids',
    ];
  });

  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A:L:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range: `${sheetTitle}!A:L`,
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

// Record student sign-in / login entry into Google Sheet ID: 1tWcZ4OaGZKOcX1PEvVNadyf9mM_igaKcF3ZV_b3L7Ng
export const recordStudentLoginToGoogleSheet = async (
  spreadsheetId: string,
  profile: UserProfile,
  userEmail: string = ''
): Promise<{ success: boolean; sheetTitle: string }> => {
  const token = await getAccessToken();
  if (!token) {
    // If not authenticated via Google token, we don't throw blocking error but log info
    return { success: false, sheetTitle: 'Offline' };
  }

  const sheetTitle = await getFirstSheetTitle(spreadsheetId, token);
  const nowThai = new Date().toLocaleString('th-TH', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const displayName = profile.name +
    (profile.nickname ? ` (${profile.nickname})` : '') +
    (profile.studentId ? ` [${profile.studentId}]` : '');

  const rowValues = [
    nowThai,
    displayName,
    profile.grade,
    profile.school,
    `${profile.avatarEmoji} (${profile.avatarId})`,
    'ลงชื่อเข้าใช้งานก่อนเข้าบทเรียน',
    `สมาชิกลงชื่อเข้าสู่ระบบพร้อมเข้าเรียนโค้ดดิ้ง`,
    profile.streakDays ? `Streak ${profile.streakDays} วัน` : 'เริ่มเรียน',
    'เข้าสู่ระบบ',
    '-',
    '-',
    userEmail || profile.contactEmail || auth.currentUser?.email || 'นักเรียน Coder Kids',
  ];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A:L:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range: `${sheetTitle}!A:L`,
        majorDimension: 'ROWS',
        values: [rowValues],
      }),
    }
  );

  return { success: true, sheetTitle };
};

// Record student's daily journal entry into Google Sheet
export const saveDailyJournalToGoogleSheet = async (
  spreadsheetId: string,
  entry: DailyJournalEntry,
  userEmail: string = ''
): Promise<{ success: boolean; sheetTitle: string }> => {
  const token = await getAccessToken();
  if (!token) {
    return { success: false, sheetTitle: 'Offline' };
  }

  const sheetTitle = await getFirstSheetTitle(spreadsheetId, token);
  const nowThai = `${entry.date} ${entry.time}`;

  const rowValues = [
    nowThai,
    `${entry.studentName} [${entry.studentId}]`,
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
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A:L:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range: `${sheetTitle}!A:L`,
        majorDimension: 'ROWS',
        values: [rowValues],
      }),
    }
  );

  return { success: true, sheetTitle };
};
