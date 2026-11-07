import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, AchievementBadge, TeacherRecord } from '../types/index.ts';
import {
  AVATAR_OPTIONS,
  PROFILE_THEMES,
  TECH_INTERESTS_AVAILABLE,
  DEFAULT_PROFILE,
} from '../data/learningData.ts';
import {
  TARGET_SPREADSHEET_ID,
  STUDENTS_SHEET_TITLE,
  TEACHERS_SHEET_TITLE,
  LOGS_SHEET_TITLE,
  auth,
  initAuth,
  googleSignIn,
  googleLogout,
  getAccessToken,
  saveProfileToGoogleSheet,
  saveMultipleProfilesToGoogleSheet,
  readProfilesFromGoogleSheet,
  fetchTeachersFromGoogleSheet,
  fetchStudentsFromGoogleSheet,
  checkIsTeacherAdmin,
  addTeacherToGoogleSheet,
  recordStudentLoginToGoogleSheet,
  readLogsFromGoogleSheet,
  connectTeacherSheetsScope,
  batchSyncLogsToGoogleSheet,
} from '../services/googleSheetsService.ts';
import { CategorizedAvatarSelector, AvatarSelectionPayload } from './CategorizedAvatarSelector.tsx';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Save,
  LogIn,
  LogOut,
  UploadCloud,
  User,
  Users,
  UserPlus,
  Trash2,
  Edit3,
  ShieldCheck,
  Shield,
  Award,
  Flame,
  Printer,
  Copy,
  Check,
  Download,
  Upload,
  BookOpen,
  Code,
  Tag,
  Star,
  IdCard,
  Search,
  Filter,
  CheckSquare,
  ChevronRight,
  Info,
  Lock,
  Shuffle,
  Code2,
  GraduationCap,
  KeyRound,
  Database,
  ArrowDownToLine,
  UserCheck,
  History,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProfileManagementViewProps {
  profile: UserProfile;
  profiles?: UserProfile[];
  isLoggedIn?: boolean;
  onOpenLogin?: () => void;
  onUpdateProfile: (updated: UserProfile) => void;
  onAddProfile?: (newProfile: UserProfile, makeActive?: boolean) => void;
  onDeleteProfile?: (profileId: string) => void;
  onSelectProfile?: (profileId: string) => void;
  points: number;
  completedModulesCount: number;
  badges: AchievementBadge[];
  isAdmin?: boolean;
  onToggleAdmin?: (isAdmin: boolean) => void;
  teachersList?: TeacherRecord[];
  onRefreshTeachers?: () => Promise<TeacherRecord[]>;
  onSyncStudentsFromSheet?: (students: UserProfile[]) => void;
  onOpenGasExport?: () => void;
}

// Preset student templates for rapid creation (Teacher/Admin use)
const PRESET_STUDENT_TEMPLATES = [
  {
    label: 'ด.ช. ภัทรพล (สายเกม Scratch & Micro:bit)',
    name: 'ด.ช. ภัทรพล เจริญศิลป์',
    nickname: 'ภัทร',
    studentId: '10241',
    grade: 'ป.5/1',
    school: 'โรงเรียนสาธิตนวัตกรรมคอมพิวเตอร์',
    avatarId: 'avatar_cat',
    avatarEmoji: '🐱',
    themeColor: 'indigo',
    bio: 'ชอบสร้างเกม Scratch และต่อวงจร Micro:bit เซ็นเซอร์วัดสภาพแวดล้อม',
    motto: 'โค้ดคือเวทมนตร์ จินตนาการคือพลัง!',
    codingLevel: 'Advanced' as const,
    techInterests: ['Scratch Game', 'Micro:bit IoT', 'Algorithm & Logic'],
    selectedTitle: 'เซียนโค้ดดิ้งรุ่นจิ๋ว',
  },
  {
    label: 'ด.ญ. กานดา (สายความปลอดภัยไซเบอร์ & PDPA)',
    name: 'ด.ญ. กานดา วงศ์สุวรรณ',
    nickname: 'ดา',
    studentId: '10242',
    grade: 'ป.5/1',
    school: 'โรงเรียนอนุบาลนราธิวาส',
    avatarId: 'avatar_fox',
    avatarEmoji: '🦊',
    themeColor: 'amber',
    bio: 'ศึกษาเรื่องความปลอดภัยข้อมูล รหัสผ่านสองชั้น และการคุ้มครองข้อมูลส่วนบุคคล',
    motto: 'ข้อมูลส่วนตัว มีค่าดั่งทองคำ ปกป้องให้ปลอดภัย',
    codingLevel: 'Intermediate' as const,
    techInterests: ['Cyber Security', 'Digital Safety', 'Digital Citizenship'],
    selectedTitle: 'ผู้พิทักษ์ข้อมูล PDPA',
  },
  {
    label: 'ด.ช. ธีรภัทร (สายตรรกะ & อัลกอริทึม)',
    name: 'ด.ช. ธีรภัทร ศรีสุข',
    nickname: 'ธีร์',
    studentId: '10243',
    grade: 'ป.5/2',
    school: 'โรงเรียนอนุบาลนราธิวาส',
    avatarId: 'avatar_panda',
    avatarEmoji: '🐼',
    themeColor: 'emerald',
    bio: 'ชอบวิเคราะห์ลำดับขั้นตอน การทำซ้ำ และการคิดเชิงคำนวณแก้ปัญหา',
    motto: 'คิดทีละสเต็ป แก้ง่ายทุกปัญหา',
    codingLevel: 'Intermediate' as const,
    techInterests: ['Algorithm & Logic', 'Data Science', 'Scratch Game'],
    selectedTitle: 'ยอดนักคิดอัลกอริทึม',
  },
];

