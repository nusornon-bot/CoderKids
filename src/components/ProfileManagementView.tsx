import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, AchievementBadge } from '../types/index.ts';
import {
  AVATAR_OPTIONS,
  PROFILE_THEMES,
  TECH_INTERESTS_AVAILABLE,
  DEFAULT_PROFILE,
} from '../data/learningData.ts';
import {
  TARGET_SPREADSHEET_ID,
  auth,
  initAuth,
  googleSignIn,
  googleLogout,
  saveProfileToGoogleSheet,
  saveMultipleProfilesToGoogleSheet,
  readProfilesFromGoogleSheet,
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
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProfileManagementViewProps {
  profile: UserProfile;
  profiles?: UserProfile[];
  onUpdateProfile: (updated: UserProfile) => void;
  onAddProfile?: (newProfile: UserProfile, makeActive?: boolean) => void;
  onDeleteProfile?: (profileId: string) => void;
  onSelectProfile?: (profileId: string) => void;
  points: number;
  completedModulesCount: number;
  badges: AchievementBadge[];
  isAdmin?: boolean;
  onToggleAdmin?: (isAdmin: boolean) => void;
  onOpenGasExport?: () => void;
}

// Preset student templates for rapid creation
const PRESET_STUDENT_TEMPLATES = [
  {
    label: 'ด.ช. กานต์ธีร์ (สายเกม Scratch)',
    name: 'กานต์ธีร์ เทพสุวรรณ',
    nickname: 'กานต์',
    grade: 'ประถมศึกษาปีที่ 4/1',
    school: 'โรงเรียนอนุบาลนราธิวาส',
    avatarId: 'avatar_cat',
    avatarEmoji: '🐱',
    themeColor: 'amber',
    bio: 'ชอบสร้างเกมแพลตฟอร์มด้วย Scratch และออกแบบแอนิเมชันให้เพื่อนๆ เล่น',
    motto: 'โค้ดคือเวทมนตร์ จินตนาการคือพลัง!',
    codingLevel: 'Intermediate' as const,
    techInterests: ['Scratch Game', 'Creative Design', 'Algorithm & Logic'],
    selectedTitle: 'นักสร้างเกม Scratch (Game Designer)',
  },
  {
    label: 'ด.ญ. ธัญชนก (สาย Micro:bit IoT)',
    name: 'ธัญชนก รุ่งเรือง',
    nickname: 'โมบาย',
    grade: 'ประถมศึกษาปีที่ 4/1',
    school: 'โรงเรียนอนุบาลนราธิวาส',
    avatarId: 'avatar_microbit',
    avatarEmoji: '📟',
    themeColor: 'sky',
    bio: 'สนใจการต่อเซ็นเซอร์วัดความชื้นและอุณหภูมิเข้ากับบอร์ด Micro:bit',
    motto: 'ต่อสายไฟให้ถูก แล้วโลกจะเปลี่ยนไป!',
    codingLevel: 'Advanced' as const,
    techInterests: ['Micro:bit IoT', 'Robotics', 'Algorithm & Logic'],
    selectedTitle: 'วิศวกรฮาร์ดแวร์จิ๋ว (Hardware Explorer)',
  },
  {
    label: 'ด.ช. พัทธดนย์ (สายไซเบอร์ & PDPA)',
    name: 'พัทธดนย์ วงศ์สวัสดิ์',
    nickname: 'ภัทร',
    grade: 'ประถมศึกษาปีที่ 4/1',
    school: 'โรงเรียนอนุบาลนราธิวาส',
    avatarId: 'avatar_shield',
    avatarEmoji: '🛡️',
    themeColor: 'emerald',
    bio: 'ศึกษาเรื่องความปลอดภัยข้อมูล รหัสผ่านสองชั้น และการป้องกันภัยคุกคามไซเบอร์',
    motto: 'ข้อมูลส่วนตัว มีค่าดั่งทองคำ ปกป้องให้ปลอดภัย',
    codingLevel: 'Intermediate' as const,
    techInterests: ['Cyber Security', 'Digital Safety', 'Digital Citizenship'],
    selectedTitle: 'ผู้พิทักษ์ข้อมูล (Data Guardian)',
  },
  {
    label: 'ด.ญ. รมิดา (สาย AI & ตรรกะ)',
    name: 'รมิดา ศักดิ์เจริญ',
    nickname: 'มีน',
    grade: 'ประถมศึกษาปีที่ 4/1',
    school: 'โรงเรียนอนุบาลนราธิวาส',
    avatarId: 'avatar_robot',
    avatarEmoji: '🤖',
    themeColor: 'indigo',
    bio: 'ชอบวิเคราะห์ลำดับขั้นตอน การทำซ้ำ และการคิดอย่างเป็นระบบ',
    motto: 'คิดทีละสเต็ป แก้ง่ายทุกปัญหา',
    codingLevel: 'Beginner' as const,
    techInterests: ['Algorithm & Logic', 'Data Science', 'Scratch Game'],
    selectedTitle: 'เซียนอัลกอริทึม (Logic Master)',
  },
];

export const ProfileManagementView: React.FC<ProfileManagementViewProps> = ({
  profile,
  profiles = [profile],
  onUpdateProfile,
  onAddProfile,
  onDeleteProfile,
  onSelectProfile,
  points,
  completedModulesCount,
  badges,
  isAdmin = false,
  onToggleAdmin,
  onOpenGasExport,
}) => {
  // Navigation tabs in Profile Management: directory (เพิ่ม/ลบ/แก้ไข/สลับ) | identity | card | analytics | sync
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'identity' | 'card' | 'analytics' | 'sync'>('directory');

  // Currently editing profile ID (defaults to active profile's ID)
  const [editingProfileId, setEditingProfileId] = useState<string>(profile.id || 'prof_1');

  // Form states for profile editing
  const [name, setName] = useState(profile.name || '');
  const [nickname, setNickname] = useState(profile.nickname || '');
  const [studentId, setStudentId] = useState(profile.studentId || 'CK-2569-4102');
  const [school, setSchool] = useState(profile.school || 'โรงเรียนอนุบาลนราธิวาส');
  const [grade, setGrade] = useState(profile.grade || 'ประถมศึกษาปีที่ 4/1');
  const [bio, setBio] = useState(profile.bio || '');
  const [motto, setMotto] = useState(profile.motto || '');
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>(profile.role || 'student');
  const [contactEmail, setContactEmail] = useState(profile.contactEmail || '');
  const [githubOrScratch, setGithubOrScratch] = useState(profile.githubOrScratch || '');
  const [codingLevel, setCodingLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(profile.codingLevel || 'Intermediate');
  const [selectedAvatarId, setSelectedAvatarId] = useState(profile.avatarId || 'avatar_cat');
  const [selectedAvatarEmoji, setSelectedAvatarEmoji] = useState(profile.avatarEmoji || '🐱');
  const [selectedTitle, setSelectedTitle] = useState(profile.selectedTitle || 'นักประดิษฐ์รุ่นเยาว์ (Junior Innovator)');
  const [themeColor, setThemeColor] = useState(profile.themeColor || 'indigo');
  const [techInterests, setTechInterests] = useState<string[]>(profile.techInterests || ['Scratch Game', 'Micro:bit IoT']);

  // Add Profile Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [newStudentId, setNewStudentId] = useState(`CK-2569-${Math.floor(1000 + Math.random() * 9000)}`);
  const [newSchool, setNewSchool] = useState('โรงเรียนอนุบาลนราธิวาส');
  const [newGrade, setNewGrade] = useState('ประถมศึกษาปีที่ 4/1');
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
  const [isLoadingSheetData, setIsLoadingSheetData] = useState(false);

  // Status message
  const [statusMsg, setStatusMsg] = useState<{
    text: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Sheet data inspection
  const [sheetRows, setSheetRows] = useState<string[][]>([]);
  const [sheetTabName, setSheetTabName] = useState<string>('');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Confirmation modal state for single profile sync
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Hidden file input for import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track Auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setCurrentUser(user);
      },
      () => {
        setCurrentUser(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // When editingProfileId changes, load that profile's values into the edit form
  useEffect(() => {
    const target = profiles.find((p) => p.id === editingProfileId) || profile;
    if (target) {
      setName(target.name || '');
      setNickname(target.nickname || '');
      setStudentId(target.studentId || 'CK-2569-4102');
      setSchool(target.school || 'โรงเรียนอนุบาลนราธิวาส');
      setGrade(target.grade || 'ประถมศึกษาปีที่ 4/1');
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
  }, [editingProfileId, profiles, profile]);

  const currentAvatar = AVATAR_OPTIONS.find((a) => a.id === selectedAvatarId) || AVATAR_OPTIONS[0];
  const currentTheme = PROFILE_THEMES.find((t) => t.id === themeColor) || PROFILE_THEMES[0];

  const newAvatar = AVATAR_OPTIONS.find((a) => a.id === newAvatarId) || AVATAR_OPTIONS[0];

  // Level calculation: 75 points per level
  const userLevel = Math.max(1, Math.floor(points / 75) + 1);
  const currentLevelMin = (userLevel - 1) * 75;
  const nextLevelMin = userLevel * 75;
  const levelProgress = Math.min(100, Math.round(((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100));

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setStatusMsg(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setStatusMsg({
          text: `เข้าสู่ระบบด้วย Google สำเร็จ: ${res.user.displayName || res.user.email}`,
          type: 'success',
        });
        loadSheetData();
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
    setSheetRows([]);
    setStatusMsg({ text: 'ออกจากระบบ Google เรียบร้อยแล้ว', type: 'info' });
  };

  // Toggle interest in edit form
  const toggleInterest = (interest: string) => {
    if (techInterests.includes(interest)) {
      setTechInterests(techInterests.filter((i) => i !== interest));
    } else {
      if (techInterests.length >= 5) {
        setStatusMsg({ text: 'เลือกความสนใจได้สูงสุด 5 เรื่อง', type: 'info' });
        return;
      }
      setTechInterests([...techInterests, interest]);
    }
  };

  // Toggle interest in new profile form
  const toggleNewInterest = (interest: string) => {
    if (newTechInterests.includes(interest)) {
      setNewTechInterests(newTechInterests.filter((i) => i !== interest));
    } else {
      if (newTechInterests.length >= 5) return;
      setNewTechInterests([...newTechInterests, interest]);
    }
  };

  // Build updated profile object
  const getUpdatedProfileObj = (): UserProfile => {
    const existing = profiles.find((p) => p.id === editingProfileId) || profile;
    return {
      ...existing,
      id: editingProfileId || existing.id || `prof_${Date.now()}`,
      name: name.trim() || existing.name,
      nickname: nickname.trim(),
      studentId: existing.studentId || studentId.trim() || 'CK-2569-4102',
      school: school.trim() || 'โรงเรียนอนุบาลนราธิวาส',
      grade: grade.trim() || 'ประถมศึกษาปีที่ 4/1',
      role,
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

  // 1. SAVE PROFILE (EDIT)
  const handleSaveLocal = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updated = getUpdatedProfileObj();
    onUpdateProfile(updated);
    setStatusMsg({
      text: `บันทึกการแก้ไขโปรไฟล์ "${updated.name}" เรียบร้อยแล้ว!`,
      type: 'success',
    });
    confetti({ particleCount: 40, spread: 55, origin: { y: 0.6 } });
  };

  // 2. ADD NEW PROFILE
  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setStatusMsg({ text: 'กรุณากรอกชื่อ-นามสกุลของผู้เรียน', type: 'error' });
      return;
    }

    const newId = `prof_${Date.now()}`;
    const newStudentProfile: UserProfile = {
      id: newId,
      name: newName.trim(),
      nickname: newNickname.trim(),
      studentId: newStudentId.trim() || `CK-2569-${Math.floor(1000 + Math.random() * 9000)}`,
      school: newSchool.trim() || 'โรงเรียนอนุบาลนราธิวาส',
      grade: newGrade.trim() || 'ประถมศึกษาปีที่ 4/1',
      role: newRole,
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
    resetNewProfileForm();
    setStatusMsg({
      text: `เพิ่มโปรไฟล์ผู้เรียน "${newStudentProfile.name}" สำเร็จเรียบร้อย!`,
      type: 'success',
    });
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
  };

  const resetNewProfileForm = () => {
    setNewName('');
    setNewNickname('');
    setNewStudentId(`CK-2569-0${Math.floor(Math.random() * 80 + 10)}`);
    setNewBio('พร้อมเรียนรู้และสนุกกับการเขียนโปรแกรมคอมพิวเตอร์!');
    setNewMotto('เขียนโค้ดวันละนิด เก่งขึ้นทุกวัน');
    setNewAvatarId('avatar_cat');
    setNewThemeColor('indigo');
    setNewCodingLevel('Intermediate');
    setNewSelectedTitle('นักประดิษฐ์รุ่นเยาว์ (Junior Innovator)');
    setNewTechInterests(['Scratch Game', 'Micro:bit IoT']);
  };

  const applyPresetTemplate = (tpl: typeof PRESET_STUDENT_TEMPLATES[0]) => {
    setNewName(tpl.name);
    setNewNickname(tpl.nickname);
    setNewGrade(tpl.grade);
    setNewSchool(tpl.school);
    setNewAvatarId(tpl.avatarId);
    setNewThemeColor(tpl.themeColor);
    setNewBio(tpl.bio);
    setNewMotto(tpl.motto);
    setNewCodingLevel(tpl.codingLevel);
    setNewTechInterests(tpl.techInterests);
    setNewSelectedTitle(tpl.selectedTitle);
    setStatusMsg({ text: `เลือกแม่แบบ: ${tpl.label} เรียบร้อย`, type: 'info' });
  };

  // 3. DELETE PROFILE
  const handleConfirmDelete = () => {
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

    // If currently editing this profile, point to another
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

  // 4. SWITCH PROFILE
  const handleSwitchProfile = (p: UserProfile) => {
    if (onSelectProfile) {
      onSelectProfile(p.id);
    } else {
      onUpdateProfile(p);
    }
    setEditingProfileId(p.id);
    setStatusMsg({
      text: `สลับมาใช้งานโปรไฟล์ "${p.name}" สำเร็จ! ข้อมูลทั้งระบบได้รับการปรับตามโปรไฟล์นี้แล้ว`,
      type: 'success',
    });
    confetti({ particleCount: 30, spread: 45, origin: { y: 0.7 } });
  };

  // 5. EDIT ACTION FROM DIRECTORY
  const handleTriggerEditFromDirectory = (p: UserProfile) => {
    setEditingProfileId(p.id);
    setActiveSubTab('identity');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Perform Google Sheet Sync (Single Profile)
  const executeSyncToSheet = async () => {
    setShowConfirmModal(false);
    setIsSyncing(true);
    setStatusMsg({ text: 'กำลังเชื่อมต่อและบันทึกข้อมูลเข้าสู่ Google Sheets...', type: 'info' });

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
            text: `กรุณาอนุญาตลงชื่อเข้าใช้ Google: ${authErr.message || 'ยกเลิกการเข้าสู่ระบบ'}`,
            type: 'error',
          });
          return;
        }
      }

      const updatedProfile = getUpdatedProfileObj();
      onUpdateProfile(updatedProfile);

      const result = await saveProfileToGoogleSheet(
        TARGET_SPREADSHEET_ID,
        updatedProfile,
        points,
        completedModulesCount,
        badges,
        activeUser?.email || profile.contactEmail || ''
      );

      const nowTime = new Date().toLocaleTimeString('th-TH');
      setLastSyncTime(nowTime);

      setStatusMsg({
        text: `บันทึกข้อมูล "${updatedProfile.name}" ลงใน Google Sheet ID: ${TARGET_SPREADSHEET_ID} สำเร็จเรียบร้อย! (${result.sheetTitle})`,
        type: 'success',
      });
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });

      // Refresh live preview table if logged in
      setTimeout(() => {
        loadSheetData();
      }, 800);
    } catch (err: any) {
      console.error(err);
      setStatusMsg({
        text: `เกิดข้อผิดพลาดในการบันทึก: ${err.message || 'โปรดตรวจสอบการเชื่อมต่อ'}`,
        type: 'error',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Perform Batch Google Sheet Sync (All Profiles)
  const executeBatchSyncToSheet = async () => {
    setIsBatchSyncing(true);
    setStatusMsg({ text: `กำลังเตรียมบันทึกข้อมูลโปรไฟล์ทั้งหมด (${profiles.length} คน) ลงสู่ Google Sheets...`, type: 'info' });

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
            text: `กรุณาลงชื่อเข้าใช้ด้วย Google เพื่อส่งข้อมูลลง Google Sheet: ${authErr.message || 'ยกเลิกการเข้าสู่ระบบ'}`,
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

      const nowTime = new Date().toLocaleTimeString('th-TH');
      setLastSyncTime(nowTime);

      setStatusMsg({
        text: `บันทึกข้อมูลโปรไฟล์ทั้งหมด ${result.count} คน ลงใน Google Sheet ID: ${TARGET_SPREADSHEET_ID} สำเร็จเรียบร้อย! (${nowTime})`,
        type: 'success',
      });
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });

      setTimeout(() => {
        loadSheetData();
      }, 800);
    } catch (err: any) {
      console.error(err);
      setStatusMsg({
        text: `เกิดข้อผิดพลาดในการบันทึกหมู่: ${err.message || 'โปรดลองใหม่อีกครั้ง'}`,
        type: 'error',
      });
    } finally {
      setIsBatchSyncing(false);
    }
  };

  // Load Sheet rows
  const loadSheetData = async () => {
    if (!currentUser) return;
    setIsLoadingSheetData(true);
    try {
      const data = await readProfilesFromGoogleSheet(TARGET_SPREADSHEET_ID);
      setSheetRows(data.rows);
      setSheetTabName(data.sheetTitle);
    } catch (err: any) {
      console.warn('Load sheet data error:', err);
    } finally {
      setIsLoadingSheetData(false);
    }
  };

  // Export JSON
  const handleExportProfile = () => {
    const exportData = {
      profile: getUpdatedProfileObj(),
      allProfiles: profiles,
      points,
      badges,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `coderkids_profiles_backup_${Date.now()}.json`);
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
          setStudentId(imported.profile.studentId || 'CK-2569-042');
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

  // Filtered profiles for Directory tab
  const filteredProfiles = profiles.filter((p) => {
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
  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;
  const isEffectiveAdmin = isAdmin || profile.role === 'admin';

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header with Title & Top Summary */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Coder Kids · Profile Management Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            ระบบจัดการโปรไฟล์ผู้เรียน
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            จัดการโปรไฟล์ เพิ่ม ลบ แก้ไขข้อมูลผู้เรียน สลับใช้งานโปรไฟล์ในชั้นเรียน และบันทึกข้อมูลการเรียนรู้อย่างปลอดภัย
          </p>

          {/* Sheet ID & Link: แสดงเฉพาะผู้ดูแลระบบ (Admin) เท่านั้น ซ่อนจากสมาชิกและบุคคลทั่วไป */}
          {isEffectiveAdmin ? (
            <div className="flex flex-wrap items-center gap-2 pt-1.5">
              <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                🛡️ โหมดผู้ดูแลระบบ (Admin):
              </span>
              <span className="text-xs text-slate-600 font-medium">กูเกิลชีตไอดี:</span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-mono font-bold select-all">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{TARGET_SPREADSHEET_ID}</span>
              </div>
              <a
                href={spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:text-emerald-900 underline text-xs font-semibold flex items-center gap-0.5"
              >
                <span>เปิดดูชีต</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-2 pt-1.5 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                ระบบฐานข้อมูลคลาวด์โรงเรียน: ปลอดภัยตามมาตรฐาน PDPA (ข้อมูลถูกซิงก์อัตโนมัติ ไม่เปิดเผยไอดีชีตแก่สาธารณะ)
              </span>
            </div>
          )}
        </div>

        {/* Quick Current Profile Pill & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Admin Switcher */}
          {onToggleAdmin && (
            <button
              type="button"
              onClick={() => onToggleAdmin(!isEffectiveAdmin)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                isEffectiveAdmin
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title={isEffectiveAdmin ? 'คลิกเพื่อกลับสู่โหมดสมาชิก' : 'คลิกเพื่อเข้าสู่โหมดผู้ดูแลระบบ'}
            >
              {isEffectiveAdmin ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-100" />
                  <span>ผู้ดูแลระบบ</span>
                </>
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>โหมดสมาชิก</span>
                </>
              )}
            </button>
          )}

          {/* Active Profile Status Badge */}
          <div className="px-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
            <span className="text-2xl">{profile.avatarEmoji || '🐱'}</span>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {profile.name} {profile.nickname ? `(${profile.nickname})` : ''}
                </span>
                <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">
                  ใช้งานอยู่
                </span>
              </div>
              <div className="text-[11px] text-indigo-600 font-medium">
                LV.{userLevel} · {points} แต้ม · {profile.studentId || 'CK-2569-4102'}
              </div>
            </div>
          </div>

          {/* "+ เพิ่มโปรไฟล์" Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ เพิ่มโปรไฟล์ใหม่</span>
          </button>

          {/* Open Google Sheet Link: แสดงเฉพาะ Admin เท่านั้น */}
          {isEffectiveAdmin && (
            <a
              href={spreadsheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold transition-colors shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Google Sheet</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
            </a>
          )}
        </div>
      </div>

      {/* 2. Top Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl max-w-4xl">
        <button
          onClick={() => setActiveSubTab('directory')}
          className={`flex-1 min-w-[150px] py-2.5 px-4 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
            activeSubTab === 'directory'
              ? 'bg-white text-indigo-700 shadow-sm font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>1. จัดการโปรไฟล์ ({profiles.length} คน)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('identity')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
            activeSubTab === 'identity'
              ? 'bg-white text-indigo-700 shadow-sm font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>2. แก้ไขข้อมูล &amp; อวตาร</span>
        </button>

        <button
          onClick={() => setActiveSubTab('card')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
            activeSubTab === 'card'
              ? 'bg-white text-indigo-700 shadow-sm font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <IdCard className="w-4 h-4" />
          <span>3. บัตรนักเรียนดิจิทัล</span>
        </button>

        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
            activeSubTab === 'analytics'
              ? 'bg-white text-indigo-700 shadow-sm font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>4. สถิติ &amp; เหรียญตรา ({unlockedBadgesCount})</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('sync');
            if (currentUser && sheetRows.length === 0) loadSheetData();
          }}
          className={`flex-1 min-w-[150px] py-2.5 px-4 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
            activeSubTab === 'sync'
              ? 'bg-white text-emerald-700 shadow-sm font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>5. ซิงก์กูเกิลชีต &amp; สำรองข้อมูล</span>
        </button>
      </div>

      {/* Status Feedback Banner */}
      {statusMsg && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-medium border flex items-center justify-between shadow-sm transition-all ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : statusMsg.type === 'error'
              ? 'bg-rose-50 border-rose-300 text-rose-900'
              : 'bg-indigo-50 border-indigo-300 text-indigo-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : statusMsg.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
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

      {/* ------------------- TAB 1: PROFILES DIRECTORY (เพิ่ม / ลบ / แก้ไข / สลับ) ------------------- */}
      {activeSubTab === 'directory' && (
        <div className="space-y-6">
          {/* Top Bar: Summary, Search, Filter & Actions */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <span>รายชื่อโปรไฟล์ผู้เรียนในระบบ ({profiles.length} คน)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  คุณสามารถเพิ่มโปรไฟล์นักเรียนใหม่ แก้ไขข้อมูล ลบโปรไฟล์ และสลับเลือกโปรไฟล์เพื่อเข้าเรียนรู้ได้ทันที
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ เพิ่มโปรไฟล์ใหม่</span>
                </button>

                <button
                  onClick={executeBatchSyncToSheet}
                  disabled={isBatchSyncing}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
                  title="บันทึกข้อมูลโปรไฟล์ทั้งหมดลง Google Sheets"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{isBatchSyncing ? 'กำลังบันทึก...' : `ซิงก์ทุกโปรไฟล์ (${profiles.length} คน)`}</span>
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาชื่อ, ชื่อเล่น หรือรหัสนักเรียน..."
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              {/* Level Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-slate-400" /> ระดับ:
                </span>
                {(['ALL', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setLevelFilter(lvl)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      levelFilter === lvl
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {lvl === 'ALL' && 'ทั้งหมด'}
                    {lvl === 'Beginner' && '🌱 เริ่มต้น'}
                    {lvl === 'Intermediate' && '🚀 ปานกลาง'}
                    {lvl === 'Advanced' && '⭐ ขั้นสูง'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Profiles Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProfiles.map((p, idx) => {
              const isActive = profile.id === p.id || (!profile.id && idx === 0);
              const pAvatar = AVATAR_OPTIONS.find((a) => a.id === p.avatarId) || AVATAR_OPTIONS[0];
              const pTheme = PROFILE_THEMES.find((t) => t.id === p.themeColor) || PROFILE_THEMES[0];

              return (
                <div
                  key={p.id || idx}
                  className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md ${
                    isActive
                      ? 'border-indigo-500 ring-2 ring-indigo-500/30'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Card Header Strip */}
                  <div className={`p-4 bg-gradient-to-r ${pTheme.bgGrad} text-white flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl ${pAvatar.color} flex items-center justify-center text-2xl shadow ring-2 ring-white/20`}>
                        {pAvatar.emoji}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white truncate">
                          {p.name} {p.nickname ? `(${p.nickname})` : ''}
                        </div>
                        <div className="text-[11px] text-indigo-200 font-mono truncate">
                          {p.studentId || 'CK-2569-042'}
                        </div>
                      </div>
                    </div>

                    {isActive ? (
                      <span className="px-2.5 py-1 bg-emerald-400 text-slate-950 rounded-full text-[10px] font-black uppercase tracking-wider shadow">
                        ใช้งานอยู่
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSwitchProfile(p)}
                        className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-[10px] font-semibold transition-colors"
                        title="สลับมาใช้งานโปรไฟล์นี้"
                      >
                        สลับใช้งาน
                      </button>
                    )}
                  </div>

                  {/* Card Body Details */}
                  <div className="p-5 space-y-3.5 flex-1 text-xs">
                    <div className="space-y-1">
                      <div className="text-slate-800 font-semibold truncate">
                        {p.selectedTitle || 'นักประดิษฐ์รุ่นเยาว์'}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {p.school} · {p.grade}
                      </div>
                    </div>

                    {/* Bio or Motto */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 text-[11px] line-clamp-2 italic">
                      &ldquo;{p.bio || p.motto || 'เรียนรู้วิทยาการคำนวณอย่างสนุกสนาน'}&rdquo;
                    </div>

                    {/* Coding Level & Interests */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-[10px] border border-indigo-100">
                        {p.codingLevel === 'Beginner' && '🌱 เริ่มต้น'}
                        {p.codingLevel === 'Intermediate' && '🚀 ปานกลาง'}
                        {p.codingLevel === 'Advanced' && '⭐ ขั้นสูง'}
                        {!p.codingLevel && '🚀 ปานกลาง'}
                      </span>

                      {p.techInterests && p.techInterests.slice(0, 2).map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Actions Footer: Edit, Switch, Delete */}
                  <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleTriggerEditFromDirectory(p)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors shadow-xs"
                        title="แก้ไขข้อมูลโปรไฟล์นี้"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>แก้ไข</span>
                      </button>

                      {/* Sync to Sheet for this profile */}
                      <button
                        onClick={() => {
                          setEditingProfileId(p.id);
                          setShowConfirmModal(true);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold transition-colors"
                        title="บันทึกข้อมูลคนนี้ลง Google Sheets"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="hidden sm:inline">ชีต</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Activate Button if not active */}
                      {!isActive ? (
                        <button
                          onClick={() => handleSwitchProfile(p)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs"
                        >
                          เลือกใช้งาน
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 px-2 py-1">
                          <Check className="w-3.5 h-3.5" /> ใช้งานอยู่
                        </span>
                      )}

                      {/* Delete Button */}
                      <button
                        onClick={() => setProfileToDelete(p)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="ลบโปรไฟล์นี้"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty Search State */}
          {filteredProfiles.length === 0 && (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <User className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">ไม่พบโปรไฟล์ที่ตรงกับคำค้นหา</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                ลองตรวจสอบตัวสะกด หรือคลิกปุ่ม &quot;+ เพิ่มโปรไฟล์ใหม่&quot; เพื่อสร้างโปรไฟล์นักเรียนคนใหม่เข้าสู่ระบบ
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setLevelFilter('ALL');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                ล้างการค้นหา
              </button>
            </div>
          )}

          {/* Quick Classroom Helper Card */}
          <div className="p-5 rounded-3xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-indigo-950">คำแนะนำสำหรับคุณครูและผู้ดูแลห้องเรียน</h4>
                <p className="text-[11px] text-indigo-700">
                  คุณครูสามารถเพิ่มรายชื่อนักเรียนในชั้นเรียนได้ไม่จำกัด เมื่อนักเรียนแต่ละคนใช้งาน สามารถสลับโปรไฟล์เพื่อบันทึกผลงานลงใน Google Sheets ได้อย่างเป็นระเบียบ
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold whitespace-nowrap shadow-sm"
            >
              + เพิ่มนักเรียนคนถัดไป
            </button>
          </div>
        </div>
      )}

      {/* ------------------- TAB 2: IDENTITY & AVATAR EDITOR ------------------- */}
      {activeSubTab === 'identity' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Profile Settings */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-indigo-600" />
                  <span>ฟอร์มปรับแต่งข้อมูลและแก้ไขโปรไฟล์</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  แก้ไขข้อมูล ชื่อ อวตาร และบันทึกผลไปยังโปรไฟล์ที่เลือก
                </p>
              </div>

              {/* Profile Selector Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap">เลือกแก้ไข:</span>
                <select
                  value={editingProfileId}
                  onChange={(e) => setEditingProfileId(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                >
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.avatarEmoji} {p.name} {p.nickname ? `(${p.nickname})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <form onSubmit={handleSaveLocal} className="space-y-5 text-xs sm:text-sm">
              {/* 1. Categorized Avatar Picker & Custom Creator */}
              <div>
                <label className="block font-semibold text-slate-800 mb-2">
                  1. สัญลักษณ์อวตารผู้เรียน (เลือกตามหมวดหมู่วิทยาการคำนวณ หรือสร้างเองได้)
                </label>
                <CategorizedAvatarSelector
                  selectedAvatarId={selectedAvatarId}
                  selectedAvatarEmoji={selectedAvatarEmoji}
                  onSelectAvatar={(payload: AvatarSelectionPayload) => {
                    setSelectedAvatarId(payload.avatarId);
                    if (payload.avatarEmoji) setSelectedAvatarEmoji(payload.avatarEmoji);
                  }}
                />
              </div>

              {/* 2. Theme Color Selector */}
              <div>
                <label className="block font-semibold text-slate-800 mb-2">
                  2. ธีมสีการ์ดโปรไฟล์
                </label>
                <div className="flex flex-wrap gap-2">
                  {PROFILE_THEMES.map((th) => (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => setThemeColor(th.id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
                        themeColor === th.id
                          ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${th.accent}`} />
                      <span>{th.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Role Selector (นักเรียน / คุณครู / ผู้ดูแลระบบ) */}
              <div>
                <label className="block font-medium text-slate-700 mb-1.5">บทบาทในระบบ (Role)</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { key: 'student', label: '🎒 นักเรียน / สมาชิก', desc: 'ซ่อนไอดีชีต ปลอดภัย' },
                    { key: 'teacher', label: '👨‍🏫 คุณครูผู้สอน', desc: 'สร้างห้องเรียน จัดการงาน' },
                    { key: 'admin', label: '🛡️ ผู้ดูแลระบบ (Admin)', desc: 'จัดการ Google Sheets' },
                  ].map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setRole(r.key as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        role === r.key
                          ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">{r.label}</div>
                      <div className="text-[10px] text-slate-500">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Name, Nickname */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">ชื่อ-นามสกุล *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="เช่น กวินท์ พงษ์สถิตย์"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">ชื่อเล่น</label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="เช่น วิน"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Student ID & Grade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-medium text-slate-700">รหัสประจำตัวผู้เรียน</label>
                    <span className="text-[10px] text-slate-400 font-medium">ระบบสร้างให้อัตโนมัติ ห้ามแก้ไข</span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={studentId}
                      className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono text-slate-600 cursor-not-allowed select-all font-bold"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">ระดับชั้น / ห้องเรียน *</label>
                  <input
                    type="text"
                    required
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="เช่น ประถมศึกษาปีที่ 4/1"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* School & Selected Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">โรงเรียน / สถาบันการศึกษา *</label>
                  <input
                    type="text"
                    required
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="เช่น โรงเรียนอนุบาลนราธิวาส"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">ฉายาเกียรติยศ (Title)</label>
                  <input
                    type="text"
                    value={selectedTitle}
                    onChange={(e) => setSelectedTitle(e.target.value)}
                    placeholder="เช่น นักประดิษฐ์รุ่นเยาว์ (Junior Innovator)"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Coding Experience Level */}
              <div>
                <label className="block font-medium text-slate-700 mb-1.5">ระดับประสบการณ์โค้ดดิ้ง</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setCodingLevel(lvl)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                        codingLevel === lvl
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {lvl === 'Beginner' && '🌱 เริ่มต้น (Beginner)'}
                      {lvl === 'Intermediate' && '🚀 ปานกลาง (Intermediate)'}
                      {lvl === 'Advanced' && '⭐ ขั้นสูง (Advanced)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tech Interests Tags */}
              <div>
                <label className="block font-medium text-slate-700 mb-1.5">
                  ความสนใจด้านเทคโนโลยี (เลือกได้สูงสุด 5 เรื่อง)
                </label>
                <div className="flex flex-wrap gap-2">
                  {TECH_INTERESTS_AVAILABLE.map((interest) => {
                    const isSelected = techInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-300 ring-1 ring-indigo-400'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bio & Motto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">คำแนะนำตัว (Bio)</label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="เขียนเป้าหมายในการเรียนโค้ดดิ้ง..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">คติประจำใจ (Motto)</label>
                  <textarea
                    rows={2}
                    value={motto}
                    onChange={(e) => setMotto(e.target.value)}
                    placeholder="เช่น เขียนโค้ดวันละนิด บั๊กหายวับ!"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Email & Scratch/GitHub link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">อีเมลติดต่อสำหรับรับข่าวสาร</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="student@school.ac.th"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">บัญชี Scratch หรือ GitHub (ถ้ามี)</label>
                  <input
                    type="text"
                    value={githubOrScratch}
                    onChange={(e) => setGithubOrScratch(e.target.value)}
                    placeholder="scratch.mit.edu/users/..."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>บันทึกการแก้ไขโปรไฟล์นี้</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>+ สร้างโปรไฟล์ใหม่</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleSaveLocal();
                      if (!currentUser) {
                        setActiveSubTab('sync');
                        setStatusMsg({ text: 'กรุณาลงชื่อเข้าใช้ด้วย Google ในแท็บที่ 5 เพื่อส่งข้อมูลสู่ Google Sheets', type: 'info' });
                      } else {
                        setShowConfirmModal(true);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-sm"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>บันทึก &amp; ซิงก์สู่ Google Sheets</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Right: Live Preview Card & Profile Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>ตัวอย่างการแสดงผลบัตรโปรไฟล์ (Live Preview)</span>
              <span className="text-indigo-600 font-normal">อัปเดตแบบเรียลไทม์</span>
            </div>

            {/* Live Profile Card */}
            <div className={`p-6 sm:p-7 rounded-3xl bg-gradient-to-br ${currentTheme.bgGrad} text-white shadow-xl space-y-5 relative overflow-hidden border border-white/10`}>
              <div className="relative z-10 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-18 h-18 rounded-2xl ${currentAvatar.color} flex items-center justify-center text-3xl shadow-xl ring-4 ring-white/20`}
                    >
                      {currentAvatar.emoji}
                    </div>
                    <div className="min-w-0">
                      <div className="text-lg font-bold text-white truncate">
                        {name || 'ชื่อผู้เรียน'} {nickname ? `(${nickname})` : ''}
                      </div>
                      <div className="text-xs text-indigo-200 font-medium truncate mt-0.5">
                        {selectedTitle}
                      </div>
                      <div className="text-[11px] text-slate-300 truncate mt-0.5 font-mono">
                        {studentId} · {grade || 'ชั้นเรียน'}
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
                      💡 คติประจำใจ: {motto}
                    </div>
                  )}
                </div>

                {/* Tech Interests Tags */}
                {techInterests.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {techInterests.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-white/10 border border-white/10 text-[10px] text-slate-200"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Level Progress Bar */}
                <div className="pt-2 border-t border-white/10 space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span>ความก้าวหน้าสู่เลเวล {userLevel + 1}</span>
                    <span className="font-mono tabular-nums text-amber-300 font-semibold">{points} / {nextLevelMin} XP</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-300"
                      style={{ width: `${levelProgress}%` }}
                    />
                  </div>
                </div>

                {/* Metric Strip */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center text-xs">
                  <div className="p-2 rounded-xl bg-white/5">
                    <div className="font-mono font-bold text-amber-300 text-sm">{points}</div>
                    <div className="text-[10px] text-slate-400">แต้มสะสม</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <div className="font-mono font-bold text-orange-300 text-sm">{profile.streakDays || 1} วัน</div>
                    <div className="text-[10px] text-slate-400">Streak ต่อเนื่อง</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <div className="font-mono font-bold text-emerald-300 text-sm">{completedModulesCount}/4</div>
                    <div className="text-[10px] text-slate-400">โมดูลที่สำเร็จ</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Switch to Digital ID Card */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <IdCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">บัตรประจำตัวนักเรียนโค้ดเดอร์</h4>
                    <p className="text-[11px] text-slate-500">สามารถสั่งพิมพ์หรือบันทึกภาพเก็บไว้ได้</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveSubTab('card')}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                >
                  ดูบัตรนักเรียน
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------- TAB 3: DIGITAL CODER PASS (STUDENT SMART CARD) ------------------- */}
      {activeSubTab === 'card' && (
        <div className="space-y-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">บัตรประจำตัวนักเรียนโค้ดเดอร์ (Digital Coder Pass)</h3>
                <p className="text-xs text-slate-500">บัตรประจำตัวดิจิทัลสำหรับนักเรียนในหลักสูตรวิทยาการคำนวณ</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>พิมพ์บัตร (Print)</span>
                </button>
              </div>
            </div>

            {/* The Printable Student Smart Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-7 sm:p-8 shadow-2xl border-2 border-indigo-500/30">
              {/* Card Hologram Effect Background */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                {/* Card Top Strip: Institute & Standard */}
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
                    ACTIVE LEARNER
                  </span>
                </div>

                {/* Card Body: Avatar & Student Details */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {/* Photo / Avatar Box */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-24 h-24 rounded-2xl ${currentAvatar.color} flex items-center justify-center text-5xl shadow-2xl ring-4 ring-white/20`}
                    >
                      {currentAvatar.emoji}
                    </div>
                    <span className="mt-2 text-[10px] font-mono text-indigo-300">
                      ID: {studentId}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div>
                      <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        {name || 'กวินท์ พงษ์สถิตย์'}
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
                        <div className="col-span-2 truncate text-[11px] text-slate-400">
                          {contactEmail}
                        </div>
                      )}
                    </div>

                    {/* Tech Interests on Card */}
                    {techInterests.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1 justify-center sm:justify-start">
                        {techInterests.slice(0, 4).map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-slate-200"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Bottom: QR Code mockup & Barcode */}
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
                  <div className="flex items-center gap-3">
                    {/* Simulated QR Code box */}
                    <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
                      <div className="w-full h-full bg-slate-900 rounded grid grid-cols-3 gap-0.5 p-0.5">
                        <div className="bg-white rounded-xs" />
                        <div className="bg-slate-900" />
                        <div className="bg-white rounded-xs" />
                        <div className="bg-slate-900" />
                        <div className="bg-white rounded-xs" />
                        <div className="bg-slate-900" />
                        <div className="bg-white rounded-xs" />
                        <div className="bg-white rounded-xs" />
                        <div className="bg-slate-900" />
                        <div className="bg-white rounded-xs" />
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                        VERIFIED COMPUTING CREDENTIAL
                      </div>
                      <div className="text-xs text-slate-200 font-mono">
                        เข้าร่วมเมื่อ: {profile.joinedDate}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyStudentId}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-mono transition-colors"
                      title="คัดลอกรหัสประจำตัว"
                    >
                      {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId ? 'คัดลอกแล้ว' : studentId}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------- TAB 4: ACHIEVEMENTS & ANALYTICS ------------------- */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          {/* Top 4 Stats */}
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
              <div className="text-[11px] text-slate-400 mt-1">ใช้แลกฉายาและรางวัลในร้านค้าได้</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>เรียนต่อเนื่อง (Streak)</span>
                <Flame className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-2xl font-black text-orange-600 font-mono">{profile.streakDays || 1} วัน</div>
              <div className="text-[11px] text-slate-400 mt-1">เข้าเรียนสม่ำเสมอสร้างนิสัยนักพัฒนา</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>เหรียญเกียรติยศ</span>
                <Star className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-black text-purple-700 font-mono">{unlockedBadgesCount} / {badges.length}</div>
              <div className="text-[11px] text-slate-400 mt-1">ปลดล็อกแล้ว {Math.round((unlockedBadgesCount / badges.length) * 100)}%</div>
            </div>
          </div>

          {/* Badges Collection Grid */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">ตู้สะสมเหรียญตราเกียรติยศ (Badges Trophy Case)</h3>
                <p className="text-xs text-slate-500">เหรียญตราที่ได้รับจากการทำภารกิจในแต่ละบทเรียน</p>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                ปลดล็อกแล้ว {unlockedBadgesCount} จาก {badges.length} เหรียญ
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all ${
                    b.unlocked
                      ? 'bg-amber-50/50 border-amber-200 shadow-sm text-slate-900'
                      : 'bg-slate-50/70 border-slate-200 text-slate-400 opacity-60'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg shrink-0 ${
                      b.unlocked
                        ? 'bg-amber-400 text-amber-950 font-bold shadow-md ring-2 ring-amber-300'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {b.unlocked ? '🏅' : '🔒'}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold truncate">{b.title}</h4>
                      {b.unlocked && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-100 font-semibold px-1.5 py-0.2 rounded shrink-0">
                          สำเร็จ
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-1 line-clamp-2">
                      {b.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------- TAB 5: GOOGLE SHEETS SYNC & BACKUP ------------------- */}
      {activeSubTab === 'sync' && (
        <div className="space-y-6">
          {/* Google Apps Script Backend Export Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-xl border border-indigo-800/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/30">
                  <Code2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      ส่งออกไฟล์พัฒนาต่อบน Google Apps Script (GAS)
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                      Code.gs &amp; Index.html
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                    ดาวน์โหลดชุดไฟล์สำหรับนำไปวางใน Extensions &gt; Apps Script บน Google Sheets เพื่อติดตั้งเป็น Web App อิสระ พร้อมระบบจัดการฐานข้อมูลอัตโนมัติ
                  </p>
                </div>
              </div>

              {onOpenGasExport && (
                <button
                  type="button"
                  onClick={onOpenGasExport}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>เปิดหน้าต่างส่งออกไฟล์</span>
                </button>
              )}
            </div>
          </div>

          {/* Google Auth Status Box */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {currentUser ? (
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xl shadow">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || ''}
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  ) : (
                    'G'
                  )}
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    {currentUser ? currentUser.displayName || 'ผู้ใช้ Google' : 'ยังไม่ได้เชื่อมต่อบัญชี Google'}
                  </span>
                  {currentUser ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> เชื่อมต่อแล้ว
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-200 px-2.5 py-0.5 rounded-full">
                      พร้อมเชื่อมต่อ
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {currentUser
                    ? `อีเมล: ${currentUser.email} · พร้อมบันทึกโปรไฟล์สู่ฐานข้อมูลคลาวด์โรงเรียน`
                    : `ลงชื่อเข้าใช้ด้วยบัญชี Google เพื่อเชื่อมต่อฐานข้อมูลคลาวด์`}
                  {isEffectiveAdmin && (
                    <span className="block text-emerald-700 font-mono text-[11px] font-bold mt-0.5">
                      (กูเกิลชีตไอดี แอดมิน: {TARGET_SPREADSHEET_ID})
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {currentUser ? (
                <>
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-sm active:scale-95 disabled:opacity-50"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>{isSyncing ? 'กำลังบันทึกลงชีต...' : 'บันทึกโปรไฟล์นี้'}</span>
                  </button>

                  <button
                    onClick={executeBatchSyncToSheet}
                    disabled={isBatchSyncing}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-sm active:scale-95 disabled:opacity-50"
                  >
                    <Users className="w-4 h-4" />
                    <span>{isBatchSyncing ? 'กำลังบันทึกหมู่...' : `บันทึกทุกโปรไฟล์ (${profiles.length})`}</span>
                  </button>

                  <button
                    onClick={handleGoogleLogout}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:text-rose-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>ออกจากระบบ</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>{isLoggingIn ? 'กำลังเชื่อมต่อ Google...' : 'ลงชื่อเข้าใช้ด้วย Google'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Backup & Export / Import Tools */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">ส่งออกข้อมูลโปรไฟล์ทั้งหมด (Export JSON)</h4>
                <p className="text-[11px] text-slate-500">บันทึกไฟล์สำรองข้อมูล {profiles.length} โปรไฟล์ลงในเครื่อง</p>
              </div>
              <button
                onClick={handleExportProfile}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ส่งออก</span>
              </button>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">นำเข้าข้อมูลโปรไฟล์ (Import JSON)</h4>
                <p className="text-[11px] text-slate-500">กู้คืนโปรไฟล์จากไฟล์ JSON ที่เคยสำรองไว้</p>
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>นำเข้า</span>
                </button>
              </div>
            </div>
          </div>

          {/* Member Security Notice vs Admin Google Sheet Live Table Preview */}
          {!isEffectiveAdmin ? (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto text-xl shadow-xs">
                🔒
              </div>
              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  ระบบรักษาความปลอดภัยข้อมูลส่วนบุคคล (PDPA Compliant)
                </h4>
                <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
                  กูเกิลชีตไอดีและลิงก์แผ่นงาน Google Sheets สงวนสิทธิ์การเข้าถึงเฉพาะคุณครูและผู้ดูแลระบบ (Admin) เท่านั้น สมาชิกและบุคคลทั่วไปข้อมูลจะถูกบันทึกและซิงก์สู่ระบบคลาวด์ของโรงเรียนอย่างปลอดภัย
                </p>
              </div>

              {onToggleAdmin && (
                <button
                  type="button"
                  onClick={() => onToggleAdmin(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>สลับเป็นโหมดผู้ดูแลระบบ (Admin) เพื่อดูแผ่นงานชีต</span>
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>ตารางแสดงข้อมูลใน Google Sheets</span>
                    {sheetTabName && (
                      <span className="text-xs text-slate-400 font-normal">({sheetTabName})</span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    ID: {TARGET_SPREADSHEET_ID}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={loadSheetData}
                    disabled={isLoadingSheetData || !currentUser}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSheetData ? 'animate-spin' : ''}`} />
                    <span>รีเฟรชข้อมูล</span>
                  </button>

                  <a
                    href={spreadsheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    <span>เปิด Google Sheets</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            {/* Table display */}
            <div className="overflow-x-auto max-h-72 border border-slate-100 rounded-2xl">
              {sheetRows.length > 0 ? (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 sticky top-0 border-b border-slate-200">
                    <tr>
                      {sheetRows[0]?.map((header, i) => (
                        <th key={i} className="px-3.5 py-2.5 font-bold whitespace-nowrap">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sheetRows.slice(1).map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/70">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-3.5 py-2 whitespace-nowrap text-slate-600 max-w-[200px] truncate">
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
                  <div>
                    {currentUser
                      ? 'คลิกปุ่ม "รีเฟรชข้อมูล" เพื่อดึงข้อมูลล่าสุดจาก Google Sheets'
                      : 'กรุณาลงชื่อเข้าใช้ Google เพื่อดูข้อมูลในตาราง'}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )}

      {/* ------------------- MODAL: ADD NEW PROFILE (+ เพิ่มโปรไฟล์ใหม่) ------------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    เพิ่มโปรไฟล์ผู้เรียนใหม่ (Add Student Profile)
                  </h3>
                  <p className="text-xs text-slate-500">
                    กรอกข้อมูลนักเรียน หรือเลือกจากแม่แบบด่วนเพื่อความสะดวก
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Quick Presets Strip */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>หรือเลือกสร้างจากแม่แบบนักเรียนด่วน (Quick Presets):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESET_STUDENT_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.name}
                    type="button"
                    onClick={() => applyPresetTemplate(tpl)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/50 text-left transition-all flex items-center gap-2.5 text-xs"
                  >
                    <span className="text-xl">{tpl.avatarEmoji}</span>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">{tpl.name} ({tpl.nickname})</div>
                      <div className="text-[10px] text-slate-500 truncate">{tpl.selectedTitle}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Add Form */}
            <form onSubmit={handleCreateProfile} className="space-y-4 text-xs sm:text-sm">
              {/* Avatar Selector */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1.5">
                  เลือกอวตารผู้เรียน (เลือกตามหมวดหมู่วิทยาการคำนวณ หรือสร้างเองได้)
                </label>
                <CategorizedAvatarSelector
                  selectedAvatarId={newAvatarId}
                  selectedAvatarEmoji={newAvatarEmoji}
                  onSelectAvatar={(payload: AvatarSelectionPayload) => {
                    setNewAvatarId(payload.avatarId);
                    if (payload.avatarEmoji) setNewAvatarEmoji(payload.avatarEmoji);
                  }}
                />
              </div>

              {/* Name & Nickname */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">ชื่อ-นามสกุล *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="เช่น ด.ช. กิตติภพ สุริยวงศ์"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">ชื่อเล่น</label>
                  <input
                    type="text"
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    placeholder="เช่น ภพ"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Student ID & Grade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-medium text-slate-700">รหัสนักเรียน (สร้างอัตโนมัติ)</label>
                    <button
                      type="button"
                      onClick={() => setNewStudentId(`CK-2569-${Math.floor(1000 + Math.random() * 9000)}`)}
                      className="inline-flex items-center gap-1 text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      <Shuffle className="w-3 h-3" />
                      <span>สุ่มรหัสใหม่</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={newStudentId}
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono text-slate-700 cursor-not-allowed select-all font-bold"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">ระดับชั้น / ห้องเรียน</label>
                  <input
                    type="text"
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    placeholder="เช่น ประถมศึกษาปีที่ 4/1"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* School & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">โรงเรียน / สถาบัน</label>
                  <input
                    type="text"
                    value={newSchool}
                    onChange={(e) => setNewSchool(e.target.value)}
                    placeholder="เช่น โรงเรียนอนุบาลนราธิวาส"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">ฉายาที่เลือก</label>
                  <input
                    type="text"
                    value={newSelectedTitle}
                    onChange={(e) => setNewSelectedTitle(e.target.value)}
                    placeholder="เช่น นักประดิษฐ์รุ่นเยาว์"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Coding Level */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">ระดับประสบการณ์โค้ดดิ้ง</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setNewCodingLevel(lvl)}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        newCodingLevel === lvl
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {lvl === 'Beginner' && '🌱 เริ่มต้น'}
                      {lvl === 'Intermediate' && '🚀 ปานกลาง'}
                      {lvl === 'Advanced' && '⭐ ขั้นสูง'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bio & Motto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">คำแนะนำตัว (Bio)</label>
                  <textarea
                    rows={2}
                    value={newBio}
                    onChange={(e) => setNewBio(e.target.value)}
                    placeholder="ความสนใจในการเรียน..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">คติประจำใจ (Motto)</label>
                  <textarea
                    rows={2}
                    value={newMotto}
                    onChange={(e) => setNewMotto(e.target.value)}
                    placeholder="คำคมที่ชอบ..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs"
                  />
                </div>
              </div>

              {/* Make active checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={makeNewActiveImmediately}
                    onChange={(e) => setMakeNewActiveImmediately(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <span>ตั้งเป็นโปรไฟล์ที่กำลังใช้งานในระบบทันที (Set as Active Profile)</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  ยกเลิก
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>บันทึกและสร้างโปรไฟล์</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------- MODAL: DELETE CONFIRMATION (ลบโปรไฟล์) ------------------- */}
      {profileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  ยืนยันการลบโปรไฟล์ผู้เรียน?
                </h3>
                <p className="text-xs text-slate-500">
                  การกระทำนี้จะลบข้อมูลโปรไฟล์ออกจากระบบ
                </p>
              </div>
            </div>

            {/* Profile to delete preview */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3.5">
              <span className="text-3xl">{profileToDelete.avatarEmoji || '🐱'}</span>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-900 truncate">
                  {profileToDelete.name} {profileToDelete.nickname ? `(${profileToDelete.nickname})` : ''}
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  รหัส: {profileToDelete.studentId || 'CK-2569-042'} · {profileToDelete.grade}
                </div>
              </div>
            </div>

            {profiles.length <= 1 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  ไม่สามารถลบได้: ระบบต้องมีโปรไฟล์อย่างน้อย 1 รายการเพื่อใช้งาน กรุณาสร้างโปรไฟล์อื่นก่อนจึงจะสามารถลบโปรไฟล์นี้ได้
                </span>
              </div>
            ) : (
              <p className="text-xs text-slate-600">
                {profile.id === profileToDelete.id
                  ? '⚠️ โปรไฟล์นี้กำลังใช้งานอยู่ หากลบระบบจะสลับไปยังโปรไฟล์อื่นที่มีในระบบให้อัตโนมัติ'
                  : 'คุณแน่ใจหรือไม่ว่าต้องการลบโปรไฟล์นี้ออกจากรายการ?'}
              </p>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setProfileToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                ยกเลิก
              </button>

              <button
                type="button"
                disabled={profiles.length <= 1}
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ยืนยันการลบโปรไฟล์</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------- MODAL: SAFE SYNC TO GOOGLE SHEETS ------------------- */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  ยืนยันการบันทึกข้อมูลลง Google Sheet?
                </h3>
                <p className="text-xs text-slate-500">ระบบจะทำการเพิ่มแถวข้อมูลโปรไฟล์ใหม่ลงในแผ่นงาน</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 text-slate-600">
              <div><strong>ผู้เรียน:</strong> {name} {nickname ? `(${nickname})` : ''}</div>
              <div><strong>รหัส:</strong> {studentId} · {grade}</div>
              <div><strong>สถาบัน:</strong> {school}</div>
              <div>
                <strong>เป้าหมาย:</strong>{' '}
                {isEffectiveAdmin ? (
                  <span className="font-mono text-emerald-700 font-bold">Google Sheet ID: {TARGET_SPREADSHEET_ID}</span>
                ) : (
                  <span className="text-emerald-700 font-medium">ฐานข้อมูลคลาวด์โรงเรียน สพฐ. &amp; สสวท. (ซิงก์ปลอดภัย)</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                ยกเลิก
              </button>

              <button
                type="button"
                onClick={executeSyncToSheet}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
              >
                ยืนยันการบันทึกข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
