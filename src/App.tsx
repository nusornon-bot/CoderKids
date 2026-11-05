import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { Footer } from './components/Footer.tsx';

// 4 Main Modules
import { SafeSharingGame } from './components/Module1Safety/SafeSharingGame.tsx';
import { PasswordLab } from './components/Module1Safety/PasswordLab.tsx';
import { NetiquetteScenarios } from './components/Module1Safety/NetiquetteScenarios.tsx';
import { SafetyQuiz } from './components/Module1Safety/SafetyQuiz.tsx';
import { PDPALab } from './components/Module1Safety/PDPALab.tsx';

import { PillarsView } from './components/Module2Thinking/PillarsView.tsx';
import { ControlStructuresView } from './components/Module2Thinking/ControlStructuresView.tsx';
import { AlgorithmPuzzleGame } from './components/Module2Thinking/AlgorithmPuzzleGame.tsx';

import { ScratchStudio } from './components/Module3CodingLab/ScratchStudio.tsx';
import { MicrobitSimulator } from './components/Module3CodingLab/MicrobitSimulator.tsx';
import { CodeExamplesGallery } from './components/Module3CodingLab/CodeExamplesGallery.tsx';

import { ShowcaseGallery } from './components/Module4Showcase/ShowcaseGallery.tsx';
import { SubmitProjectModal } from './components/Module4Showcase/SubmitProjectModal.tsx';
import { PeerReviewWall } from './components/Module4Showcase/PeerReviewWall.tsx';
import { ReflectionJournal } from './components/Module4Showcase/ReflectionJournal.tsx';
import { DailyJournal } from './components/Module4Showcase/DailyJournal.tsx';
import { CertificateModal } from './components/Module4Showcase/CertificateModal.tsx';

// 4 New Systems
import { ProfileModal } from './components/ProfileModal.tsx';
import { ProfileManagementView } from './components/ProfileManagementView.tsx';
import { PointsRewardCenter } from './components/PointsRewardCenter.tsx';
import { VirtualClassroom } from './components/VirtualClassroom.tsx';
import { DidYouKnowSection } from './components/DidYouKnowSection.tsx';
import { LoginModal } from './components/LoginModal.tsx';
import { Leaderboard } from './components/Leaderboard.tsx';
import { ConfettiCelebration, CelebrationEvent, fireConfetti } from './components/ConfettiCelebration.tsx';
import { LearningPathMap } from './components/LearningPathMap.tsx';
import { AITutorChatbot } from './components/AITutorChatbot.tsx';
import { GoogleAppsScriptExportModal } from './components/GoogleAppsScriptExportModal.tsx';
import { TeacherAssessmentReportModal } from './components/TeacherAssessmentReportModal.tsx';
import { UnpluggedWorksheetsModal } from './components/UnpluggedWorksheetsModal.tsx';
import { DailyBugHunterModal } from './components/DailyBugHunterModal.tsx';
import { JuniorCodePlayground } from './components/JuniorCodePlayground.tsx';
import { KidsAILab } from './components/KidsAILab.tsx';
import { BuddySystem } from './components/BuddySystem.tsx';
import { ExamArenaModal } from './components/ExamArenaModal.tsx';
import { TeamBattleArena } from './components/TeamBattleArena.tsx';
import { DigitalPassportModal } from './components/DigitalPassportModal.tsx';
import { TeacherLessonPlansModal } from './components/TeacherLessonPlansModal.tsx';
import { DigitalLibrary } from './components/DigitalLibrary.tsx';
import { StemProjectHub } from './components/StemProjectHub.tsx';
import { BinaryPixelArtLab } from './components/BinaryPixelArtLab.tsx';
import { RubricAssessmentModal } from './components/RubricAssessmentModal.tsx';
import { ParentTeacherKitModal } from './components/ParentTeacherKitModal.tsx';
import { BebrasArena } from './components/BebrasArena.tsx';
import { AiPromptLab } from './components/AiPromptLab.tsx';
import { MicrobitDataLogger } from './components/MicrobitDataLogger.tsx';
import { ClassroomBattleModal } from './components/ClassroomBattleModal.tsx';
import { CodeTyperModal } from './components/CodeTyperModal.tsx';
import { PairProgrammingArena } from './components/PairProgrammingArena.tsx';
import { TeacherMasteryPortal } from './components/TeacherMasteryPortal.tsx';
import { StemPacksModal } from './components/StemPacksModal.tsx';
import { CoderHeroCardsModal } from './components/CoderHeroCardsModal.tsx';
import { SmartExamGeneratorModal } from './components/SmartExamGeneratorModal.tsx';
import { VisualCodeTracerModal } from './components/VisualCodeTracerModal.tsx';
import { StudentQRPassModal } from './components/StudentQRPassModal.tsx';
import { MicrobitMusicLab } from './components/MicrobitMusicLab.tsx';
import { OfflineIndicator } from './components/OfflineIndicator.tsx';
import { soundEffects } from './utils/soundEffects.ts';