export const ProfileManagementView: React.FC<ProfileManagementViewProps> = ({
  profile,
  profiles = [profile],
  isLoggedIn = false,
  onOpenLogin,
  onUpdateProfile,
  onAddProfile,
  onDeleteProfile,
  onSelectProfile,
  points,
  completedModulesCount,
  badges,
  isAdmin = false,
  onToggleAdmin,
  teachersList = [],
  onRefreshTeachers,
  onSyncStudentsFromSheet,
  onOpenGasExport,
}) => {
  // Navigation tabs:
  // 1. directory: ข้อมูลผู้เรียน (แท็บ Students)
  // 2. teachers: สิทธิ์แอดมิน (แท็บ Teachers)
  // 3. identity: แก้ไขข้อมูล & อวตาร
  // 4. card: บัตรนักเรียนดิจิทัล
  // 5. analytics: สถิติ & เหรียญตรา
  // 6. sync: ตารางข้อมูลชีต (Students, Teachers, Logs)
  const [activeSubTab, setActiveSubTab] = useState<
    'directory' | 'teachers' | 'identity' | 'card' | 'analytics' | 'sync'
  >('directory');

  // Currently editing profile ID (default to active profile)
  const [editingProfileId, setEditingProfileId] = useState<string>(profile.id || 'prof_1');

  // Form states for profile editing
  const [name, setName] = useState(profile.name || '');
  const [nickname, setNickname] = useState(profile.nickname || '');
  const [studentId, setStudentId] = useState(profile.studentId || '10241');
  const [school, setSchool] = useState(profile.school || 'โรงเรียนอนุบาลนราธิวาส');
  const [grade, setGrade] = useState(profile.grade || 'ป.4/1');
  const [bio, setBio] = useState(profile.bio || '');
  const [motto, setMotto] = useState(profile.motto || '');
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>(profile.role || 'student');
  const [contactEmail, setContactEmail] = useState(profile.contactEmail || '');
  const [githubOrScratch, setGithubOrScratch] = useState(profile.githubOrScratch || '');
  const [codingLevel, setCodingLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(
    profile.codingLevel || 'Intermediate'
  );
  const [selectedAvatarId, setSelectedAvatarId] = useState(profile.avatarId || 'avatar_cat');
  const [selectedAvatarEmoji, setSelectedAvatarEmoji] = useState(profile.avatarEmoji || '🐱');
  const [selectedTitle, setSelectedTitle] = useState(
    profile.selectedTitle || 'นักประดิษฐ์รุ่นเยาว์ (Junior Innovator)'
  );
  const [themeColor, setThemeColor] = useState(profile.themeColor || 'indigo');
  const [techInterests, setTechInterests] = useState<string[]>(
    profile.techInterests || ['Scratch Game', 'Micro:bit IoT']
  );

  // Add Profile Modal State (Teachers / Admin only)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [newStudentId, setNewStudentId] = useState(`1024${Math.floor(4 + Math.random() * 50)}`);
  const [newSchool, setNewSchool] = useState('โรงเรียนอนุบาลนราธิวาส');
  const [newGrade, setNewGrade] = useState('ป.4/1');
  const [newRole, setNewRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [newBio, setNewBio] = useState('พร้อมเรียนรู้และสนุกกับการเขียนโปรแกรมคอมพิวเตอร์!');
  const [newMotto, setNewMotto] = useState('เขียนโค้ดวันละนิด เก่งขึ้นทุกวัน');
  const [newAvatarId, setNewAvatarId] = useState('avatar_cat');
  const [newAvatarEmoji, setNewAvatarEmoji] = useState('🐱');
  const [newThemeColor, setNewThemeColor] = useState('indigo');
  const [newCodingLevel, setNewCodingLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [newSelectedTitle, setNewSelectedTitle] = useState('นักประดิษฐ์รุ่นเยาว์ (Junior Innovator)');
  const [newTechInterests, setNewTechInterests] = useState<string[]>(['Scratch Game', 'Micro:bit IoT']);
  const [makeNewActiveImmediately, setMakeNewActiveImmediately] = useState(true);

  // Delete Profile Modal State
  const [profileToDelete, setProfileToDelete] = useState<UserProfile | null>(null);

  // Search & Filter in Directory
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<'ALL' | 'Beginner' | 'Intermediate' | 'Advanced'>('ALL');

  // Google Auth & Sync states
  const [currentUser, setCurrentUser] = useState<any>(auth.currentUser);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isBatchSyncing, setIsBatchSyncing] = useState(false);
  const [isFetchingFromSheet, setIsFetchingFromSheet] = useState(false);
  const [isRefreshingTeachers, setIsRefreshingTeachers] = useState(false);
  const [isLoggingAccess, setIsLoggingAccess] = useState(false);
  const [isSyncingAllLogs, setIsSyncingAllLogs] = useState(false);
  const [isConnectingSheets, setIsConnectingSheets] = useState(false);

  // Local Teachers State
  const [teachers, setTeachers] = useState<TeacherRecord[]>(teachersList);
  const [adminCheckEmail, setAdminCheckEmail] = useState('');
  const [adminCheckResult, setAdminCheckResult] = useState<{
    tested: boolean;
    isAdmin: boolean;
    message: string;
  } | null>(null);

  // Add Teacher Form State
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);

  // Status message
  const [statusMsg, setStatusMsg] = useState<{
    text: string;
    type: 'success' | 'error' | 'info' | 'warning';
  } | null>(null);

  // Google Sheets Inspection Table (Students, Teachers, Logs)
  const [activeSheetInspectionTab, setActiveSheetInspectionTab] = useState<'Students' | 'Teachers' | 'Logs'>('Students');
  const [sheetStudentsRows, setSheetStudentsRows] = useState<string[][]>([]);
  const [sheetTeachersRows, setSheetTeachersRows] = useState<string[][]>([]);
  const [sheetLogsRows, setSheetLogsRows] = useState<string[][]>([]);
  const [isLoadingSheetData, setIsLoadingSheetData] = useState(false);

  // Confirmation modal state for single profile sync
  const [copiedId, setCopiedId] = useState(false);

  // Hidden file input for import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine if effective Admin: STRICTLY requires user to be logged in AND verified as admin/teacher
  const currentEmailForCheck = (isLoggedIn && currentUser?.email)
    ? currentUser.email
    : (isLoggedIn ? profile.contactEmail || '' : '');
  const currentTeacherAdminMatch = checkIsTeacherAdmin(currentEmailForCheck, teachers);
  const isEffectiveAdmin = Boolean(
    isLoggedIn &&
    (isAdmin || currentTeacherAdminMatch.isAdmin) &&
    profile.role !== 'student'
  );

  // Auto-reset tab if member is on admin-only tab
  useEffect(() => {
    if (!isEffectiveAdmin && (activeSubTab === 'teachers' || activeSubTab === 'sync')) {
      setActiveSubTab('directory');
    }
  }, [isEffectiveAdmin, activeSubTab]);

  // Track Auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setCurrentUser(user);
        if (user.email && !adminCheckEmail) {
          setAdminCheckEmail(user.email);
        }
      },
      () => {
        setCurrentUser(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Sync teachersList prop
  useEffect(() => {
    if (teachersList && teachersList.length > 0) {
      setTeachers(teachersList);
    }
  }, [teachersList]);

  // Initial fetch of teachers if empty
  useEffect(() => {
    if (teachers.length === 0) {
      fetchTeachersFromGoogleSheet(TARGET_SPREADSHEET_ID).then((res) => {
        setTeachers(res);
      });
    }
  }, []);

  // When editingProfileId changes, load that profile's values into the edit form
  useEffect(() => {
    // สมาชิกไม่สามารถแก้ไขข้อมูลสมาชิกคนอื่นได้ -> บังคับให้โหลดเฉพาะโปรไฟล์ตนเองหากไม่ใช่แอดมิน
    const target = isEffectiveAdmin
      ? (profiles.find((p) => p.id === editingProfileId) || profile)
      : profile;
    if (target) {
      setName(target.name || '');
      setNickname(target.nickname || '');
      setStudentId(target.studentId || '10241');
      setSchool(target.school || 'โรงเรียนอนุบาลนราธิวาส');
      setGrade(target.grade || 'ป.4/1');
      setBio(target.bio || '');
      setMotto(target.motto || '');
      setRole(target.role || 'student');
      setContactEmail(target.contactEmail || '');
      setGithubOrScratch(target.githubOrScratch || '');
      setCodingLevel(target.codingLevel || 'Intermediate');
      setSelectedAvatarId(target.avatarId || 'avatar_cat');
      setSelectedAvatarEmoji(target.avatarEmoji || '🐱');
      setSelectedTitle(target.selectedTitle || 'นักประดิษฐ์รุ่นเยาว์ (Junior Innovator)');
      setThemeColor(target.themeColor || 'indigo');
      setTechInterests(target.techInterests || ['Scratch Game', 'Micro:bit IoT']);
    }
  }, [editingProfileId, profiles, profile, isEffectiveAdmin]);

  const currentAvatar = AVATAR_OPTIONS.find((a) => a.id === selectedAvatarId) || AVATAR_OPTIONS[0];
  const currentTheme = PROFILE_THEMES.find((t) => t.id === themeColor) || PROFILE_THEMES[0];

  // Level calculation: 75 points per level
  const userLevel = Math.max(1, Math.floor(points / 75) + 1);
  const currentLevelMin = (userLevel - 1) * 75;
  const nextLevelMin = userLevel * 75;

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setStatusMsg(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        const userEmail = res.user.email || '';
        setStatusMsg({
          text: `เข้าสู่ระบบด้วย Google สำเร็จ: ${res.user.displayName || userEmail}`,
          type: 'success',
        });

        // Auto check if this email is an Admin in Teachers tab
        const check = checkIsTeacherAdmin(userEmail, teachers);
        if (check.isAdmin && onToggleAdmin) {
          onToggleAdmin(true);
          setStatusMsg({
            text: `ยืนยันสิทธิ์แอดมินสำเร็จจากแท็บ Teachers! บัญชี: ${userEmail}`,
            type: 'success',
          });
        }

        // Record student login entry to tab "Logs"
        await recordStudentLoginToGoogleSheet(
          TARGET_SPREADSHEET_ID,
          profile,
          userEmail,
          'ลงชื่อเข้าใช้งานห้องเรียน Coder Kids',
          'profileManage'
        );

        loadSheetInspectionData();
      }
    } catch (err: any) {
      console.error(err);
      setStatusMsg({
        text: err.message || 'การเข้าสู่ระบบขัดข้อง กรุณาลองใหม่อีกครั้ง',
        type: 'error',
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    await googleLogout();
    setCurrentUser(null);
    setStatusMsg({ text: 'ออกจากระบบ Google เรียบร้อยแล้ว', type: 'info' });
  };

  // Build updated profile object (Enforce student cannot set role to admin)
  const getUpdatedProfileObj = (): UserProfile => {
    const existing = isEffectiveAdmin
      ? (profiles.find((p) => p.id === editingProfileId) || profile)
      : profile;
    const finalRole = isEffectiveAdmin ? role : 'student';

    return {
      ...existing,
      id: isEffectiveAdmin ? (editingProfileId || existing.id || `prof_${Date.now()}`) : profile.id,
      name: name.trim() || existing.name,
      nickname: nickname.trim(),
      studentId: studentId.trim() || existing.studentId || '10241',
      school: school.trim() || 'โรงเรียนอนุบาลนราธิวาส',
      grade: grade.trim() || 'ป.4/1',
      role: finalRole,
      bio: bio.trim() || existing.bio,
      motto: motto.trim(),
      contactEmail: contactEmail.trim(),
      githubOrScratch: githubOrScratch.trim(),
      codingLevel,
      techInterests,
      themeColor,
      avatarId: selectedAvatarId,
      avatarEmoji: selectedAvatarEmoji,
      selectedTitle,
    };
  };

  // 1. SAVE PROFILE (EDIT) - บันทึกลงกูเกิลชีตอัตโนมัติ และบันทึกทับข้อมูลเดิม
  const handleSaveLocal = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updated = getUpdatedProfileObj();

    // กฎความปลอดภัย: สมาชิกไม่สามารถแก้ไขข้อมูลสมาชิกคนอื่นได้
    if (!isEffectiveAdmin && updated.id !== profile.id && updated.studentId !== profile.studentId) {
      setStatusMsg({
        text: 'ปฏิเสธการดำเนินการ: สมาชิกไม่สามารถแก้ไขข้อมูลของสมาชิกคนอื่นได้',
        type: 'error',
      });
      return;
    }

    onUpdateProfile(updated);
    setIsSyncing(true);
    setStatusMsg({
      text: `กำลังบันทึกและอัปเดตทับข้อมูลเดิมของ "${updated.name}" ใน Google Sheet (แท็บ Students)...`,
      type: 'info',
    });

    try {
      // บันทึกลงกูเกิลชีตอัตโนมัติ และบันทึกทับข้อมูลเดิม
      const res = await saveProfileToGoogleSheet(
        TARGET_SPREADSHEET_ID,
        updated,
        points,
        completedModulesCount,
        badges,
        updated.contactEmail || currentUser?.email || ''
      );

      // บันทึกกิจกรรมลงในแท็บ Logs
      await recordStudentLoginToGoogleSheet(
        TARGET_SPREADSHEET_ID,
        updated,
        updated.contactEmail || currentUser?.email || '',
        res.overwritten ? 'แก้ไขข้อมูลผู้เรียน (บันทึกทับข้อมูลเดิมอัตโนมัติ)' : 'บันทึกข้อมูลผู้เรียนลงชีต',
        'profileManage'
      );

      setStatusMsg({
        text: res.overwritten
          ? `บันทึกและอัปเดตทับข้อมูลเดิมของ "${updated.name}" ในแท็บ Students บน Google Sheet สำเร็จเรียบร้อย! 💾`
          : `บันทึกข้อมูล "${updated.name}" ลงในแท็บ Students บน Google Sheet สำเร็จ! 💾`,
        type: 'success',
      });
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
      loadSheetInspectionData();
    } catch (saveErr: any) {
      console.warn('Google Sheet auto-save on edit error:', saveErr);
      setStatusMsg({
        text: `บันทึกข้อมูลในระบบเรียบร้อย (${saveErr.message || 'รอเชื่อมต่อ Google Sheet'})`,
        type: 'warning',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // 2. ADD NEW PROFILE (Admins only) - บันทึกลงในกูเกิลชีตอัตโนมัติ
  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEffectiveAdmin) {
      setStatusMsg({
        text: 'ปฏิเสธการดำเนินการ: สมาชิกไม่สามารถเพิ่มหรือจัดการข้อมูลสมาชิกคนอื่นๆ ได้',
        type: 'error',
      });
      return;
    }

    if (!newName.trim()) {
      setStatusMsg({ text: 'กรุณากรอกชื่อ-นามสกุลของผู้เรียน', type: 'error' });
      return;
    }

    const newId = `prof_${Date.now()}`;
    const newStudentProfile: UserProfile = {
      id: newId,
      name: newName.trim(),
      nickname: newNickname.trim(),
      studentId: newStudentId.trim() || `1024${Math.floor(10 + Math.random() * 80)}`,
      school: newSchool.trim() || 'โรงเรียนอนุบาลนราธิวาส',
      grade: newGrade.trim() || 'ป.4/1',
      role: 'student',
      bio: newBio.trim(),
      motto: newMotto.trim(),
      avatarId: newAvatarId,
      avatarEmoji: newAvatarEmoji,
      themeColor: newThemeColor,
      codingLevel: newCodingLevel,
      techInterests: newTechInterests,
      selectedTitle: newSelectedTitle,
      joinedDate: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }),
      streakDays: 1,
      unlockedRewardIds: ['title_junior'],
      enrolledClassroomCode: 'COD-2026',
    };

    if (onAddProfile) {
      onAddProfile(newStudentProfile, makeNewActiveImmediately);
    } else {
      onUpdateProfile(newStudentProfile);
    }

    if (makeNewActiveImmediately) {
      setEditingProfileId(newId);
    }

    setIsAddModalOpen(false);
    setIsSyncing(true);
    setStatusMsg({
      text: `กำลังเพิ่มและบันทึกผู้เรียน "${newStudentProfile.name}" ลงใน Google Sheet อัตโนมัติ...`,
      type: 'info',
    });

    try {
      // บันทึกการเพิ่มสมาชิกลงในกูเกิลชีตอัตโนมัติ และบันทึกทับข้อมูลเดิมหากรหัสซ้ำ
      const res = await saveProfileToGoogleSheet(
        TARGET_SPREADSHEET_ID,
        newStudentProfile,
        50,
        1,
        ['title_junior'],
        newStudentProfile.contactEmail || ''
      );

      await recordStudentLoginToGoogleSheet(
        TARGET_SPREADSHEET_ID,
        newStudentProfile,
        currentUser?.email || '',
        'เพิ่มผู้เรียนใหม่ลงในระบบ (บันทึกลงชีตอัตโนมัติ)',
        'profileManage'
      );

      setStatusMsg({
        text: `เพิ่มผู้เรียน "${newStudentProfile.name}" และบันทึกลงในแท็บ Students บน Google Sheet เรียบร้อยแล้ว!`,
        type: 'success',
      });
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
      loadSheetInspectionData();
    } catch (sheetErr: any) {
      console.warn('Google Sheet auto-save on add error:', sheetErr);
      setStatusMsg({
        text: `เพิ่มโปรไฟล์ผู้เรียน "${newStudentProfile.name}" สำเร็จเรียบร้อย (${sheetErr.message || 'รอเชื่อมต่อ Google Sheet'})`,
        type: 'warning',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // 3. DELETE PROFILE (Admins only)
  const handleConfirmDelete = () => {
    if (!isEffectiveAdmin) {
      setStatusMsg({
        text: 'ปฏิเสธการดำเนินการ: ผู้เรียนไม่สามารถลบหรือจัดการข้อมูลผู้เรียนคนอื่นได้',
        type: 'error',
      });
      setProfileToDelete(null);
      return;
    }

    if (!profileToDelete) return;

    if (profiles.length <= 1) {
      setStatusMsg({
        text: 'ไม่สามารถลบได้: ระบบต้องมีโปรไฟล์อย่างน้อย 1 รายการเพื่อใช้งาน',
        type: 'error',
      });
      setProfileToDelete(null);
      return;
    }

    const deletedName = profileToDelete.name;
    const targetId = profileToDelete.id;

    if (onDeleteProfile) {
      onDeleteProfile(targetId);
    }

    const remaining = profiles.filter((p) => p.id !== targetId);
    if (remaining.length > 0) {
      setEditingProfileId(remaining[0].id);
    }

    setProfileToDelete(null);
    setStatusMsg({
      text: `ลบโปรไฟล์ "${deletedName}" เรียบร้อยแล้ว`,
      type: 'info',
    });
  };

  // 4. SWITCH PROFILE (Admins only)
  const handleSwitchProfile = (p: UserProfile) => {
    if (!isEffectiveAdmin && p.id !== profile.id) {
      setStatusMsg({
        text: 'ปฏิเสธการสลับโปรไฟล์: ผู้เรียนสามารถใช้งานได้เฉพาะโปรไฟล์ของตนเองเท่านั้น',
        type: 'error',
      });
      return;
    }

    if (onSelectProfile) {
      onSelectProfile(p.id);
    } else {
      onUpdateProfile(p);
    }
    setEditingProfileId(p.id);
    setStatusMsg({
      text: `สลับมาใช้งานโปรไฟล์ "${p.name}" สำเร็จ!`,
      type: 'success',
    });
    confetti({ particleCount: 30, spread: 45, origin: { y: 0.7 } });
  };

  // 5. FETCH STUDENTS DIRECTLY FROM TAB "Students" (Admins only)
  const handleFetchStudentsFromSheet = async () => {
    if (!isEffectiveAdmin) {
      setStatusMsg({
        text: 'สงวนสิทธิ์: เฉพาะคุณครูและแอดมินเท่านั้นที่สามารถดึงข้อมูลนักเรียนทั้งหมดจากชีตได้',
        type: 'error',
      });
      return;
    }

    setIsFetchingFromSheet(true);
    setStatusMsg({
      text: `กำลังเชื่อมต่อและดึงข้อมูลจากแท็บ ${STUDENTS_SHEET_TITLE} ในกูเกิลชีต...`,
      type: 'info',
    });

    try {
      const result = await fetchStudentsFromGoogleSheet(TARGET_SPREADSHEET_ID);
      if (result.students.length > 0) {
        if (onSyncStudentsFromSheet) {
          onSyncStudentsFromSheet(result.students);
        }
        setSheetStudentsRows(result.rawRows);
        setStatusMsg({
          text: `ดึงข้อมูลสำเร็จ! นำเข้ารายชื่อนักเรียนจากแท็บ Students จำนวน ${result.students.length} คน เรียบร้อยแล้ว`,
          type: 'success',
        });
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
      } else {
        setStatusMsg({
          text: `เชื่อมต่อแท็บ Students แล้ว แต่ยังไม่พบแถวข้อมูลนักเรียน`,
          type: 'info',
        });
      }
    } catch (err: any) {
      console.error(err);
      setStatusMsg({
        text: `เกิดข้อผิดพลาดในการดึงข้อมูลแท็บ Students: ${err.message}`,
        type: 'error',
      });
    } finally {
      setIsFetchingFromSheet(false);
    }
  };

  // 6. SYNC SINGLE STUDENT PROFILE TO TAB "Students"
  const handleSyncSingleToStudentsTab = async (targetStudent?: UserProfile) => {
    setIsSyncing(true);
    const studentToSave = targetStudent || getUpdatedProfileObj();

    // Students can only save their own profile!
    if (!isEffectiveAdmin && studentToSave.id !== profile.id && studentToSave.studentId !== profile.studentId) {
      setIsSyncing(false);
      setStatusMsg({
        text: 'ปฏิเสธสิทธิ์: ผู้เรียนสามารถบันทึกได้เฉพาะข้อมูลโปรไฟล์ของตนเองเท่านั้น',
        type: 'error',
      });
      return;
    }

    setStatusMsg({
      text: `กำลังบันทึกข้อมูลของ "${studentToSave.name}" ลงแท็บ ${STUDENTS_SHEET_TITLE}...`,
      type: 'info',
    });

    try {
      let activeUser = currentUser;
      if (!activeUser) {
        try {
          const res = await googleSignIn();
          if (res) {
            activeUser = res.user;
            setCurrentUser(res.user);
          }
        } catch (authErr: any) {
          setIsSyncing(false);
          setStatusMsg({
            text: `กรุณาลงชื่อเข้าใช้ Google เพื่อยืนยันการบันทึก: ${authErr.message || 'ยกเลิกการเข้าสู่ระบบ'}`,
            type: 'error',
          });
          return;
        }
      }

      onUpdateProfile(studentToSave);

      const result = await saveProfileToGoogleSheet(
        TARGET_SPREADSHEET_ID,
        studentToSave,
        points,
        completedModulesCount,
        badges,
        activeUser?.email || studentToSave.contactEmail || ''
      );

      // Record access log to tab "Logs"
      await recordStudentLoginToGoogleSheet(
        TARGET_SPREADSHEET_ID,
        studentToSave,
        activeUser?.email || studentToSave.contactEmail || '',
        'อัปเดตข้อมูลโปรไฟล์และบันทึกลงชีต',
        'profileManage'
      );

      setStatusMsg({
        text: `บันทึกข้อมูล "${studentToSave.name}" ลงในแท็บ ${result.sheetTitle} (Google Sheet ID: ${TARGET_SPREADSHEET_ID}) สำเร็จเรียบร้อย!`,
        type: 'success',
      });
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });

      loadSheetInspectionData();
    } catch (err: any) {
      console.error(err);
      setStatusMsg({
        text: `บันทึกลงแท็บ Students ไม่สำเร็จ: ${err.message || 'โปรดตรวจสอบสิทธิ์ชีต'}`,
        type: 'error',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // 7. BATCH SYNC ALL PROFILES TO TAB "Students" (Admins only)
  const handleBatchSyncStudents = async () => {
    if (!isEffectiveAdmin) {
      setStatusMsg({
        text: 'ปฏิเสธการดำเนินการ: เฉพาะผู้ดูแลระบบ/คุณครูเท่านั้นที่สามารถบันทึกข้อมูลผู้เรียนทั้งหมดได้',
        type: 'error',
      });
      return;
    }

    setIsBatchSyncing(true);
    setStatusMsg({
      text: `กำลังเตรียมบันทึกข้อมูลนักเรียนทั้งหมด (${profiles.length} คน) ลงแท็บ ${STUDENTS_SHEET_TITLE}...`,
      type: 'info',
    });

    try {
      let activeUser = currentUser;
      if (!activeUser) {
        try {
          const res = await googleSignIn();
          if (res) {
            activeUser = res.user;
            setCurrentUser(res.user);
          }
        } catch (authErr: any) {
          setIsBatchSyncing(false);
          setStatusMsg({
            text: `กรุณาลงชื่อเข้าใช้ด้วย Google เพื่อบันทึก: ${authErr.message || 'ยกเลิก'}`,
            type: 'error',
          });
          return;
        }
      }

      const result = await saveMultipleProfilesToGoogleSheet(
        TARGET_SPREADSHEET_ID,
        profiles,
        activeUser?.email || ''
      );

      setStatusMsg({
        text: `บันทึกข้อมูลนักเรียนทั้งหมด ${result.count} คน ลงในแท็บ ${result.sheetTitle} สำเร็จเรียบร้อย!`,
        type: 'success',
      });
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });

      loadSheetInspectionData();
    } catch (err: any) {
      console.error(err);
      setStatusMsg({
        text: `เกิดข้อผิดพลาดในการบันทึกหมู่: ${err.message}`,
        type: 'error',
      });
    } finally {
      setIsBatchSyncing(false);
    }
  };

  // 8. RECORD ACCESS LOG TO TAB "Logs"
  const handleTestRecordAccessLog = async () => {
    setIsLoggingAccess(true);
    try {
      const activeEmail = currentUser?.email || profile.contactEmail || '';
      const result = await recordStudentLoginToGoogleSheet(
        TARGET_SPREADSHEET_ID,
        profile,
        activeEmail,
        'บันทึกการเข้าเรียนและศึกษาบทเรียน Coder Kids',
        'profileManage'
      );
      if (result.success) {
        setStatusMsg({
          text: `บันทึกประวัติการเข้าใช้งานลงในแท็บ Logs บน Google Sheet สำเร็จเรียบร้อย!`,
          type: 'success',
        });
        confetti({ particleCount: 35, spread: 50 });
        loadSheetInspectionData();
      } else {
        setStatusMsg({
          text: `ยังไม่ได้ลงชื่อเข้าใช้ Google: การบันทึกประวัติเข้าสู่ระบบแท็บ Logs จำเป็นต้องเข้าสู่ระบบ Google`,
          type: 'info',
        });
      }
    } catch (e: any) {
      setStatusMsg({ text: `บันทึกลงแท็บ Logs ไม่สำเร็จ: ${e.message}`, type: 'error' });
    } finally {
      setIsLoggingAccess(false);
    }
  };

  // 8.1 CONNECT SHEETS WRITE SCOPE (FOR TEACHERS/ADMIN)
  const handleConnectSheetsScope = async () => {
    setIsConnectingSheets(true);
    try {
      const res = await connectTeacherSheetsScope();
      if (res.success) {
        setStatusMsg({
          text: 'เชื่อมต่อสิทธิ์เขียน Google Sheets สำเร็จเรียบร้อย! ระบบสามารถบันทึกและซิงก์ข้อมูลลงชีตได้ทันที',
          type: 'success',
        });
        confetti({ particleCount: 50, spread: 60 });
      }
    } catch (err: any) {
      setStatusMsg({
        text: `เชื่อมต่อสิทธิ์ชีตไม่สำเร็จ: ${err.message}`,
        type: 'error',
      });
    } finally {
      setIsConnectingSheets(false);
    }
  };

  // 8.2 BATCH SYNC ALL CACHED LOGS TO TAB "Logs"
  const handleBatchSyncLogs = async () => {
    setIsSyncingAllLogs(true);
    try {
      const res = await batchSyncLogsToGoogleSheet(TARGET_SPREADSHEET_ID);
      setStatusMsg({
        text: res.message,
        type: res.count > 0 ? 'success' : 'info',
      });
      if (res.count > 0) {
        confetti({ particleCount: 50, spread: 70 });
        loadSheetInspectionData();
      }
    } catch (err: any) {
      setStatusMsg({
        text: `ซิงก์ประวัติเข้าเรียนไม่สำเร็จ: ${err.message}`,
        type: 'error',
      });
    } finally {
      setIsSyncingAllLogs(false);
    }
  };

  // 9. VERIFY ADMIN RIGHTS FROM "Teachers" TAB
  const handleCheckAdminPermission = (customEmail?: string) => {
    const targetEmail = (customEmail || adminCheckEmail || currentUser?.email || profile.contactEmail || '').trim();

    if (!targetEmail) {
      setAdminCheckResult({
        tested: true,
        isAdmin: false,
        message: 'กรุณาระบุอีเมลที่ต้องการตรวจสอบสิทธิ์',
      });
      return;
    }

    const check = checkIsTeacherAdmin(targetEmail, teachers);
    if (check.isAdmin) {
      if (onToggleAdmin) onToggleAdmin(true);
      setAdminCheckResult({
        tested: true,
        isAdmin: true,
        message: `ยืนยันสิทธิ์ถูกต้อง! บัญชี "${targetEmail}" ได้รับสิทธิ์แอดมินตามที่ระบุในแท็บ Teachers (${check.matchedTeacher?.name || 'ครูผู้สอน'})`,
      });
      setStatusMsg({
        text: `ได้รับการยืนยันสิทธิ์แอดมินจากแท็บ Teachers เรียบร้อยแล้ว!`,
        type: 'success',
      });
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    } else {
      setAdminCheckResult({
        tested: true,
        isAdmin: false,
        message: `ไม่พบอีเมล "${targetEmail}" ในแท็บ Teachers ของกูเกิลชีต (สิทธิ์คงเดิม: สมาชิกผู้เรียน)`,
      });
    }
  };

  // 10. REFRESH TEACHERS TAB
  const handleRefreshTeachersTab = async () => {
    setIsRefreshingTeachers(true);
    try {
      let updated: TeacherRecord[] = [];
      if (onRefreshTeachers) {
        updated = await onRefreshTeachers();
      } else {
        updated = await fetchTeachersFromGoogleSheet(TARGET_SPREADSHEET_ID);
      }
      setTeachers(updated);
      setStatusMsg({
        text: `รีเฟรชข้อมูลแท็บ Teachers สำเร็จ พบคุณครู/แอดมิน ${updated.length} ท่าน`,
        type: 'success',
      });
    } catch (err: any) {
      setStatusMsg({ text: `รีเฟรชข้อมูลไม่สำเร็จ: ${err.message}`, type: 'error' });
    } finally {
      setIsRefreshingTeachers(false);
    }
  };

  // 11. ADD NEW TEACHER TO "Teachers" TAB (Admins only)
  const handleAddNewTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEffectiveAdmin) {
      setStatusMsg({ text: 'เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถเพิ่มคุณครูใหม่ได้', type: 'error' });
      return;
    }

    if (!newTeacherName.trim() || !newTeacherEmail.trim()) {
      setStatusMsg({ text: 'กรุณากรอกชื่อและอีเมลของคุณครูให้ครบถ้วน', type: 'error' });
      return;
    }

    setIsAddingTeacher(true);
    setStatusMsg({ text: 'กำลังบันทึกข้อมูลคุณครูใหม่ลงในแท็บ Teachers...', type: 'info' });

    try {
      await addTeacherToGoogleSheet(TARGET_SPREADSHEET_ID, newTeacherName, newTeacherEmail);
      const newRec: TeacherRecord = {
        name: newTeacherName.trim(),
        email: newTeacherEmail.trim(),
        role: 'teacher',
        updatedAt: 'เพิ่งเพิ่ม',
      };
      setTeachers((prev) => [...prev, newRec]);
      setNewTeacherName('');
      setNewTeacherEmail('');
      setStatusMsg({
        text: `เพิ่มคุณครู "${newTeacherName}" ลงในแท็บ Teachers ของ Google Sheet เรียบร้อยแล้ว!`,
        type: 'success',
      });
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (err: any) {
      setStatusMsg({
        text: `ไม่สามารถบันทึกคุณครูได้: ${err.message || 'ต้องเข้าสู่ระบบด้วยบัญชีแอดมินก่อน'}`,
        type: 'error',
      });
    } finally {
      setIsAddingTeacher(false);
    }
  };

  // 12. LOAD SHEET INSPECTION DATA (Students, Teachers, Logs)
  const loadSheetInspectionData = async () => {
    setIsLoadingSheetData(true);
    try {
      const studentData = await readProfilesFromGoogleSheet(TARGET_SPREADSHEET_ID, STUDENTS_SHEET_TITLE);
      setSheetStudentsRows(studentData.rows);

      const teacherData = await readProfilesFromGoogleSheet(TARGET_SPREADSHEET_ID, TEACHERS_SHEET_TITLE);
      setSheetTeachersRows(teacherData.rows);

      const logsData = await readLogsFromGoogleSheet(TARGET_SPREADSHEET_ID);
      setSheetLogsRows(logsData.rows);
    } catch (err: any) {
      console.warn('Load sheet inspection error:', err);
    } finally {
      setIsLoadingSheetData(false);
    }
  };

  // Export JSON
  const handleExportProfile = () => {
    const exportData = {
      spreadsheetId: TARGET_SPREADSHEET_ID,
      profile: getUpdatedProfileObj(),
      allProfiles: isEffectiveAdmin ? profiles : [profile],
      points,
      badges,
      teachers: isEffectiveAdmin ? teachers : [],
      exportedAt: new Date().toISOString(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `coderkids_profile_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setStatusMsg({ text: 'ส่งออกข้อมูลไฟล์สำรอง JSON สำเร็จเรียบร้อย', type: 'success' });
  };

  // Import JSON
  const handleImportProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported.profile) {
          onUpdateProfile(imported.profile);
          setName(imported.profile.name || '');
          setNickname(imported.profile.nickname || '');
          setStudentId(imported.profile.studentId || '10241');
          setSchool(imported.profile.school || '');
          setGrade(imported.profile.grade || '');
          setBio(imported.profile.bio || '');
          setMotto(imported.profile.motto || '');
          setSelectedAvatarId(imported.profile.avatarId || 'avatar_cat');
          setSelectedTitle(imported.profile.selectedTitle || 'นักประดิษฐ์รุ่นเยาว์ (Junior Innovator)');
          setThemeColor(imported.profile.themeColor || 'indigo');
          setTechInterests(imported.profile.techInterests || []);
          if (imported.profile.codingLevel) setCodingLevel(imported.profile.codingLevel);
          setStatusMsg({ text: 'นำเข้าข้อมูลโปรไฟล์สำเร็จเรียบร้อย!', type: 'success' });
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        } else {
          throw new Error('รูปแบบไฟล์โปรไฟล์ไม่ถูกต้อง');
        }
      } catch (err: any) {
        setStatusMsg({ text: `นำเข้าไฟล์ไม่สำเร็จ: ${err.message}`, type: 'error' });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Copy Student ID
  const handleCopyStudentId = () => {
    navigator.clipboard.writeText(studentId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // If user is a student, only allow them to see and manage THEIR OWN profile!
  // If admin, display student profiles from Students tab
  const baseProfilesList = isEffectiveAdmin
    ? profiles.filter((p) => p.role !== 'admin' && !p.id.startsWith('admin_'))
    : [profile];

  const filteredProfiles = baseProfilesList.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.nickname && p.nickname.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.studentId && p.studentId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.school && p.school.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLevel =
      levelFilter === 'ALL' ||
      p.codingLevel === levelFilter ||
      (!p.codingLevel && levelFilter === 'Intermediate');

    return matchesSearch && matchesLevel;
  });

  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${TARGET_SPREADSHEET_ID}/edit`;

  // 0. Login Gatekeeper: หากยังไม่เข้าสู่ระบบ ห้ามแสดงรายชื่อโปรไฟล์หรือข้อมูลใดๆ ทั้งสิ้น
  if (!isLoggedIn) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
          <Lock className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold font-mono">
            <span>เฉพาะบัญชีโดเมน @anubalnara.ac.th</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            ระบบจัดการโปรไฟล์ผู้เรียน Coder Kids
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
            กรุณาเข้าสู่ระบบด้วยบัญชีกูเกิลของโรงเรียน (<strong className="text-indigo-600 font-mono">@anubalnara.ac.th</strong>) เพื่อดูและแก้ไขโปรไฟล์ของตนเอง หรือสำหรับคุณครูในการดูแลข้อมูลผู้เรียน
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 text-left space-y-2">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>นโยบายความปลอดภัยและสิทธิ์การใช้งาน (PDPA)</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-slate-500 text-[11px]">
            <li>บุคคลภายนอกที่ไม่เข้าสู่ระบบจะไม่สามารถเปิดดูหรือจัดการข้อมูลผู้เรียนได้</li>
            <li>ผู้เรียนเข้าดูและแก้ไขได้เฉพาะข้อมูลโปรไฟล์ของตนเองเท่านั้น</li>
            <li>สมาชิกไม่สามารถลบหรือแก้ไขข้อมูลเพื่อนคนอื่นได้</li>
            <li>สิทธิ์ผู้ดูแลระบบ (Admin) สงวนไว้สำหรับคุณครูในแท็บ Teachers เท่านั้น</li>
          </ul>
        </div>

        {onOpenLogin && (
          <button
            onClick={onOpenLogin}
            className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>เข้าสู่ระบบด้วยบัญชีโรงเรียน (@anubalnara.ac.th)</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Top Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Coder Kids · School Profile &amp; Role Management</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>ระบบจัดการโปรไฟล์ผู้เรียน</span>
            {isEffectiveAdmin && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
                Google Sheets Live
              </span>
            )}
          </h1>

          {isEffectiveAdmin ? (
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              เชื่อมต่อข้อมูลและสิทธิ์กับคลาวด์โรงเรียน: บันทึกข้อมูลผู้เรียนในแท็บ{' '}
              <strong className="text-emerald-700 font-semibold font-mono">Students</strong>,
              กำหนดสิทธิ์แอดมินจากแท็บ <strong className="text-purple-700 font-semibold font-mono">Teachers</strong>,
              และบันทึกประวัติเข้าเรียนในแท็บ <strong className="text-blue-700 font-semibold font-mono">Logs</strong>
            </p>
          ) : (
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              ยินดีต้อนรับสู่ระบบโปรไฟล์ผู้เรียน Coder Kids คุณสามารถดูและปรับแต่งข้อมูลโปรไฟล์ อวตาร และบัตรนักเรียนดิจิทัลของตนเองได้ที่นี่
            </p>
          )}

          {/* Connected Google Sheet ID & Sheet Tabs Indicator (ไม่แสดงแก่ผู้ใช้งานทั่วไปและผู้เรียน - เฉพาะครู/แอดมินเท่านั้น) */}
          {isEffectiveAdmin && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="font-semibold text-slate-700">กูเกิลชีตไอดี:</span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl font-mono font-bold select-all">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{TARGET_SPREADSHEET_ID}</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-mono text-[11px] font-semibold">
                  แท็บ Students
                </span>
                <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-md font-mono text-[11px] font-semibold">
                  แท็บ Teachers
                </span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md font-mono text-[11px] font-semibold">
                  แท็บ Logs
                </span>
              </div>

              <a
                href={spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:text-emerald-900 underline font-semibold flex items-center gap-0.5 ml-1"
                title="เปิดดูสเปรดชีต Google Sheets (เฉพาะครู/แอดมิน)"
              >
                <span>เปิดดูชีต</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Quick Admin Status & Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Admin Status Pill */}
          <div
            className={`px-3.5 py-2 rounded-2xl border flex items-center gap-2 text-xs font-bold shadow-xs ${
              isEffectiveAdmin
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            {isEffectiveAdmin ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="leading-tight">สิทธิ์: ผู้ดูแลระบบ (Admin)</div>
                  <div className="text-[10px] text-amber-700 font-normal">
                    {currentTeacherAdminMatch.matchedTeacher
                      ? `ยืนยันจากแท็บ Teachers (${currentTeacherAdminMatch.matchedTeacher.name.split(' ')[0]})`
                      : 'โหมดผู้ดูแลระบบ'}
                  </div>
                </div>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <div className="leading-tight">สิทธิ์: สมาชิก (ผู้เรียน)</div>
                  <div className="text-[10px] text-slate-400 font-normal flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> ไม่สามารถเปลี่ยนเป็นแอดมินได้
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Active Profile Pill */}
          <div className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
            <span className="text-2xl">{profile.avatarEmoji || '🐱'}</span>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {profile.name} {profile.nickname ? `(${profile.nickname})` : ''}
                </span>
                <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">
                  ใช้งาน
                </span>
              </div>
              <div className="text-[11px] text-indigo-600 font-medium font-mono">
                ID: {profile.studentId || '10241'} · {points} XP
              </div>
            </div>
          </div>

          {/* Action button: '+ เพิ่มผู้เรียน' only for Teachers/Admins */}
          {isEffectiveAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ เพิ่มผู้เรียน</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Top Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-200/80 rounded-2xl">
        <button
          onClick={() => setActiveSubTab('directory')}
          className={`flex-1 min-w-[170px] py-2.5 px-3 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
            activeSubTab === 'directory'
              ? 'bg-white text-indigo-700 shadow-sm font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>
            {isEffectiveAdmin
              ? `1. จัดการข้อมูลผู้เรียน (${profiles.length} คน)`
              : '1. ข้อมูลโปรไฟล์ของฉัน (My Profile)'}
          </span>
        </button>

        {isEffectiveAdmin && (
          <button
            onClick={() => setActiveSubTab('teachers')}
            className={`flex-1 min-w-[170px] py-2.5 px-3 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
              activeSubTab === 'teachers'
                ? 'bg-white text-purple-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-4 h-4 text-purple-600" />
            <span>2. สิทธิ์แอดมิน (แท็บ Teachers)</span>
          </button>
        )}

        <button
          onClick={() => setActiveSubTab('identity')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
            activeSubTab === 'identity'
              ? 'bg-white text-indigo-700 shadow-sm font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>3. แก้ไขข้อมูล &amp; อวตาร</span>
        </button>

        <button
          onClick={() => setActiveSubTab('card')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
            activeSubTab === 'card'
              ? 'bg-white text-indigo-700 shadow-sm font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <IdCard className="w-4 h-4" />
          <span>4. บัตรดิจิทัล</span>
        </button>

        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
            activeSubTab === 'analytics'
              ? 'bg-white text-indigo-700 shadow-sm font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>5. เหรียญตรา &amp; สถิติ</span>
        </button>

        {isEffectiveAdmin && (
          <button
            onClick={() => {
              setActiveSubTab('sync');
              if (sheetStudentsRows.length === 0) loadSheetInspectionData();
            }}
            className={`flex-1 min-w-[170px] py-2.5 px-3 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
              activeSubTab === 'sync'
                ? 'bg-white text-emerald-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-600" />
            <span>6. ดูข้อมูลชีต (Students, Teachers, Logs)</span>
          </button>
        )}
      </div>

      {/* Status Feedback Banner */}
      {statusMsg && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-medium border flex items-center justify-between shadow-sm transition-all ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : statusMsg.type === 'error'
              ? 'bg-rose-50 border-rose-300 text-rose-900'
              : statusMsg.type === 'warning'
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-indigo-50 border-indigo-300 text-indigo-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : statusMsg.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : statusMsg.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            ) : (
              <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
          <button
            onClick={() => setStatusMsg(null)}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* ------------------- TAB 1: PROFILES DIRECTORY (STUDENTS TAB) ------------------- */}
      {activeSubTab === 'directory' && (
        <div className="space-y-6">
          {/* Top Bar: Title & Permissions Notice */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                    <span>
                      {isEffectiveAdmin
                        ? `รายชื่อโปรไฟล์ผู้เรียนในระบบ (${profiles.length} คน)`
                        : `ข้อมูลโปรไฟล์ผู้เรียนของฉัน (My Profile)`}
                    </span>
                  </h3>
                  {isEffectiveAdmin && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold font-mono">
                      บันทึกที่แท็บ: Students
                    </span>
                  )}
                </div>

                {isEffectiveAdmin ? (
                  <p className="text-xs text-slate-500 mt-1">
                    โหมดผู้ดูแลระบบ: คุณสามารถจัดการ เพิ่ม ลบ แก้ไขผู้เรียนทุกคน และซิงก์ข้อมูลลงในแท็บ{' '}
                    <strong className="text-emerald-700 font-mono">Students</strong>
                  </p>
                ) : (
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-600 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200">
                    <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      <strong>โหมดสมาชิก (ผู้เรียน):</strong> คุณสามารถดูและแก้ไขเฉพาะข้อมูลโปรไฟล์ของตนเองได้เท่านั้น และไม่สามารถแก้ไขหรือจัดการข้อมูลผู้เรียนคนอื่นๆ ในระบบได้ตามมาตรฐานความปลอดภัย PDPA
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons: Only show school-wide management buttons to Admins */}
              {isEffectiveAdmin && (
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={handleFetchStudentsFromSheet}
                    disabled={isFetchingFromSheet}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                    title="ดึงรายชื่อนักเรียนจากแท็บ Students ใน Google Sheet เพื่ออัปเดต"
                  >
                    <ArrowDownToLine className={`w-4 h-4 text-indigo-600 ${isFetchingFromSheet ? 'animate-bounce' : ''}`} />
                    <span>{isFetchingFromSheet ? 'กำลังดึงข้อมูลชีต...' : 'ดึงข้อมูลจากแท็บ Students'}</span>
                  </button>

                  <button
                    onClick={handleBatchSyncStudents}
                    disabled={isBatchSyncing}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50"
                    title="บันทึกข้อมูลโปรไฟล์นักเรียนทั้งหมดลงแท็บ Students ใน Google Sheet"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>{isBatchSyncing ? 'กำลังบันทึกลงชีต...' : `บันทึกลงแท็บ Students (${profiles.length})`}</span>
                  </button>

                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>+ เพิ่มผู้เรียน</span>
                  </button>
                </div>
              )}
            </div>

            {/* Search and Filters (Shown for Admins to search across students) */}
            {isEffectiveAdmin && (
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ค้นหาชื่อ, ชื่อเล่น หรือเลขประจำตัวนักเรียน..."
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  <span className="text-xs text-slate-500 font-medium whitespace-nowrap mr-1 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5 text-slate-400" /> ระดับ:
                  </span>
                  {(['ALL', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setLevelFilter(lvl)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        levelFilter === lvl
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {lvl === 'ALL' ? 'ทั้งหมด' : lvl}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Student Profile Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProfiles.map((p) => {
              const isActive = p.id === profile.id;
              const pAvatar = AVATAR_OPTIONS.find((a) => a.id === p.avatarId) || AVATAR_OPTIONS[0];

              return (
                <div
                  key={p.id}
                  className={`bg-white rounded-3xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md ${
                    isActive ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200'
                  }`}
                >
                  <div className="p-5 space-y-4">
                    {/* Header Strip */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-13 h-13 rounded-2xl ${pAvatar.color} flex items-center justify-center text-2xl shadow-sm`}
                        >
                          {p.avatarEmoji || pAvatar.emoji}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 text-sm truncate flex items-center gap-1.5">
                            <span>{p.name}</span>
                            {p.nickname && <span className="text-indigo-600 font-medium">({p.nickname})</span>}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            เลขประจำตัว: <strong className="text-slate-800">{p.studentId || '10241'}</strong>
                          </div>
                          <div className="text-[10px] text-indigo-700 font-semibold truncate mt-0.5">
                            {p.selectedTitle || 'นักเรียนวิทยาการคำนวณ'}
                          </div>
                        </div>
                      </div>

                      {isActive ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold shrink-0 flex items-center gap-1">
                          <Check className="w-3 h-3" /> โปรไฟล์ของฉัน
                        </span>
                      ) : isEffectiveAdmin ? (
                        <button
                          onClick={() => handleSwitchProfile(p)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-xl text-[11px] font-bold transition-colors shrink-0"
                        >
                          สลับใช้
                        </button>
                      ) : null}
                    </div>

                    {/* School & Grade */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] space-y-1">
                      <div className="text-slate-600 truncate">
                        <span className="text-slate-400">ชั้น:</span> {p.grade || 'ป.4/1'} · {p.school || 'โรงเรียนอนุบาลนราธิวาส'}
                      </div>
                      {p.contactEmail && (
                        <div className="text-slate-500 text-[10px] truncate font-mono">
                          📧 {p.contactEmail}
                        </div>
                      )}
                      {p.bio && (
                        <p className="text-slate-600 italic text-[11px] line-clamp-2 pt-0.5">
                          &ldquo;{p.bio}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* Quick Tags */}
                    {p.techInterests && p.techInterests.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {p.techInterests.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[10px] font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingProfileId(p.id);
                          setActiveSubTab('identity');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                        title="แก้ไขข้อมูลโปรไฟล์"
                      >
                        <Edit3 className="w-3 h-3 text-slate-500" />
                        <span>แก้ไขข้อมูล</span>
                      </button>

                      {isEffectiveAdmin && (
                        <button
                          onClick={() => handleSyncSingleToStudentsTab(p)}
                          disabled={isSyncing}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                          title="บันทึกข้อมูลนี้ลงแท็บ Students ใน Google Sheet"
                        >
                          <UploadCloud className="w-3 h-3 text-emerald-600" />
                          <span>บันทึกลง Students</span>
                        </button>
                      )}
                    </div>

                    {/* Delete button: Only allowed for Admins on non-active profiles */}
                    {isEffectiveAdmin && profiles.length > 1 && !isActive && (
                      <button
                        onClick={() => setProfileToDelete(p)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="ลบโปรไฟล์ผู้เรียน (สิทธิ์ครู/แอดมิน)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------- TAB 2: TEACHERS & ADMIN PERMISSIONS (TEACHERS TAB) ------------------- */}
      {activeSubTab === 'teachers' && (
        <div className="space-y-6">
          {/* Main Teacher Role Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white shadow-xl border border-indigo-500/20 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-13 h-13 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-purple-600/30">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">
                      การกำหนดสิทธิ์แอดมินและคุณครู (แท็บ Teachers)
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono font-bold border border-purple-400/30">
                      Tab: Teachers
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                    ระบบจะตรวจสอบสิทธิ์ผู้ดูแลระบบ (Admin) โดยอ้างอิงจากรายชื่อและอีเมลในแท็บ{' '}
                    <strong className="text-emerald-300 font-mono">Teachers</strong> ของกูเกิลชีตไอดี{' '}
                    <code className="text-amber-300 font-mono font-bold">{TARGET_SPREADSHEET_ID}</code>
                  </p>
                </div>
              </div>

              <a
                href={spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 shrink-0"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>เปิดดูแท็บ Teachers ในชีต</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Current Account Verification Box */}
            <div className="bg-white/10 rounded-2xl p-5 border border-white/15 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    สถานะการรับรองสิทธิ์ของบัญชีปัจจุบัน:
                  </div>
                  <div className="flex items-center gap-2">
                    {isEffectiveAdmin ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 rounded-xl text-xs font-bold">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>ได้รับการรับรองสิทธิ์แอดมิน (Admin / Teacher Verified)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/40 rounded-xl text-xs font-bold">
                        <Lock className="w-4 h-4 text-amber-400" />
                        <span>สถานะ: สมาชิก (ผู้เรียน) — ไม่สามารถเปลี่ยนเป็นแอดมินได้</span>
                      </span>
                    )}
                    {currentEmailForCheck && (
                      <span className="text-xs font-mono text-slate-300">({currentEmailForCheck})</span>
                    )}
                  </div>
                </div>

                {/* Manual Admin Switch: Only enabled for verified teachers */}
                {isEffectiveAdmin && onToggleAdmin ? (
                  <button
                    type="button"
                    onClick={() => onToggleAdmin(!isEffectiveAdmin)}
                    className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-md"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>สลับกลับเป็นโหมดสมาชิก</span>
                  </button>
                ) : (
                  <div className="text-xs text-amber-300 bg-amber-950/40 border border-amber-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>สิทธิ์แอดมินถูกล็อกตามรายชื่อในแท็บ Teachers</span>
                  </div>
                )}
              </div>

              {/* Instant Email Verifier Form */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="text-xs text-slate-200 font-semibold flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-indigo-400" />
                  <span>ตรวจสอบสิทธิ์แอดมินจากแท็บ Teachers ด้วยอีเมล (สำหรับคุณครู):</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="email"
                    value={adminCheckEmail}
                    onChange={(e) => setAdminCheckEmail(e.target.value)}
                    placeholder="เช่น nusorn.not@anubalnara.ac.th หรือ webmaster@anubalnara.ac.th"
                    className="w-full sm:flex-1 px-4 py-2 bg-black/40 border border-white/20 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleCheckAdminPermission()}
                    className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>ตรวจสอบสิทธิ์</span>
                  </button>
                </div>

                {adminCheckResult && (
                  <div
                    className={`p-3 rounded-xl text-xs font-medium border flex items-center gap-2 ${
                      adminCheckResult.isAdmin
                        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                        : 'bg-amber-950/60 border-amber-500/40 text-amber-200'
                    }`}
                  >
                    {adminCheckResult.isAdmin ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <span>{adminCheckResult.message}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* List of Verified Teachers Loaded from Teachers Tab */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span>รายชื่อคุณครูและแอดมินในแท็บ Teachers ({teachers.length} ท่าน)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  บัญชีที่ได้รับการแต่งตั้งในแท็บ Teachers จะมีสิทธิ์เข้าถึงแดชบอร์ดครูและระบบประเมินผล
                </p>
              </div>

              <button
                type="button"
                onClick={handleRefreshTeachersTab}
                disabled={isRefreshingTeachers}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 self-start"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingTeachers ? 'animate-spin' : ''}`} />
                <span>รีเฟรชแท็บ Teachers</span>
              </button>
            </div>

            {/* Teachers Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                  <tr>
                    <th className="px-4 py-3">ลำดับ</th>
                    <th className="px-4 py-3">ชื่อ-นามสกุลคุณครู</th>
                    <th className="px-4 py-3">อีเมลผู้ใช้งาน (Google Account)</th>
                    <th className="px-4 py-3">บทบาท / สิทธิ์</th>
                    <th className="px-4 py-3">การตรวจสอบ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teachers.map((t, idx) => {
                    const isCurrent =
                      currentUser?.email && t.email.toLowerCase() === currentUser.email.toLowerCase();

                    return (
                      <tr key={t.id || idx} className={`hover:bg-slate-50/70 ${isCurrent ? 'bg-indigo-50/40' : ''}`}>
                        <td className="px-4 py-3 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                            ครู
                          </span>
                          <span>{t.name}</span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              บัญชีนี้
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-600">{t.email}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                            {t.role === 'admin' ? 'ผู้ดูแลระบบ (Admin)' : 'คุณครูผู้สอน (Teacher)'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleCheckAdminPermission(t.email)}
                            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[11px] font-semibold transition-colors"
                          >
                            ตรวจสอบสิทธิ์อีเมลนี้
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Add New Teacher Form (Only for Admins) */}
            {isEffectiveAdmin ? (
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <UserPlus className="w-4 h-4 text-purple-600" />
                  <span>เพิ่มคุณครูหรือผู้ดูแลระบบใหม่เข้าสู่แท็บ Teachers:</span>
                </div>

                <form onSubmit={handleAddNewTeacher} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newTeacherName}
                    onChange={(e) => setNewTeacherName(e.target.value)}
                    placeholder="ชื่อ-นามสกุลคุณครู (เช่น ครูสมชาย ใจดี)"
                    className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="email"
                    value={newTeacherEmail}
                    onChange={(e) => setNewTeacherEmail(e.target.value)}
                    placeholder="อีเมล Google (เช่น somchai@school.ac.th)"
                    className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="submit"
                    disabled={isAddingTeacher}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{isAddingTeacher ? 'กำลังบันทึกลงชีต...' : '+ บันทึกลงแท็บ Teachers'}</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>เฉพาะผู้ดูแลระบบเท่านั้นที่มีสิทธิ์เพิ่มหรือแก้ไขรายชื่อคุณครูในแท็บ Teachers</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------- TAB 3: EDIT IDENTITY & AVATAR ------------------- */}
      {activeSubTab === 'identity' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Edit Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  แก้ไขข้อมูลโปรไฟล์: {name || 'ผู้เรียน'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isEffectiveAdmin
                    ? 'ปรับปรุงข้อมูลผู้เรียน และบันทึกลงแท็บ Students'
                    : 'แก้ไขข้อมูลโปรไฟล์ของตนเอง (ไม่สามารถแก้ไขข้อมูลของผู้เรียนคนอื่นได้)'}
                </p>
              </div>
              <span className="text-xs font-mono text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg font-bold">
                ID: {studentId}
              </span>
            </div>

            <form onSubmit={handleSaveLocal} className="space-y-5 text-xs sm:text-sm">
              {/* Role Protection Status */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">สถานะสิทธิ์ในระบบ</label>
                {isEffectiveAdmin ? (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>ผู้ดูแลระบบ (Admin) — ยืนยันจากแท็บ Teachers</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 font-semibold">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-slate-500" />
                      <span>สถานะ: สมาชิก (ผู้เรียน)</span>
                    </div>
                    <span className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1 font-normal">
                      <Lock className="w-3 h-3 text-amber-600" />
                      <span>ผู้เรียนไม่สามารถเปลี่ยนสถานะเป็นแอดมินได้</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block font-semibold text-slate-800 mb-2">
                  เลือกอวตารผู้เรียน (Categorized CS Avatars)
                </label>
                <CategorizedAvatarSelector
                  selectedAvatarId={selectedAvatarId}
                  selectedAvatarEmoji={selectedAvatarEmoji}
                  onSelectAvatar={(payload: AvatarSelectionPayload) => {
                    setSelectedAvatarId(payload.avatarId);
                    setSelectedAvatarEmoji(payload.avatarEmoji);
                  }}
                />
              </div>

              {/* Name & Nickname */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">ชื่อ-นามสกุล *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                    placeholder="ด.ช. กานต์ธีร์ เทพสุวรรณ"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ชื่อเล่น</label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                    placeholder="กานต์"
                  />
                </div>
              </div>

              {/* Student ID & Grade & School */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">เลขประจำตัวนักเรียน</label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-indigo-500"
                    placeholder="10241"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ระดับชั้น/ห้อง</label>
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                    placeholder="ป.4/1"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">โรงเรียน</label>
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                    placeholder="โรงเรียนอนุบาลนราธิวาส"
                  />
                </div>
              </div>

              {/* Title & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ฉายาที่เลือก</label>
                  <input
                    type="text"
                    value={selectedTitle}
                    onChange={(e) => setSelectedTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                    placeholder="เซียนโค้ดดิ้งรุ่นจิ๋ว"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">อีเมลผู้ใช้งาน</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-indigo-500"
                    placeholder="student@school.ac.th"
                  />
                </div>
              </div>

              {/* Bio & Motto */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">คำแนะนำตัว (Bio)</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                  placeholder="ชอบสร้างเกม Scratch และต่อวงจร Micro:bit..."
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">คติประจำใจ (Motto)</label>
                <input
                  type="text"
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                  placeholder="เขียนโค้ดวันละนิด เก่งขึ้นทุกวัน"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>บันทึกการแก้ไขโปรไฟล์</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSyncSingleToStudentsTab()}
                  disabled={isSyncing}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{isSyncing ? 'กำลังบันทึกลงชีต...' : 'บันทึกลงแท็บ Students ใน Google Sheet'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right: Live Preview Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>ตัวอย่างการแสดงผลบัตรโปรไฟล์ (Live Preview)</span>
              <span className="text-indigo-600 font-normal">อัปเดตแบบเรียลไทม์</span>
            </div>

            <div className={`p-6 sm:p-7 rounded-3xl bg-gradient-to-br ${currentTheme.bgGrad} text-white shadow-xl space-y-5 relative overflow-hidden border border-white/10`}>
              <div className="relative z-10 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-18 h-18 rounded-2xl ${currentAvatar.color} flex items-center justify-center text-3xl shadow-xl ring-4 ring-white/20`}
                    >
                      {selectedAvatarEmoji || currentAvatar.emoji}
                    </div>
                    <div className="min-w-0">
                      <div className="text-lg font-bold text-white truncate">
                        {name || 'ชื่อผู้เรียน'} {nickname ? `(${nickname})` : ''}
                      </div>
                      <div className="text-xs text-indigo-200 font-medium truncate mt-0.5">
                        {selectedTitle}
                      </div>
                      <div className="text-[11px] text-slate-300 truncate mt-0.5 font-mono">
                        เลขประจำตัว: {studentId} · {grade || 'ป.4/1'}
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 bg-amber-400 text-slate-950 rounded-lg text-xs font-mono font-extrabold uppercase shadow">
                    LV.{userLevel}
                  </span>
                </div>

                {/* Bio & Motto */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-xs text-slate-300 italic bg-white/5 p-3 rounded-xl border border-white/10 leading-relaxed">
                    &ldquo;{bio || 'ยินดีต้อนรับสู่โลกโค้ดดิ้งสร้างสรรค์!'}&rdquo;
                  </p>
                  {motto && (
                    <div className="text-[11px] text-amber-300 font-medium px-1">
                      💡 คติ: {motto}
                    </div>
                  )}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center text-xs">
                  <div className="p-2 rounded-xl bg-white/5">
                    <div className="font-mono font-bold text-amber-300 text-sm">{points}</div>
                    <div className="text-[10px] text-slate-400">แต้มสะสม</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <div className="font-mono font-bold text-orange-300 text-sm">{profile.streakDays || 1} วัน</div>
                    <div className="text-[10px] text-slate-400">Streak</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <div className="font-mono font-bold text-emerald-300 text-sm">{completedModulesCount}/4</div>
                    <div className="text-[10px] text-slate-400">สำเร็จ</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------- TAB 4: DIGITAL CODER PASS ------------------- */}
      {activeSubTab === 'card' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">บัตรประจำตัวนักเรียนโค้ดเดอร์ (Digital Coder Pass)</h3>
              <p className="text-xs text-slate-500">ข้อมูลเชื่อมต่อแท็บ Students ใน Google Sheet ID: {TARGET_SPREADSHEET_ID}</p>
            </div>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์บัตร (Print)</span>
            </button>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-7 sm:p-8 shadow-2xl border-2 border-indigo-500/30">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow">
                    C
                  </div>
                  <div>
                    <div className="text-xs font-bold tracking-wider uppercase text-white">Coder Kids Academy</div>
                    <div className="text-[10px] text-indigo-300">กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี</div>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono uppercase tracking-widest">
                  VERIFIED LEARNER
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-24 h-24 rounded-2xl ${currentAvatar.color} flex items-center justify-center text-5xl shadow-2xl ring-4 ring-white/20`}
                  >
                    {selectedAvatarEmoji || currentAvatar.emoji}
                  </div>
                  <span className="mt-2 text-[10px] font-mono text-indigo-300">
                    ID: {studentId}
                  </span>
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {name || 'ชื่อนักเรียน'}
                    </div>
                    <div className="text-xs text-indigo-300 font-semibold mt-0.5">
                      ฉายา: {selectedTitle}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-300 pt-1">
                    <div>
                      <span className="text-slate-400 text-[11px]">ระดับชั้น:</span> {grade}
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px]">เลเวล:</span> <span className="font-mono text-amber-300 font-bold">LV.{userLevel}</span>
                    </div>
                    <div className="col-span-2 truncate">
                      <span className="text-slate-400 text-[11px]">สถาบัน:</span> {school}
                    </div>
                    {contactEmail && (
                      <div className="col-span-2 truncate text-[11px] text-slate-400 font-mono">
                        {contactEmail}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
                <div className="text-xs text-slate-200 font-mono">
                  ซิงก์แท็บ: Students (Google Sheet Live)
                </div>
                <button
                  onClick={handleCopyStudentId}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-mono transition-colors"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId ? 'คัดลอกแล้ว' : studentId}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------- TAB 5: ACHIEVEMENTS & ANALYTICS ------------------- */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>เลเวลปัจจุบัน</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">LV.{userLevel}</div>
              <div className="text-[11px] text-slate-400 mt-1">{points} / {nextLevelMin} XP สู่ขั้นถัดไป</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>แต้มสะสมทั้งหมด</span>
                <Award className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-black text-indigo-700 font-mono">{points} แต้ม</div>
              <div className="text-[11px] text-slate-400 mt-1">บันทึกลงแท็บ Students</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>เรียนต่อเนื่อง (Streak)</span>
                <Flame className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-2xl font-black text-orange-600 font-mono">{profile.streakDays || 1} วัน</div>
              <div className="text-[11px] text-slate-400 mt-1">เข้าเรียนสม่ำเสมอ</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>เหรียญเกียรติยศ</span>
                <Star className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-black text-purple-700 font-mono">
                {badges.filter((b) => b.unlocked).length} / {badges.length}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">ปลดล็อกแล้ว</div>
            </div>
          </div>

          {/* Badges List */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">ตู้สะสมเหรียญตราเกียรติยศ (Badges Trophy Case)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                    b.unlocked ? 'bg-amber-50/50 border-amber-200 text-slate-900' : 'bg-slate-50 border-slate-200 opacity-60 text-slate-400'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${b.unlocked ? 'bg-amber-400 text-amber-950 shadow' : 'bg-slate-200'}`}>
                    {b.unlocked ? '🏅' : '🔒'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">{b.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{b.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------- TAB 6: GOOGLE SHEETS LIVE DATA (STUDENTS, TEACHERS, LOGS) ------------------- */}
      {activeSubTab === 'sync' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">ฐานข้อมูล Google Sheets โรงเรียน</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
                    ID: {TARGET_SPREADSHEET_ID}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  ครอบคลุมทั้ง 3 แท็บสำคัญ: <strong>Students</strong> (ข้อมูลผู้เรียน), <strong>Teachers</strong> (สิทธิ์แอดมิน), และ <strong>Logs</strong> (ประวัติการเข้าใช้งาน)
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Batch sync logs button */}
              <button
                onClick={handleBatchSyncLogs}
                disabled={isSyncingAllLogs}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer active:scale-95"
                title="ส่งประวัติการเข้าเรียนทั้งหมดในระบบลงแท็บ Logs ของ Google Sheet"
              >
                <UploadCloud className={`w-3.5 h-3.5 ${isSyncingAllLogs ? 'animate-bounce' : ''}`} />
                <span>{isSyncingAllLogs ? 'กำลังซิงก์...' : 'ซิงก์ประวัติทั้งหมดลงแท็บ Logs'}</span>
              </button>

              {/* Quick log record button */}
              <button
                onClick={handleTestRecordAccessLog}
                disabled={isLoggingAccess}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                title="บันทึกแถวการเข้าเรียนใหม่ปัจจุบันลงแท็บ Logs"
              >
                <History className={`w-3.5 h-3.5 ${isLoggingAccess ? 'animate-spin' : ''}`} />
                <span>+ บันทึกแถวใหม่</span>
              </button>

              {/* Connect Sheets scope for Teacher */}
              <button
                onClick={handleConnectSheetsScope}
                disabled={isConnectingSheets}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                title="เชื่อมต่อสิทธิ์เข้าถึง Google Sheets เพื่อให้สามารถบันทึกและแก้ไขข้อมูลลงชีตโดยตรง"
              >
                <KeyRound className={`w-3.5 h-3.5 ${isConnectingSheets ? 'animate-spin' : ''}`} />
                <span>เชื่อมต่อสิทธิ์เขียนชีต</span>
              </button>

              <button
                onClick={loadSheetInspectionData}
                disabled={isLoadingSheetData}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSheetData ? 'animate-spin' : ''}`} />
                <span>รีเฟรช 3 แท็บ</span>
              </button>

              <a
                href={spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>เปิดใน Google Sheets</span>
              </a>
            </div>
          </div>

          {/* Sub-Tabs: Students vs Teachers vs Logs */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveSheetInspectionTab('Students')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeSheetInspectionTab === 'Students'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>แท็บ Students ({sheetStudentsRows.length > 0 ? sheetStudentsRows.length - 1 : 0} คน)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSheetInspectionTab('Teachers')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeSheetInspectionTab === 'Teachers'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <KeyRound className="w-4 h-4" />
                  <span>แท็บ Teachers ({sheetTeachersRows.length > 0 ? sheetTeachersRows.length - 1 : 0} ท่าน)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSheetInspectionTab('Logs')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeSheetInspectionTab === 'Logs'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <History className="w-4 h-4" />
                  <span>แท็บ Logs ({sheetLogsRows.length > 0 ? sheetLogsRows.length - 1 : 0} รายการ)</span>
                </button>
              </div>

              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                {activeSheetInspectionTab === 'Students'
                  ? 'แผ่นงานบันทึกข้อมูลผู้เรียน'
                  : activeSheetInspectionTab === 'Teachers'
                  ? 'แผ่นงานกำหนดสิทธิ์แอดมิน'
                  : 'แผ่นงานบันทึกประวัติการเข้าใช้งาน'}
              </span>
            </div>

            {/* Table Viewer */}
            <div className="overflow-x-auto max-h-80 border border-slate-100 rounded-2xl">
              {activeSheetInspectionTab === 'Students' ? (
                sheetStudentsRows.length > 0 ? (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 sticky top-0 border-b border-slate-200">
                      <tr>
                        {sheetStudentsRows[0]?.map((header, i) => (
                          <th key={i} className="px-3.5 py-2.5 font-bold whitespace-nowrap">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sheetStudentsRows.slice(1).map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50/70">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="px-3.5 py-2 whitespace-nowrap text-slate-600 max-w-[220px] truncate">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                    <FileSpreadsheet className="w-8 h-8 text-slate-300 mx-auto" />
                    <div>คลิกปุ่ม &quot;รีเฟรชข้อมูลทั้ง 3 แท็บ&quot; เพื่อดึงข้อมูลสดจากแท็บ Students</div>
                  </div>
                )
              ) : activeSheetInspectionTab === 'Teachers' ? (
                sheetTeachersRows.length > 0 ? (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 sticky top-0 border-b border-slate-200">
                      <tr>
                        {sheetTeachersRows[0]?.map((header, i) => (
                          <th key={i} className="px-3.5 py-2.5 font-bold whitespace-nowrap">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sheetTeachersRows.slice(1).map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50/70">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="px-3.5 py-2 whitespace-nowrap text-slate-600 max-w-[220px] truncate">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                    <KeyRound className="w-8 h-8 text-slate-300 mx-auto" />
                    <div>คลิกปุ่ม &quot;รีเฟรชข้อมูลทั้ง 3 แท็บ&quot; เพื่อดึงข้อมูลสดจากแท็บ Teachers</div>
                  </div>
                )
              ) : sheetLogsRows.length > 0 ? (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 sticky top-0 border-b border-slate-200">
                    <tr>
                      {sheetLogsRows[0]?.map((header, i) => (
                        <th key={i} className="px-3.5 py-2.5 font-bold whitespace-nowrap">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sheetLogsRows.slice(1).map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/70">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-3.5 py-2 whitespace-nowrap text-slate-600 max-w-[220px] truncate font-mono text-[11px]">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                  <History className="w-8 h-8 text-slate-300 mx-auto" />
                  <div>คลิกปุ่ม &quot;รีเฟรชข้อมูลทั้ง 3 แท็บ&quot; เพื่อดึงข้อมูลสดจากแท็บ Logs</div>
                </div>
              )}
            </div>
          </div>

          {/* Backup & Apps Script Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">ส่งออกข้อมูล JSON (Export)</h4>
                <p className="text-[11px] text-slate-500">
                  {isEffectiveAdmin ? `สำรองไฟล์ ${profiles.length} โปรไฟล์` : 'สำรองไฟล์โปรไฟล์ของฉัน'}
                </p>
              </div>
              <button
                onClick={handleExportProfile}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ส่งออก</span>
              </button>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">นำเข้าข้อมูล JSON (Import)</h4>
                <p className="text-[11px] text-slate-500">กู้คืนโปรไฟล์จากไฟล์สำรอง</p>
              </div>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json"
                  onChange={handleImportProfile}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>นำเข้า</span>
                </button>
              </div>
            </div>

            {onOpenGasExport && (
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Google Apps Script (GAS)</h4>
                  <p className="text-[11px] text-slate-500">Code.gs สำหรับ Extensions</p>
                </div>
                <button
                  onClick={onOpenGasExport}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>เปิดไฟล์ GAS</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------- MODAL: ADD STUDENT PROFILE (Admins only) ------------------- */}
      {isAddModalOpen && isEffectiveAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">เพิ่มโปรไฟล์ผู้เรียนใหม่ (โหมดผู้ดูแลระบบ)</h3>
                  <p className="text-xs text-slate-500">ข้อมูลจะถูกบันทึกลงระบบและพร้อมส่งเข้าแท็บ Students</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700">หรือเลือกจากตัวอย่างด่วน:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PRESET_STUDENT_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.studentId}
                    type="button"
                    onClick={() => {
                      setNewName(tpl.name);
                      setNewNickname(tpl.nickname);
                      setNewStudentId(tpl.studentId);
                      setNewGrade(tpl.grade);
                      setNewSchool(tpl.school);
                      setNewAvatarId(tpl.avatarId);
                      setNewAvatarEmoji(tpl.avatarEmoji);
                      setNewBio(tpl.bio);
                      setNewMotto(tpl.motto);
                      setNewSelectedTitle(tpl.selectedTitle);
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50 text-left text-xs transition-colors"
                  >
                    <div className="font-bold text-slate-900 truncate">{tpl.name}</div>
                    <div className="text-[10px] text-slate-500">{tpl.studentId} · {tpl.grade}</div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">ชื่อ-นามสกุล *</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="ด.ช. เก่งกล้า ขยันเรียน"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ชื่อเล่น</label>
                  <input
                    type="text"
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    placeholder="เก่ง"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">เลขประจำตัว</label>
                  <input
                    type="text"
                    value={newStudentId}
                    onChange={(e) => setNewStudentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ระดับชั้น/ห้อง</label>
                  <input
                    type="text"
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">โรงเรียน</label>
                  <input
                    type="text"
                    value={newSchool}
                    onChange={(e) => setNewSchool(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ฉายาที่เลือก</label>
                <input
                  type="text"
                  value={newSelectedTitle}
                  onChange={(e) => setNewSelectedTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">คำแนะนำตัว (Bio)</label>
                <textarea
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="makeActive"
                  checked={makeNewActiveImmediately}
                  onChange={(e) => setMakeNewActiveImmediately(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="makeActive" className="text-xs text-slate-700 font-medium">
                  สลับใช้งานโปรไฟล์นี้ทันทีหลังบันทึก
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  + เพิ่มโปรไฟล์
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------- MODAL: DELETE CONFIRMATION (Admins only) ------------------- */}
      {profileToDelete && isEffectiveAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">ยืนยันการลบโปรไฟล์?</h3>
              <p className="text-xs text-slate-500">
                ต้องการลบโปรไฟล์ &quot;{profileToDelete.name}&quot; ออกจากระบบหรือไม่
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setProfileToDelete(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
              >
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