import {
  INITIAL_SHOWCASE_PROJECTS,
  DEFAULT_PROFILE,
  DEFAULT_PROFILES_LIST,
  ACHIEVEMENT_BADGES,
  INITIAL_POINT_TRANSACTIONS,
  INITIAL_TODAY_GOAL,
} from './data/learningData.ts';
import {
  ShowcaseProject,
  ProjectStage,
  PeerReview,
  UserProfile,
  AchievementBadge,
  PointTransaction,
  TodayLearningGoal,
} from './types/index.ts';
import { ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Sub-tab selectors for each module
  const [safetySubTab, setSafetySubTab] = useState<'pdpaLab' | 'pdpa' | 'password' | 'netiquette' | 'quiz'>('pdpaLab');
  const [thinkingSubTab, setThinkingSubTab] = useState<'pillars' | 'controls' | 'puzzle'>('pillars');
  const [codingSubTab, setCodingSubTab] = useState<'scratch' | 'microbit' | 'musicLab' | 'examplesGallery'>('scratch');
  const [showcaseSubTab, setShowcaseSubTab] = useState<'gallery' | 'reviews' | 'reflection' | 'dailyJournal'>('gallery');

  // Student Profiles State for Multi-Profile Management (เพิ่ม, ลบ, แก้ไข, สลับ)
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('coderkids_profiles');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Error loading profiles:', e);
      }
    }
    return DEFAULT_PROFILES_LIST;
  });

  // Current Active Student Profile
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('coderkids_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) return parsed;
      } catch (e) {
        console.error('Error loading active profile:', e);
      }
    }
    return DEFAULT_PROFILES_LIST[0] || DEFAULT_PROFILE;
  });

  // Points and Ledger State
  const [points, setPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('coderkids_points');
      return saved ? parseInt(saved, 10) : 65;
    } catch {
      return 65;
    }
  });

  const [transactions, setTransactions] = useState<PointTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('coderkids_transactions');
      return saved ? JSON.parse(saved) : INITIAL_POINT_TRANSACTIONS;
    } catch {
      return INITIAL_POINT_TRANSACTIONS;
    }
  });

  // Module Progress State
  const [moduleProgress, setModuleProgress] = useState<{
    safety: boolean;
    thinking: boolean;
    codingLab: boolean;
    showcase: boolean;
  }>(() => {
    try {
      const saved = localStorage.getItem('coderkids_progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {
      // ignore
    }
    return { safety: false, thinking: false, codingLab: false, showcase: false };
  });

  // Achievement Badges
  const [badges, setBadges] = useState<AchievementBadge[]>(() => {
    try {
      const saved = localStorage.getItem('coderkids_badges');
      return saved ? JSON.parse(saved) : ACHIEVEMENT_BADGES;
    } catch {
      return ACHIEVEMENT_BADGES;
    }
  });

  // Projects and peer reviews
  const [projects, setProjects] = useState<ShowcaseProject[]>(() => {
    try {
      const saved = localStorage.getItem('coderkids_projects');
      return saved ? JSON.parse(saved) : INITIAL_SHOWCASE_PROJECTS;
    } catch {
      return INITIAL_SHOWCASE_PROJECTS;
    }
  });

  const [likedProjectIds, setLikedProjectIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('coderkids_liked_projects');
      return saved ? JSON.parse(saved) : ['proj_1'];
    } catch {
      return ['proj_1'];
    }
  });

  const [reviews, setReviews] = useState<PeerReview[]>(() => {
    try {
      const saved = localStorage.getItem('coderkids_reviews');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'rev_1',
              projectId: 'proj_1',
              reviewerName: 'ด.ญ. ชนัญชิดา สุขสันต์',
              star1: 'เกมเล่นสนุก มีเสียงประกอบน่ารักมาก และเก็บเหรียญได้สมูท',
              star2: 'ชอบที่ใช้ตัวแปรนับคะแนนและแถบพลังชีวิตชัดเจน',
              wish: 'อยากให้เพิ่มศัตรูระดับบอสตอนท้ายเกมจะยิ่งท้าทายขึ้นค่ะ',
              createdAt: '1 วันที่แล้ว',
            },
            {
              id: 'rev_2',
              projectId: 'proj_2',
              reviewerName: 'ด.ช. ธนกฤต วุฒิชัย',
              star1: 'การประยุกต์ใช้เซ็นเซอร์อุณหภูมิกับสิ่งแวดล้อมมีประโยชน์มาก',
              star2: 'ไอคอนพระอาทิตย์บนหน้าจอ Micro:bit ดูเข้าใจง่ายดี',
              wish: 'ถ้าต่อ Relay สั่งเปิดปั๊มน้ำจริงได้จะยอดเยี่ยมมากเลยครับ',
              createdAt: '2 วันที่แล้ว',
            },
          ];
    } catch {
      return [
        {
          id: 'rev_1',
          projectId: 'proj_1',
          reviewerName: 'ด.ญ. ชนัญชิดา สุขสันต์',
          star1: 'เกมเล่นสนุก มีเสียงประกอบน่ารักมาก และเก็บเหรียญได้สมูท',
          star2: 'ชอบที่ใช้ตัวแปรนับคะแนนและแถบพลังชีวิตชัดเจน',
          wish: 'อยากให้เพิ่มศัตรูระดับบอสตอนท้ายเกมจะยิ่งท้าทายขึ้นค่ะ',
          createdAt: '1 วันที่แล้ว',
        },
      ];
    }
  });

  // Modals
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [isGasExportModalOpen, setIsGasExportModalOpen] = useState(false);
  const [isAssessmentReportOpen, setIsAssessmentReportOpen] = useState(false);
  const [isUnpluggedWorksheetsOpen, setIsUnpluggedWorksheetsOpen] = useState(false);
  const [isBugHunterOpen, setIsBugHunterOpen] = useState(false);
  const [isExamArenaOpen, setIsExamArenaOpen] = useState(false);
  const [isDigitalPassportOpen, setIsDigitalPassportOpen] = useState(false);
  const [isTeacherPlansOpen, setIsTeacherPlansOpen] = useState(false);
  const [isRubricModalOpen, setIsRubricModalOpen] = useState(false);
  const [isParentTeacherKitOpen, setIsParentTeacherKitOpen] = useState(false);
  const [isClassroomBattleOpen, setIsClassroomBattleOpen] = useState(false);
  const [isCodeTyperOpen, setIsCodeTyperOpen] = useState(false);
  const [isPairArenaOpen, setIsPairArenaOpen] = useState(false);
  const [isStemPacksOpen, setIsStemPacksOpen] = useState(false);
  const [isTeacherMasteryOpen, setIsTeacherMasteryOpen] = useState(false);
  const [isHeroCardsOpen, setIsHeroCardsOpen] = useState(false);
  const [isSmartExamOpen, setIsSmartExamOpen] = useState(false);
  const [isCodeTracerOpen, setIsCodeTracerOpen] = useState(false);
  const [isStudentQRPassOpen, setIsStudentQRPassOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [selectedProjectForReview, setSelectedProjectForReview] = useState<ShowcaseProject | null>(null);

  // Member Login Gate State ("สมาชิกลงชื่อเข้าใช้งาน ก่อนเข้าบทเรียน")
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('coderkids_is_logged_in');
    return saved === 'true';
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingDestinationModule, setPendingDestinationModule] = useState<string | null>(null);

  // Today's Learning Goal State (เป้าหมายการเรียนรู้วันนี้ ที่ตั้งจาก DailyJournal)
  const [todayGoal, setTodayGoal] = useState<TodayLearningGoal | null>(() => {
    const saved = localStorage.getItem('coderkids_today_goal');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.goal) return parsed;
      } catch (e) {
        console.error('Error loading today goal:', e);
      }
    }
    return INITIAL_TODAY_GOAL;
  });

  useEffect(() => {
    if (todayGoal) {
      localStorage.setItem('coderkids_today_goal', JSON.stringify(todayGoal));
    } else {
      localStorage.removeItem('coderkids_today_goal');
    }
  }, [todayGoal]);

  // Theme state (สลับโหมดสว่างและโหมดมืด Dark Mode พร้อมบันทึกลง localStorage)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('coderkids_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem('coderkids_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Celebration event state for ConfettiCelebration component
  const [celebrationEvent, setCelebrationEvent] = useState<CelebrationEvent | null>(null);

  const handleTriggerManualCelebration = () => {
    fireConfetti('fireworks');
    setCelebrationEvent({
      id: `celebrate_manual_${Date.now()}`,
      type: 'custom',
      title: '🌟 เก่งมาก! กำลังใจในการเรียนรู้วิทยาการคำนวณ',
      subtitle: 'คุณกำลังก้าวหน้าอย่างยอดเยี่ยมบนเส้นทางการเรียนรู้ ร่วมสะสมแต้มและฝึกทักษะให้ครบทุกโมดูลนะ!',
      pointsAwarded: 10,
      badgeEmoji: '✨',
      nextStepTitle: 'ไปที่แผนที่การเดินทาง (Learning Map) 🗺️',
      nextStepModule: 'learningMap',
    });
  };

  const handleToggleTodayGoal = () => {
    if (!todayGoal) return;
    const newCompleted = !todayGoal.completed;
    const nowTime = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    const updated: TodayLearningGoal = {
      ...todayGoal,
      completed: newCompleted,
      completedAt: newCompleted ? nowTime : undefined,
    };
    setTodayGoal(updated);

    if (newCompleted) {
      addPoints(10, `ทำเป้าหมายการเรียนรู้วันนี้สำเร็จ: "${todayGoal.goal.substring(0, 35)}..."`, 'classroom');
      confetti({ particleCount: 55, spread: 65, origin: { y: 0.6 } });
    }
  };

  const handleSetTodayGoal = (
    goalText: string,
    category: 'coding' | 'hardware' | 'thinking' | 'safety' | 'reflection' = 'coding'
  ) => {
    const now = new Date();
    const newGoal: TodayLearningGoal = {
      id: `goal_${Date.now()}`,
      goal: goalText.trim(),
      completed: false,
      category,
      createdAt: now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      date: now.toISOString().split('T')[0],
    };
    setTodayGoal(newGoal);
  };

  useEffect(() => {
    localStorage.setItem('coderkids_is_logged_in', isLoggedIn.toString());
  }, [isLoggedIn]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('coderkids_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('coderkids_profile', JSON.stringify(profile));
  }, [profile]);

  // Profile Management Handlers (เพิ่ม, แก้ไข, ลบ, สลับ)
  const handleUpdateProfile = (updated: UserProfile) => {
    setProfile(updated);
    setProfiles((prev) => {
      const exists = prev.some((p) => p.id === updated.id);
      if (exists) {
        return prev.map((p) => (p.id === updated.id ? updated : p));
      }
      return [...prev, updated];
    });
  };

  const handleAddProfile = (newProfile: UserProfile, makeActive: boolean = true) => {
    setProfiles((prev) => [newProfile, ...prev]);
    if (makeActive) {
      setProfile(newProfile);
    }
  };

  const handleDeleteProfile = (profileId: string) => {
    setProfiles((prev) => {
      if (prev.length <= 1) return prev;
      const remaining = prev.filter((p) => p.id !== profileId);
      if (profile.id === profileId && remaining.length > 0) {
        setProfile(remaining[0]);
      }
      return remaining;
    });
  };

  const handleSelectProfile = (profileId: string) => {
    const found = profiles.find((p) => p.id === profileId);
    if (found) {
      setProfile(found);
    }
  };

  // Lesson Access Gatekeeper ("สมาชิกลงชื่อเข้าใช้งาน ก่อนเข้าบทเรียน")
  const handleNavigate = (moduleKey: string, subSection?: string) => {
    const lessonModules = ['safety', 'thinking', 'codingLab', 'showcase', 'classroom'];
    if (!isLoggedIn && lessonModules.includes(moduleKey)) {
      setPendingDestinationModule(moduleKey);
      setIsLoginModalOpen(true);
      return;
    }
    if (moduleKey === 'certificate') {
      setIsCertificateModalOpen(true);
      return;
    }
    if (moduleKey === 'safety' && subSection) {
      setSafetySubTab(subSection as any);
    }
    if (moduleKey === 'thinking' && subSection) {
      setThinkingSubTab(subSection as any);
    }
    if (moduleKey === 'codingLab' && subSection) {
      setCodingSubTab(subSection as any);
    }
    if (moduleKey === 'showcase' && subSection) {
      setShowcaseSubTab(subSection as any);
    }
    setActiveTab(moduleKey);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (selectedProfile: UserProfile, googleUser?: any) => {
    setIsLoggedIn(true);
    setProfile(selectedProfile);
    setProfiles((prev) => {
      const exists = prev.some((p) => p.id === selectedProfile.id);
      if (!exists) return [selectedProfile, ...prev];
      return prev.map((p) => (p.id === selectedProfile.id ? selectedProfile : p));
    });

    if (pendingDestinationModule) {
      setActiveTab(pendingDestinationModule);
      setPendingDestinationModule(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('dashboard');
  };

  useEffect(() => {
    localStorage.setItem('coderkids_points', points.toString());
  }, [points]);

  useEffect(() => {
    localStorage.setItem('coderkids_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('coderkids_progress', JSON.stringify(moduleProgress));
  }, [moduleProgress]);

  useEffect(() => {
    localStorage.setItem('coderkids_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('coderkids_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('coderkids_liked_projects', JSON.stringify(likedProjectIds));
  }, [likedProjectIds]);

  useEffect(() => {
    localStorage.setItem('coderkids_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Points and Ledger Management
  const addPoints = (amount: number, reason: string = 'ผ่านภารกิจการเรียนรู้', category: 'safety' | 'thinking' | 'coding' | 'showcase' | 'classroom' = 'classroom') => {
    const newTotal = points + amount;
    setPoints(newTotal);
    soundEffects.playSuccess();

    const newTx: PointTransaction = {
      id: `tx_${Date.now()}`,
      description: reason,
      amount,
      type: 'earn',
      timestamp: 'เมื่อสักครู่',
      category,
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Check Century Club Badge
    if (newTotal >= 100) {
      setBadges((prev) =>
        prev.map((b) => (b.id === 'badge_score_100' ? { ...b, unlocked: true } : b))
      );
    }

    // Check points milestone celebration: 100, 200, 300, 500
    const milestones = [100, 200, 300, 500];
    const reached = milestones.find((m) => points < m && newTotal >= m);
    if (reached) {
      setTimeout(() => {
        setCelebrationEvent({
          id: `celebrate_milestone_${reached}_${Date.now()}`,
          type: 'milestone_points',
          title: `⚡ ยอดเยี่ยมมาก! สะสมแต้มทะลุ ${reached} แต้มแล้ว!`,
          subtitle: `คุณทำกิจกรรมและพัฒนาทักษะวิทยาการคำนวณอย่างต่อเนื่อง สะสมแต้มไปแลกของรางวัลและฉายาพิเศษได้เลย`,
          pointsAwarded: 20,
          totalPoints: newTotal,
          badgeEmoji: '🪙',
          nextStepTitle: 'เปิดศูนย์แลกแต้มรางวัล 🎁',
          nextStepModule: 'rewards',
        });
      }, 500);
    }
  };

  const spendPoints = (amount: number, description: string, rewardId: string): boolean => {
    if (points < amount) return false;

    setPoints((prev) => prev - amount);
    const newTx: PointTransaction = {
      id: `tx_${Date.now()}`,
      description,
      amount,
      type: 'spend',
      timestamp: 'เมื่อสักครู่',
      category: 'classroom',
    };
    setTransactions((prev) => [newTx, ...prev]);

    setProfile((prev) => ({
      ...prev,
      unlockedRewardIds: [...prev.unlockedRewardIds, rewardId],
    }));

    return true;
  };

  const markModuleComplete = (moduleKey: 'safety' | 'thinking' | 'codingLab' | 'showcase') => {
    setModuleProgress((prev) => {
      const isAlreadyDone = prev[moduleKey];
      const updated = { ...prev, [moduleKey]: true };
      const allDone = Object.values(updated).every(Boolean);

      // Unlock badges based on module completion
      setBadges((bList) =>
        bList.map((b) => {
          if (moduleKey === 'safety' && b.id === 'badge_pdpa') return { ...b, unlocked: true };
          if (moduleKey === 'thinking' && b.id === 'badge_logic') return { ...b, unlocked: true };
          if (moduleKey === 'codingLab' && (b.id === 'badge_scratch_star' || b.id === 'badge_microbit_hacker')) return { ...b, unlocked: true };
          if (moduleKey === 'showcase' && (b.id === 'badge_peer_champion' || b.id === 'badge_reflector')) return { ...b, unlocked: true };
          if (allDone && b.id === 'badge_all_rounder') return { ...b, unlocked: true };
          return b;
        })
      );

      // Trigger ConfettiCelebration particle animation whenever student completes a module or milestone
      if (!isAlreadyDone) {
        addPoints(50, `สำเร็จการเรียนรู้โมดูล: ${moduleKey}`, moduleKey === 'codingLab' ? 'coding' : moduleKey);

        const moduleMeta: Record<string, { title: string; subtitle: string; emoji: string; next?: string; nextTitle?: string }> = {
          safety: {
            title: '🎉 ผ่านโมดูล 1: ความปลอดภัยดิจิทัล & PDPA สำเร็จ!',
            subtitle: 'ยอดเยี่ยมมาก! คุณได้เรียนรู้การคุ้มครองข้อมูลส่วนบุคคล รหัสผ่าน และมารยาทไซเบอร์ พร้อมรับเกราะคุ้มกันดิจิทัล',
            emoji: '🛡️',
            next: 'thinking',
            nextTitle: 'ลุยโมดูล 2: การคิดเชิงคำนวณและอัลกอริทึม 🚀',
          },
          thinking: {
            title: '🎉 ผ่านโมดูล 2: การคิดเชิงคำนวณและอัลกอริทึม สำเร็จ!',
            subtitle: 'เก่งมาก! คุณเข้าใจ 4 เสาหลักการคิดเชิงคำนวณ ผังงาน และตรรกะแบบวนซ้ำ พร้อมนำไปเขียนโปรแกรมจริง',
            emoji: '🧩',
            next: 'codingLab',
            nextTitle: 'ลุยโมดูล 3: ปฏิบัติการ Scratch & Micro:bit 🚀',
          },
          codingLab: {
            title: '🎉 ผ่านโมดูล 3: ปฏิบัติการ Scratch & Micro:bit สำเร็จ!',
            subtitle: 'สุดยอดผลงาน! คุณสร้างโค้ดดิ้งบล็อกและจำลองการทำงานของฮาร์ดแวร์ Micro:bit ได้อย่างสมบูรณ์แบบ',
            emoji: '💻',
            next: 'showcase',
            nextTitle: 'ลุยโมดูล 4: แสดงผลงานและสะท้อนคิด 🚀',
          },
          showcase: {
            title: '🎉 ผ่านโมดูล 4: แสดงผลงานและสะท้อนคิด สำเร็จ!',
            subtitle: 'ยินดีด้วย! คุณได้แบ่งปันผลงาน ให้ข้อคิดเห็น 2 Stars & A Wish และบันทึกการเรียนรู้อย่างสร้างสรรค์',
            emoji: '🏆',
            next: 'dashboard',
            nextTitle: 'ดูแผนที่ความสำเร็จและเกียรติบัตร 🎓',
          },
        };

        const meta = moduleMeta[moduleKey];

        if (allDone) {
          setCelebrationEvent({
            id: `celebrate_all_${Date.now()}`,
            type: 'certificate_unlocked',
            title: '🎓 ยินดีด้วยอย่างยิ่ง! ผ่านครบทั้ง 4 โมดูลแล้ว!',
            subtitle: 'คุณสำเร็จหลักสูตรวิทยาการคำนวณและเทคโนโลยีครบทุกด่าน พร้อมขอรับเกียรติบัตรรับรองมาตรฐาน สพฐ. & สสวท.',
            pointsAwarded: 100,
            badgeEmoji: '👑',
            nextStepTitle: 'เปิดดูเกียรติบัตรอย่างเป็นทางการ 🎓',
            nextStepModule: 'certificate',
          });
        } else if (meta) {
          setCelebrationEvent({
            id: `celebrate_${moduleKey}_${Date.now()}`,
            type: 'module_complete',
            title: meta.title,
            subtitle: meta.subtitle,
            pointsAwarded: 50,
            badgeEmoji: meta.emoji,
            nextStepTitle: meta.nextTitle,
            nextStepModule: meta.next,
          });
        }
      }

      return updated;
    });
  };

  const handleLikeProject = (projId: string) => {
    if (likedProjectIds.includes(projId)) {
      setLikedProjectIds((prev) => prev.filter((id) => id !== projId));
      setProjects((prev) =>
        prev.map((p) => (p.id === projId ? { ...p, likes: Math.max(0, p.likes - 1) } : p))
      );
    } else {
      setLikedProjectIds((prev) => [...prev, projId]);
      setProjects((prev) =>
        prev.map((p) => (p.id === projId ? { ...p, likes: p.likes + 1 } : p))
      );
      addPoints(5, 'กดถูกใจและให้กำลังใจผลงานเพื่อน', 'showcase');
    }
  };

  const handleAddProject = (newProject: ShowcaseProject) => {
    setProjects((prev) => [newProject, ...prev]);
    addPoints(30, `ส่งและนำเสนอโครงงาน: ${newProject.title}`, 'showcase');
    markModuleComplete('showcase');
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  const handleUpdateProjectStage = (projectId: string, newStage: ProjectStage) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const nextHistory = { ...(p.stageHistory || {}) };
          if (!nextHistory[newStage]) {
            nextHistory[newStage] = {
              date: 'วันนี้',
              note: `ก้าวสู่ระยะ ${newStage === 'idea' ? 'ไอเดีย (Idea)' : newStage === 'draft' ? 'ร่างแบบ (Draft)' : newStage === 'review' ? 'รีวิว (Review)' : 'สมบูรณ์ (Final)'} สำเร็จ!`,
              milestonesDone: ['บรรลุเป้าหมายการพัฒนาระยะนี้'],
            };
          }
          return {
            ...p,
            stage: newStage,
            stageHistory: nextHistory,
          };
        }
        return p;
      })
    );
    if (newStage === 'final') {
      addPoints(25, 'พัฒนาโครงงานจนถึงขั้นสมบูรณ์ (Final Stage) 🏆', 'showcase');
    }
  };

  const handleAddReview = (newReview: PeerReview) => {
    setReviews((prev) => [newReview, ...prev]);
    addPoints(15, 'ให้คำชม 2 Stars and a Wish แก่เพื่อน', 'showcase');
    markModuleComplete('showcase');
  };

  const handleSelectProjectForReview = (project: ShowcaseProject) => {
    setSelectedProjectForReview(project);
    setShowcaseSubTab('reviews');
    setActiveTab('showcase');
  };

  const handleSelectTitle = (title: string) => {
    setProfile((prev) => ({ ...prev, selectedTitle: title }));
  };

  const completedCount = Object.values(moduleProgress).filter(Boolean).length;
  const isAdmin = profile.role === 'admin';

  const handleToggleAdmin = (newAdminState: boolean) => {
    const updated: UserProfile = {
      ...profile,
      role: newAdminState ? 'admin' : 'student',
    };
    handleUpdateProfile(updated);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'} flex flex-col selection:bg-indigo-500 selection:text-white transition-colors duration-200`}>
      {/* 3-Zone Header Contract with Profile & Points */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        onOpenCertificate={() => setIsCertificateModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        completedPoints={points}
        profile={profile}
        isLoggedIn={isLoggedIn}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        isAdmin={isAdmin}
        onToggleAdmin={handleToggleAdmin}
        onOpenAITutor={() => setIsAITutorOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenGasExport={() => setIsGasExportModalOpen(true)}
        onOpenAssessmentReport={() => setIsAssessmentReportOpen(true)}
        onOpenUnpluggedWorksheets={() => setIsUnpluggedWorksheetsOpen(true)}
        onOpenBugHunter={() => setIsBugHunterOpen(true)}
        onOpenExamArena={() => setIsExamArenaOpen(true)}
        onOpenDigitalPassport={() => setIsDigitalPassportOpen(true)}
        onOpenTeacherPlans={() => setIsTeacherPlansOpen(true)}
        onOpenRubricModal={() => setIsRubricModalOpen(true)}
        onOpenParentTeacherKit={() => setIsParentTeacherKitOpen(true)}
        onOpenClassroomBattle={() => setIsClassroomBattleOpen(true)}
        onOpenCodeTyper={() => setIsCodeTyperOpen(true)}
        onOpenPairArena={() => setIsPairArenaOpen(true)}
        onOpenStemPacks={() => setIsStemPacksOpen(true)}
        onOpenTeacherMastery={() => setIsTeacherMasteryOpen(true)}
        onOpenHeroCards={() => setIsHeroCardsOpen(true)}
        onOpenSmartExam={() => setIsSmartExamOpen(true)}
        onOpenCodeTracer={() => setIsCodeTracerOpen(true)}
        onOpenStudentQRPass={() => setIsStudentQRPassOpen(true)}
        isFocusMode={isFocusMode}
        onToggleFocusMode={() => setIsFocusMode((prev) => !prev)}
      />

      {/* Main Container */}
      <main className={`flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 ${isFocusMode ? 'pt-2 max-w-5xl' : 'pt-6 sm:pt-8'}`}>
        {/* Breadcrumb / Back button when navigating away from dashboard */}
        {activeTab !== 'dashboard' && (
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>กลับสู่หน้าหลัก Dashboard</span>
            </button>

            <div className="text-xs text-slate-500 dark:text-slate-400">
              {activeTab === 'learningMap' && 'แผนที่การผจญภัยการเรียนรู้ 4 ดินแดน (Learning Path Map)'}
              {activeTab === 'safety' && 'โมดูลที่ 1: ความปลอดภัย & มารยาทดิจิทัล'}
              {activeTab === 'thinking' && 'โมดูลที่ 2: การคิดเป็นลำดับขั้น & อัลกอริทึม'}
              {activeTab === 'codingLab' && 'โมดูลที่ 3: ปฏิบัติการ Scratch & Micro:bit'}
              {activeTab === 'showcase' && 'โมดูลที่ 4: นำเสนอผลงาน & สะท้อนคิด'}
              {activeTab === 'teamBattle' && '⚔️ สนามประลองสด 4 ทีมในห้องเรียน (Team Battle Arena)'}
              {activeTab === 'classroom' && 'ห้องเรียนเสมือนจริง (Virtual Classroom)'}
              {activeTab === 'rewards' && 'ศูนย์สะสมแต้ม & ร้านค้าแลกรางวัล'}
              {activeTab === 'didYouKnow' && 'เรื่องน่ารู้ชวนคิด 4 หัวข้อ (Did You Know?)'}
              {activeTab === 'profileManage' && 'ระบบจัดการโปรไฟล์ & บันทึกลง Google Sheets'}
              {activeTab === 'juniorPlayground' && 'ห้องทดลองเขียนโค้ด Junior Code Playground (Python & JS)'}
              {activeTab === 'kidsAILab' && 'ห้องปฏิบัติการเทรนปัญญาประดิษฐ์ Kids AI & Machine Learning Lab'}
              {activeTab === 'buddySystem' && '👥 ระบบคู่หูเรียนรู้ & แผงควบคุมส่งอิโมจิให้กำลังใจ (Buddy System)'}
              {activeTab === 'stemProjects' && '🚀 คลังโครงงาน STEM / STEAM Project Hub & Project Canvas A4'}
              {activeTab === 'binaryLab' && '👾 ห้องแล็บเลขฐานสอง Binary Pixel Art 8×8 & รหัสลับสายลับ ASCII'}
              {activeTab === 'bebrasArena' && '🦫 เวทีประลองการคิดเชิงคำนวณมาตรฐานสากล Bebras Thailand Arena'}
              {activeTab === 'aiPromptLab' && '🤖 ห้องทดลองปัญญาประดิษฐ์ Kids AI & Safe Prompting Lab'}
              {activeTab === 'microbitDataLogger' && '📈 บันทึกข้อมูลและพล็อตกราฟวิทยาศาสตร์ Micro:bit IoT Data Logger'}
            </div>
          </div>
        )}

        {/* ----------------- VIEW 0: MAIN DASHBOARD ----------------- */}
        {activeTab === 'dashboard' && (
          <Dashboard
            onNavigate={handleNavigate}
            onOpenCertificate={() => setIsCertificateModalOpen(true)}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            profile={profile}
            moduleProgress={moduleProgress}
            points={points}
            isLoggedIn={isLoggedIn}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            todayGoal={todayGoal}
            onToggleTodayGoal={handleToggleTodayGoal}
            onSetTodayGoal={handleSetTodayGoal}
            isAdmin={isAdmin}
            onCelebrate={handleTriggerManualCelebration}
            onOpenAITutor={() => setIsAITutorOpen(true)}
            onOpenGasExport={() => setIsGasExportModalOpen(true)}
            onOpenAssessmentReport={() => setIsAssessmentReportOpen(true)}
            onOpenUnpluggedWorksheets={() => setIsUnpluggedWorksheetsOpen(true)}
            onOpenBugHunter={() => setIsBugHunterOpen(true)}
            onOpenExamArena={() => setIsExamArenaOpen(true)}
            onOpenDigitalPassport={() => setIsDigitalPassportOpen(true)}
            onOpenTeacherPlans={() => setIsTeacherPlansOpen(true)}
            onOpenRubricModal={() => setIsRubricModalOpen(true)}
            onOpenParentTeacherKit={() => setIsParentTeacherKitOpen(true)}
            onOpenClassroomBattle={() => setIsClassroomBattleOpen(true)}
            onOpenCodeTyper={() => setIsCodeTyperOpen(true)}
            onOpenPairArena={() => setIsPairArenaOpen(true)}
            onOpenStemPacks={() => setIsStemPacksOpen(true)}
            onOpenTeacherMastery={() => setIsTeacherMasteryOpen(true)}
            onOpenHeroCards={() => setIsHeroCardsOpen(true)}
            onOpenSmartExam={() => setIsSmartExamOpen(true)}
            onOpenCodeTracer={() => setIsCodeTracerOpen(true)}
            onOpenStudentQRPass={() => setIsStudentQRPassOpen(true)}
            addPoints={addPoints}
          />
        )}

        {/* ----------------- VIEW: LEARNING PATH MAP (STEP-BY-STEP ROADMAP) ----------------- */}
        {activeTab === 'learningMap' && (
          <LearningPathMap
            moduleProgress={moduleProgress}
            points={points}
            profile={profile}
            onNavigate={handleNavigate}
            onOpenCertificate={() => setIsCertificateModalOpen(true)}
            onCelebrate={handleTriggerManualCelebration}
          />
        )}

        {/* ----------------- VIEW: PROFILE MANAGEMENT & GOOGLE SHEETS ----------------- */}
        {activeTab === 'profileManage' && (
          <ProfileManagementView
            profile={profile}
            profiles={profiles}
            onUpdateProfile={handleUpdateProfile}
            onAddProfile={handleAddProfile}
            onDeleteProfile={handleDeleteProfile}
            onSelectProfile={handleSelectProfile}
            points={points}
            completedModulesCount={completedCount}
            badges={badges}
            isAdmin={isAdmin}
            onToggleAdmin={handleToggleAdmin}
            onOpenGasExport={() => setIsGasExportModalOpen(true)}
          />
        )}

        {/* ----------------- VIEW: VIRTUAL CLASSROOM ----------------- */}
        {activeTab === 'classroom' && (
          <VirtualClassroom
            onNavigateModule={(mod) => handleNavigate(mod)}
            addPoints={addPoints}
            studentName={profile.name}
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            isAdmin={isAdmin}
          />
        )}

        {/* ----------------- VIEW: BUDDY SYSTEM (CO-LEARNING & CHEERING) ----------------- */}
        {activeTab === 'buddySystem' && (
          <BuddySystem
            profile={profile}
            addPoints={addPoints}
            onNavigateModule={handleNavigate}
          />
        )}

        {/* ----------------- VIEW: REWARDS & POINTS CENTER ----------------- */}
        {activeTab === 'rewards' && (
          <PointsRewardCenter
            points={points}
            transactions={transactions}
            profile={profile}
            onSpendPoints={spendPoints}
            onSelectTitle={handleSelectTitle}
          />
        )}

        {/* ----------------- VIEW: DID YOU KNOW BITE-SIZED FACTS ----------------- */}
        {activeTab === 'didYouKnow' && (
          <DidYouKnowSection addPoints={addPoints} />
        )}

        {/* ----------------- VIEW: LEADERBOARD (HALL OF FAME) ----------------- */}
        {activeTab === 'leaderboard' && (
          <Leaderboard
            currentUserPoints={points}
            completedModulesCount={completedCount}
            onOpenCertificate={() => setIsCertificateModalOpen(true)}
            isAdmin={isAdmin}
            profile={profile}
            profiles={profiles}
            onNavigate={handleNavigate}
            onToggleAdmin={handleToggleAdmin}
            onEnrollClassroom={(code) => {
              const updated = { ...profile, enrolledClassroomCode: code };
              handleUpdateProfile(updated);
            }}
          />
        )}

        {/* ----------------- VIEW 1: DIGITAL SAFETY & PDPA ----------------- */}
        {activeTab === 'safety' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl max-w-3xl">
              <button
                onClick={() => setSafetySubTab('pdpaLab')}
                className={`flex-1 min-w-[130px] py-2 px-3 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
                  safetySubTab === 'pdpaLab' ? 'bg-white text-emerald-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🛡️ 1. จำลองสถานการณ์ PDPA Lab</span>
              </button>
              <button
                onClick={() => setSafetySubTab('pdpa')}
                className={`flex-1 min-w-[110px] py-2 px-3 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                  safetySubTab === 'pdpa' ? 'bg-white text-emerald-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. เกมจำแนกข้อมูล
              </button>
              <button
                onClick={() => setSafetySubTab('password')}
                className={`flex-1 min-w-[110px] py-2 px-3 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                  safetySubTab === 'password' ? 'bg-white text-emerald-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3. แล็บรหัสผ่าน
              </button>
              <button
                onClick={() => setSafetySubTab('netiquette')}
                className={`flex-1 min-w-[110px] py-2 px-3 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                  safetySubTab === 'netiquette' ? 'bg-white text-emerald-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                4. มารยาทดิจิทัล
              </button>
              <button
                onClick={() => setSafetySubTab('quiz')}
                className={`flex-1 min-w-[100px] py-2 px-3 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                  safetySubTab === 'quiz' ? 'bg-white text-emerald-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                5. แบบทดสอบ
              </button>
            </div>

            {safetySubTab === 'pdpaLab' && (
              <PDPALab
                addPoints={(pts, reason) => addPoints(pts, reason || 'ตัดสินใจสถานการณ์ PDPA Lab ถูกต้อง', 'safety')}
                onComplete={() => markModuleComplete('safety')}
              />
            )}
            {safetySubTab === 'pdpa' && (
              <SafeSharingGame
                onComplete={() => markModuleComplete('safety')}
                addPoints={(pts) => addPoints(pts, 'จำแนกข้อมูล PDPA สำเร็จ', 'safety')}
              />
            )}
            {safetySubTab === 'password' && (
              <PasswordLab addPoints={(pts) => addPoints(pts, 'ทดสอบสร้างรหัสผ่านปลอดภัย', 'safety')} />
            )}
            {safetySubTab === 'netiquette' && (
              <NetiquetteScenarios addPoints={(pts) => addPoints(pts, 'ตอบสถานการณ์มารยาทดิจิทัลถูกต้อง', 'safety')} />
            )}
            {safetySubTab === 'quiz' && (
              <SafetyQuiz
                onComplete={() => markModuleComplete('safety')}
                addPoints={(pts) => addPoints(pts, 'ทำแบบทดสอบความปลอดภัยดิจิทัลผ่าน', 'safety')}
              />
            )}
          </div>
        )}

        {/* ----------------- VIEW 2: COMPUTATIONAL THINKING ----------------- */}
        {activeTab === 'thinking' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl max-w-xl">
              <button
                onClick={() => setThinkingSubTab('pillars')}
                className={`flex-1 min-w-[130px] py-2 px-3 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                  thinkingSubTab === 'pillars' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. 4 เสาหลักการคิด
              </button>
              <button
                onClick={() => setThinkingSubTab('controls')}
                className={`flex-1 min-w-[130px] py-2 px-3 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                  thinkingSubTab === 'controls' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. โครงสร้างควบคุม (3 แบบ)
              </button>
              <button
                onClick={() => setThinkingSubTab('puzzle')}
                className={`flex-1 min-w-[130px] py-2 px-3 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                  thinkingSubTab === 'puzzle' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3. เกมแก้ปัญหาเขาวงกต
              </button>
            </div>

            {thinkingSubTab === 'pillars' && <PillarsView />}
            {thinkingSubTab === 'controls' && <ControlStructuresView />}
            {thinkingSubTab === 'puzzle' && (
              <AlgorithmPuzzleGame
                onComplete={() => markModuleComplete('thinking')}
                addPoints={(pts) => addPoints(pts, 'พิชิตด่านหุ่นยนต์แก้ปัญหาเขาวงกต', 'thinking')}
              />
            )}
          </div>
        )}

        {/* ----------------- VIEW 3: HANDS-ON CODING LAB ----------------- */}
        {activeTab === 'codingLab' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl max-w-3xl">
              <button
                onClick={() => setCodingSubTab('scratch')}
                className={`flex-1 min-w-[130px] py-2 px-3 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                  codingSubTab === 'scratch' ? 'bg-white text-indigo-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🐱 1. Scratch Visual Studio
              </button>
              <button
                onClick={() => setCodingSubTab('microbit')}
                className={`flex-1 min-w-[140px] py-2 px-3 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                  codingSubTab === 'microbit' ? 'bg-white text-indigo-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📟 2. Micro:bit V2 Simulator
              </button>
              <button
                onClick={() => setCodingSubTab('musicLab')}
                className={`flex-1 min-w-[150px] py-2 px-3 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
                  codingSubTab === 'musicLab' ? 'bg-white text-purple-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🎵 3. Micro:bit Music Lab</span>
                <span className="px-1.5 py-0.2 rounded bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300 text-[10px] font-bold">
                  Synth
                </span>
              </button>
              <button
                onClick={() => setCodingSubTab('examplesGallery')}
                className={`flex-1 min-w-[170px] py-2 px-3 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
                  codingSubTab === 'examplesGallery' ? 'bg-white text-indigo-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>📚 4. คลังโจทย์ตัวอย่างโค้ด</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                  โจทย์ &amp; เฉลย
                </span>
              </button>
            </div>

            {codingSubTab === 'scratch' && (
              <ScratchStudio
                onComplete={() => markModuleComplete('codingLab')}
                addPoints={(pts) => addPoints(pts, 'รันสคริปต์บล็อก Scratch สำเร็จ', 'coding')}
              />
            )}
            {codingSubTab === 'microbit' && (
              <MicrobitSimulator
                onComplete={() => markModuleComplete('codingLab')}
                addPoints={(pts) => addPoints(pts, 'ทดลองเล่นบอร์ด Micro:bit V2 และเซ็นเซอร์', 'coding')}
                onOpenMusicLab={() => setCodingSubTab('musicLab')}
              />
            )}
            {codingSubTab === 'musicLab' && (
              <MicrobitMusicLab
                onBack={() => setCodingSubTab('microbit')}
                addPoints={addPoints}
                onNavigateCodingLab={() => setCodingSubTab('microbit')}
              />
            )}
            {codingSubTab === 'examplesGallery' && (
              <CodeExamplesGallery
                onNavigateToSimulator={(platform) => {
                  if (platform === 'scratch') {
                    setCodingSubTab('scratch');
                  } else {
                    setCodingSubTab('microbit');
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                addPoints={(pts, reason) => addPoints(pts, reason, 'coding')}
              />
            )}
          </div>
        )}

        {/* ----------------- VIEW 4: SHOWCASE, COMMUNITY & REFLECTION ----------------- */}
        {activeTab === 'showcase' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl max-w-xl">
              <button
                onClick={() => setShowcaseSubTab('gallery')}
                className={`flex-1 min-w-[130px] py-2 px-3 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                  showcaseSubTab === 'gallery' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. คลังแสดงผลงาน ({projects.length})
              </button>
              <button
                onClick={() => setShowcaseSubTab('reviews')}
                className={`flex-1 min-w-[130px] py-2 px-3 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                  showcaseSubTab === 'reviews' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. กำแพง 2 Stars &amp; Wish
              </button>
              <button
                onClick={() => setShowcaseSubTab('reflection')}
                className={`flex-1 min-w-[130px] py-2 px-3 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                  showcaseSubTab === 'reflection' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3. สมุดสะท้อนคิด 3-2-1
              </button>
              <button
                onClick={() => setShowcaseSubTab('dailyJournal')}
                className={`flex-1 min-w-[150px] py-2 px-3 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
                  showcaseSubTab === 'dailyJournal' ? 'bg-white text-orange-600 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🔥 4. บันทึกประจำวัน (Streak {profile.streakDays || 4} วัน)</span>
              </button>
            </div>

            {showcaseSubTab === 'gallery' && (
              <ShowcaseGallery
                projects={projects}
                onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
                onSelectProjectForReview={handleSelectProjectForReview}
                onLikeProject={handleLikeProject}
                likedProjectIds={likedProjectIds}
                onUpdateProjectStage={handleUpdateProjectStage}
              />
            )}

            {showcaseSubTab === 'reviews' && (
              <PeerReviewWall
                projects={projects}
                selectedProject={selectedProjectForReview}
                onClearSelectedProject={() => setSelectedProjectForReview(null)}
                reviews={reviews}
                onAddReview={handleAddReview}
                addPoints={(pts) => addPoints(pts, 'ให้ข้อเสนอแนะเพื่อน (2 Stars & Wish)', 'showcase')}
              />
            )}

            {showcaseSubTab === 'reflection' && (
              <ReflectionJournal
                onComplete={() => markModuleComplete('showcase')}
                addPoints={(pts) => addPoints(pts, 'บันทึกสะท้อนคิด 3-2-1 และประเมินรูบริก', 'showcase')}
                onOpenCertificate={() => setIsCertificateModalOpen(true)}
              />
            )}

            {showcaseSubTab === 'dailyJournal' && (
              <DailyJournal
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                addPoints={addPoints}
                onNavigateModule={handleNavigate}
                todayGoal={todayGoal}
                onSetTodayGoal={handleSetTodayGoal}
                onToggleTodayGoal={handleToggleTodayGoal}
              />
            )}
          </div>
        )}

        {/* ----------------- VIEW: JUNIOR TEXT-BASED CODE PLAYGROUND ----------------- */}
        {activeTab === 'juniorPlayground' && (
          <JuniorCodePlayground
            onAwardPoints={(pts) => {
              addPoints(pts, 'เขียนและรันโค้ด Python / JS ใน Junior Playground', 'coding');
              setBadges((prev) =>
                prev.map((b) => (b.id === 'badge_junior_coder' ? { ...b, unlocked: true } : b))
              );
            }}
          />
        )}

        {/* ----------------- VIEW: KIDS AI & MACHINE LEARNING LAB ----------------- */}
        {activeTab === 'kidsAILab' && (
          <KidsAILab
            onAwardPoints={(pts) => {
              addPoints(pts, 'ฝึกสอนโมเดล AI แยกขยะอัจฉริยะใน Kids AI Lab', 'thinking');
              setBadges((prev) =>
                prev.map((b) => (b.id === 'badge_ai_trainer' ? { ...b, unlocked: true } : b))
              );
            }}
          />
        )}

        {/* ----------------- VIEW: LIVE 4-TEAM CLASSROOM BATTLE ARENA ----------------- */}
        {activeTab === 'teamBattle' && (
          <TeamBattleArena
            onBack={() => setActiveTab('dashboard')}
            onAwardPoints={(pts, reason) => {
              addPoints(pts, reason, 'thinking');
              soundEffects.playFanfare();
            }}
          />
        )}

        {/* ----------------- VIEW: DIGITAL LIBRARY (E-BOOKS & MICRO:BIT MANUALS) ----------------- */}
        {activeTab === 'digitalLibrary' && (
          <DigitalLibrary
            profile={profile}
            addPoints={addPoints}
            onNavigateModule={handleNavigate}
          />
        )}

        {/* ----------------- VIEW: STEM PROJECT HUB & PROJECT CANVAS ----------------- */}
        {activeTab === 'stemProjects' && (
          <StemProjectHub
            onBack={() => setActiveTab('dashboard')}
            onNavigate={handleNavigate}
            addPoints={addPoints}
            onCelebrate={handleTriggerManualCelebration}
          />
        )}

        {/* ----------------- VIEW: BINARY PIXEL ART & SECRET CIPHER LAB ----------------- */}
        {activeTab === 'binaryLab' && (
          <BinaryPixelArtLab
            onBack={() => setActiveTab('dashboard')}
            addPoints={addPoints}
            onCelebrate={handleTriggerManualCelebration}
          />
        )}

        {/* ----------------- VIEW: BEBRAS THAILAND ARENA ----------------- */}
        {activeTab === 'bebrasArena' && (
          <BebrasArena
            onBack={() => setActiveTab('dashboard')}
            addPoints={addPoints}
            onCelebrate={handleTriggerManualCelebration}
          />
        )}

        {/* ----------------- VIEW: KIDS AI & SAFE PROMPTING LAB ----------------- */}
        {activeTab === 'aiPromptLab' && (
          <AiPromptLab
            onBack={() => setActiveTab('dashboard')}
            addPoints={addPoints}
            onCelebrate={handleTriggerManualCelebration}
          />
        )}

        {/* ----------------- VIEW: MICRO:BIT IOT DATA LOGGER & SCIENCE CHART ----------------- */}
        {activeTab === 'microbitDataLogger' && (
          <MicrobitDataLogger
            onBack={() => setActiveTab('dashboard')}
            addPoints={addPoints}
          />
        )}

        {/* ----------------- VIEW: MICRO:BIT MUSIC LAB (WEB AUDIO & SYNTHESIZER) ----------------- */}
        {activeTab === 'musicLab' && (
          <MicrobitMusicLab
            onBack={() => setActiveTab('dashboard')}
            addPoints={addPoints}
            onNavigateCodingLab={() => {
              setActiveTab('codingLab');
              setCodingSubTab('microbit');
            }}
          />
        )}
      </main>

      {/* Global Modals */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        badges={badges}
        points={points}
        completedModulesCount={completedCount}
        onOpenProfileManagement={() => {
          setIsProfileModalOpen(false);
          setActiveTab('profileManage');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <SubmitProjectModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleAddProject}
        defaultStudentName={profile.name}
        defaultGrade={profile.grade}
      />

      <CertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        studentName={profile.name}
        schoolName={profile.school}
        points={points}
        completedCount={completedCount}
      />

      {/* Teacher Assessment Report Modal (ปพ.5) */}
      <TeacherAssessmentReportModal
        isOpen={isAssessmentReportOpen}
        onClose={() => setIsAssessmentReportOpen(false)}
        currentProfile={profile}
      />

      {/* Printable Unplugged Worksheets Modal (A4) */}
      <UnpluggedWorksheetsModal
        isOpen={isUnpluggedWorksheetsOpen}
        onClose={() => setIsUnpluggedWorksheetsOpen(false)}
        onCompleteWorksheet={() => {
          addPoints(15, 'ทำกิจกรรมใบงาน Unplugged Coding ตามมาตรฐาน สพฐ.', 'thinking');
          setBadges((prev) =>
            prev.map((b) => (b.id === 'badge_unplugged_champ' ? { ...b, unlocked: true } : b))
          );
        }}
      />

      {/* Daily Bug Hunter Quest Modal */}
      <DailyBugHunterModal
        isOpen={isBugHunterOpen}
        onClose={() => setIsBugHunterOpen(false)}
        onSuccessBugHunter={(pts) => {
          addPoints(pts, 'พิชิตภารกิจล่า Bug ประจำวัน (Daily Bug Hunter)', 'coding');
          setBadges((prev) =>
            prev.map((b) => (b.id === 'badge_bug_hunter' ? { ...b, unlocked: true } : b))
          );
        }}
      />

      {/* Member Sign-In Gate Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        profiles={profiles}
        currentProfile={profile}
        onLoginSuccess={handleLoginSuccess}
        pendingDestinationModule={pendingDestinationModule}
        isAdmin={isAdmin}
      />

      {/* Milestone & Completion Confetti Celebration Modal */}
      <ConfettiCelebration
        event={celebrationEvent}
        onClose={() => setCelebrationEvent(null)}
        onNavigate={handleNavigate}
        profile={profile}
      />

      {/* AI Tutor Chatbot Floating Assistant */}
      <AITutorChatbot
        profile={profile}
        points={points}
        activeModule={activeTab}
        onNavigate={handleNavigate}
        isOpenExternal={isAITutorOpen}
        onCloseExternal={() => setIsAITutorOpen(false)}
      />

      {/* Google Apps Script & Google Sheets Exporter Modal */}
      <GoogleAppsScriptExportModal
        isOpen={isGasExportModalOpen}
        onClose={() => setIsGasExportModalOpen(false)}
      />

      {/* Standardized O-NET Grade 6 & สสวท. Computing Science Exam Simulator Modal */}
      <ExamArenaModal
        isOpen={isExamArenaOpen}
        onClose={() => setIsExamArenaOpen(false)}
        studentName={profile.name}
        onCompleteExam={(score) => {
          const earned = score * 5;
          addPoints(earned, `ทำข้อสอบวัดผลจำลอง O-NET / สสวท. ป.6 ได้ ${score}/10 คะแนน`, 'thinking');
          soundEffects.playFanfare();
        }}
      />

      {/* Official Digital Coding Passport & Competency Stamps Modal */}
      <DigitalPassportModal
        isOpen={isDigitalPassportOpen}
        onClose={() => setIsDigitalPassportOpen(false)}
        profile={profile}
        points={points}
        moduleProgress={moduleProgress}
      />

      {/* 8 Complete Teacher Lesson Plans & Teaching Slides Modal (ว 4.2 ป.4-6) */}
      <TeacherLessonPlansModal
        isOpen={isTeacherPlansOpen}
        onClose={() => setIsTeacherPlansOpen(false)}
      />

      {/* Rubric Self & Peer Assessment & Growth Portfolio Modal (ว 4.2 สสวท.) */}
      <RubricAssessmentModal
        isOpen={isRubricModalOpen}
        onClose={() => setIsRubricModalOpen(false)}
        profile={profile}
        points={points}
        completedModulesCount={completedCount}
        addPoints={addPoints}
        onCelebrate={handleTriggerManualCelebration}
      />

      {/* Parent & Teacher Resource Kit (Worksheets with QR Code + Family Digital Guide) */}
      <ParentTeacherKitModal
        isOpen={isParentTeacherKitOpen}
        onClose={() => setIsParentTeacherKitOpen(false)}
      />

      {/* Live Classroom Coding Battle & Bug Hunter Sprint Modal */}
      <ClassroomBattleModal
        isOpen={isClassroomBattleOpen}
        onClose={() => setIsClassroomBattleOpen(false)}
        studentName={profile.name}
        addPoints={addPoints}
        onCelebrate={handleTriggerManualCelebration}
      />

      {/* Kids Code Typer Arcade Modal (WPM & Code Symbols) */}
      <CodeTyperModal
        isOpen={isCodeTyperOpen}
        onClose={() => setIsCodeTyperOpen(false)}
        onRewardPoints={(pts, reason) => addPoints(pts, reason, 'coding')}
      />

      {/* Pair Programming Arena Modal (1v1 Split-Screen Duel & Driver-Navigator) */}
      <PairProgrammingArena
        isOpen={isPairArenaOpen}
        onClose={() => setIsPairArenaOpen(false)}
        onRewardPoints={(pts, reason) => addPoints(pts, reason, 'coding')}
      />

      {/* Cross-Curricular STEM Project Packs Modal (Smart Farm, Pedometer, Alarm + 5E) */}
      <StemPacksModal
        isOpen={isStemPacksOpen}
        onClose={() => setIsStemPacksOpen(false)}
        onRewardPoints={(pts, reason) => addPoints(pts, reason, 'coding')}
      />

      {/* Teacher Mastery & Por-Por-5 Assessment Portal Modal (ว 4.2 สพฐ./สสวท.) */}
      <TeacherMasteryPortal
        isOpen={isTeacherMasteryOpen}
        onClose={() => setIsTeacherMasteryOpen(false)}
      />

      {/* Coder Hero Trading Cards Album Modal (3D Hologram & Print A4) */}
      <CoderHeroCardsModal
        isOpen={isHeroCardsOpen}
        onClose={() => setIsHeroCardsOpen(false)}
        studentName={profile.name}
      />

      {/* Smart Exam Paper Generator & Live Quiz Modal (สุ่มข้อสอบ ป.4-ป.6 + กระดาษคำตอบ A4) */}
      <SmartExamGeneratorModal
        isOpen={isSmartExamOpen}
        onClose={() => setIsSmartExamOpen(false)}
        studentName={profile.name}
        onRewardPoints={(pts, reason) => addPoints(pts, reason, 'thinking')}
      />

      {/* Visual Step-by-Step Code Tracer & Debugger Modal (จำลอง RAM & Loop) */}
      <VisualCodeTracerModal
        isOpen={isCodeTracerOpen}
        onClose={() => setIsCodeTracerOpen(false)}
        onRewardPoints={(pts, reason) => addPoints(pts, reason, 'coding')}
      />

      {/* Student QR Pass & Teacher Classroom Attendance Scanner Modal */}
      <StudentQRPassModal
        isOpen={isStudentQRPassOpen}
        onClose={() => setIsStudentQRPassOpen(false)}
        currentStudentName={profile.name}
        onRewardPoints={(pts, reason) => addPoints(pts, reason, 'classroom')}
      />

      {/* Offline Mode Indicator Toast */}
      <OfflineIndicator />

      {/* Footer */}
      <Footer />
    </div>
  );
}
