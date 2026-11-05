export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface PrivacyCard {
  id: string;
  title: string;
  description: string;
  category: 'private' | 'public';
  explanation: string;
  iconName: string;
}

export interface ScenarioItem {
  id: string;
  title: string;
  situation: string;
  options: {
    text: string;
    isAppropriate: boolean;
    feedback: string;
  }[];
}

export interface AlgorithmLevel {
  id: number;
  title: string;
  description: string;
  gridSize: { rows: number; cols: number };
  start: { r: number; c: number; dir: 'up' | 'down' | 'left' | 'right' };
  goal: { r: number; c: number };
  obstacles: { r: number; c: number }[];
  coins: { r: number; c: number }[];
  hint: string;
}

export interface ScratchBlock {
  id: string;
  type: 'motion' | 'looks' | 'control' | 'pen' | 'events';
  name: string;
  param?: number | string;
}

export interface MicrobitCodeSnippet {
  id: string;
  name: string;
  description: string;
  icon: string;
  ledPattern: boolean[][]; // 5x5
  action: 'heart' | 'dice' | 'temp' | 'tally' | 'rps' | 'scroll';
}

export type ProjectStage = 'idea' | 'draft' | 'review' | 'final';

export interface ProjectTimelineStage {
  stage: ProjectStage;
  labelTh: string;
  labelEn: string;
  iconName: string;
  color: string;
  description: string;
  date?: string;
  completedAt?: string;
  milestones: string[];
  note?: string;
}

export interface ShowcaseProject {
  id: string;
  title: string;
  studentName: string;
  grade: string;
  tool: 'Scratch' | 'Micro:bit' | 'Scratch & Micro:bit';
  description: string;
  thumbnailUrl: string;
  images?: string[];
  projectUrl?: string;
  tags: string[];
  likes: number;
  featured?: boolean;
  codeHighlights: string;
  reflectionNote: string;
  stage?: ProjectStage;
  stageHistory?: {
    idea?: { date: string; note: string; milestonesDone: string[] };
    draft?: { date: string; note: string; milestonesDone: string[] };
    review?: { date: string; note: string; milestonesDone: string[] };
    final?: { date: string; note: string; milestonesDone: string[] };
  };
}

export interface PeerReview {
  id: string;
  projectId: string;
  reviewerName: string;
  star1: string; // สิ่งที่ชื่นชม 1
  star2: string; // สิ่งที่ชื่นชม 2
  wish: string;  // ข้อเสนอแนะเพื่อการพัฒนา 1
  createdAt: string;
}

export interface ReflectionEntry {
  learnings: [string, string, string]; // 3 สิ่งที่ได้เรียนรู้
  challenges: [string, string];        // 2 สิ่งที่ท้าทาย
  futureIdea: string;                  // 1 สิ่งที่อยากต่อยอด
  studentName: string;
  school: string;
  date: string;
}

export interface RubricScore {
  digitalSafety: number; // 1-4
  algorithmicThinking: number; // 1-4
  codingProficiency: number; // 1-4
  collaboration: number; // 1-4
}

export interface LeaderboardEntry {
  id: string;
  rank?: number;
  studentName: string;
  nickname?: string;
  studentId?: string;
  avatarColor: string;
  avatarEmoji?: string;
  grade: string;
  school: string;
  classroomCode?: string;
  badgeTitle: string;
  points: number;
  completedModules: number; // 1-4
  isCurrentUser?: boolean;
  streakDays?: number;
  skillScores?: {
    safety: number;
    thinking: number;
    codingLab: number;
    showcase: number;
  };
}

export type AvatarCsCategory = 'coding' | 'hardware' | 'security' | 'logic' | 'custom';

export interface CsAvatarOption {
  id: string;
  emoji: string;
  label: string;
  color: string;
  glow?: string;
  category: AvatarCsCategory;
  categoryLabel?: string;
  description?: string;
}

export interface VirtualClassroomRoom {
  id: string;
  code: string;
  name: string;
  teacherName: string;
  grade: string;
  school?: string;
  description?: string;
  createdAt: string;
  studentsCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  nickname?: string;
  studentId?: string;
  avatarId: string;
  avatarEmoji: string;
  customAvatarBg?: string;
  themeColor?: string;
  school: string;
  grade: string;
  bio: string;
  motto?: string;
  codingLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  techInterests?: string[];
  contactEmail?: string;
  githubOrScratch?: string;
  joinedDate: string;
  streakDays: number;
  unlockedRewardIds: string[];
  selectedTitle: string;
  role?: 'student' | 'teacher' | 'admin';
  enrolledClassroomCode?: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requiredModule?: string;
  requiredPoints?: number;
}

export interface PointTransaction {
  id: string;
  description: string;
  amount: number;
  type: 'earn' | 'spend';
  timestamp: string;
  category: 'safety' | 'thinking' | 'coding' | 'showcase' | 'classroom';
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: 'avatar' | 'title' | 'theme';
  preview: string;
}

export interface ClassroomAssignment {
  id: string;
  title: string;
  moduleKey: 'safety' | 'thinking' | 'codingLab' | 'showcase' | 'general';
  dueDate: string;
  teacherNote: string;
  rewardPoints: number;
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
  maxScore?: number;
  instructions?: string;
  submissionDate?: string;
  submissionText?: string;
  submissionUrl?: string;
  submissionFileName?: string;
  teacherFeedback?: string;
  targetRoomCode?: string;
}

export interface ClassScheduleItem {
  id: string;
  roomCode: string;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
  dayLabel: string;
  startTime: string;
  endTime: string;
  period: number;
  subjectCode: string;
  subjectName: string;
  topic: string;
  unitTitle: string;
  roomLocation: string;
  teacherName: string;
  onlineMeetUrl?: string;
  colorTheme: string;
  materialsNote?: string;
  isLiveNow?: boolean;
}

export interface DigitalLessonMaterial {
  id: string;
  roomCode: string; // 'ALL' or specific classroom code
  title: string;
  description: string;
  fileType: 'pdf' | 'slides' | 'worksheet' | 'code' | 'video' | 'link';
  fileTypeLabel: string;
  fileName: string;
  fileSize?: string;
  downloadUrl?: string;
  externalUrl?: string;
  uploadDate: string;
  uploadedBy: string;
  unitTopic: string;
  tags: string[];
  previewSnippet?: string;
  downloadsCount: number;
}

export interface ClassroomPost {
  id: string;
  authorName: string;
  authorRole: 'teacher' | 'student';
  content: string;
  timestamp: string;
  likes: number;
  badge?: string;
}

export interface ClassroomPoll {
  id: string;
  question: string;
  context: string;
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
  totalVotes: number;
  userVotedOptionId?: string;
}

export interface DidYouKnowItem {
  id: string;
  topicNumber: 1 | 2 | 3 | 4;
  topicTitle: string;
  headline: string;
  fact: string;
  deepDive: string;
  thinkPrompt: string;
  interactiveChallenge: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  iconName: string;
}

export interface DailyJournalEntry {
  id: string;
  studentId: string;
  studentName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  mood: 'excited' | 'inspired' | 'challenged' | 'accomplished' | 'tired';
  moodEmoji: string;
  activity: string; // กิจกรรมโค้ดดิ้งวันนี้
  learningKey: string; // สิ่งที่ได้เรียนรู้ใหม่
  challengeFaced?: string; // อุปสรรคและวิธีแก้ไข
  tomorrowGoal?: string; // สิ่งที่อยากทำต่อไปในวันพรุ่งนี้
  category: 'safety' | 'thinking' | 'coding' | 'hardware' | 'reflection';
  streakDayCount: number;
  pointsEarned: number;
  todayGoal?: string; // เป้าหมายการเรียนรู้วันนี้
  todayGoalCompleted?: boolean;
}

export interface TodayLearningGoal {
  id: string;
  goal: string;
  completed: boolean;
  category: 'coding' | 'hardware' | 'thinking' | 'safety' | 'reflection';
  createdAt: string;
  completedAt?: string;
  date: string; // YYYY-MM-DD
}

// Buddy System Types
export interface BuddyProfile {
  id: string;
  name: string;
  nickname: string;
  studentId: string;
  avatarEmoji: string;
  avatarBg?: string;
  grade: string;
  school: string;
  level: number;
  points: number;
  streakDays: number;
  status: 'online' | 'learning' | 'idle';
  statusText: string;
  currentActivity: string;
  synergyLevel: number; // 1-5
  favoriteTopic: string;
  lastCompletedQuest?: {
    id: string;
    title: string;
    category: 'safety' | 'thinking' | 'coding' | 'hardware' | 'reflection';
    timeAgo: string;
    points: number;
  };
}

export interface CheerReactionOption {
  id: string;
  emoji: string;
  label: string;
  description: string;
  color: string;
  bgGradient: string;
}

export interface CheerMessage {
  id: string;
  fromName: string;
  fromEmoji: string;
  toName: string;
  emoji: string;
  text: string;
  timestamp: string;
  isFromUser: boolean;
  pointsBonus?: number;
}

export interface BuddyActivityLog {
  id: string;
  buddyId: string;
  buddyName: string;
  buddyEmoji: string;
  actionType: 'quest_complete' | 'badge_unlocked' | 'streak_record' | 'cheer_received';
  questTitle: string;
  category: string;
  pointsEarned: number;
  timestamp: string;
  celebrated?: boolean;
}

// ------------------- DIGITAL LIBRARY & E-BOOKS -------------------
export type DigitalBookCategory =
  | 'all'
  | 'microbit_manual'
  | 'ebook_cs'
  | 'scratch_guide'
  | 'cyber_pdpa'
  | 'unplugged';

export interface BookSection {
  id: string;
  title: string;
  subtitle?: string;
  paragraphs: string[];
  keyTakeaway?: string;
  codeSnippet?: {
    language: string;
    code: string;
    caption?: string;
  };
  tips?: string[];
  diagramType?: 'microbit_pinout' | 'computational_thinking' | 'flowchart' | 'pdpa_rules' | 'scratch_blocks' | 'circuit_wiring';
  callout?: {
    type: 'note' | 'warning' | 'pro_tip' | 'did_you_know';
    text: string;
  };
}

export interface DigitalBook {
  id: string;
  title: string;
  subtitle: string;
  category: 'microbit_manual' | 'ebook_cs' | 'scratch_guide' | 'cyber_pdpa' | 'unplugged';
  categoryLabel: string;
  level: string;
  author: string;
  organization: string;
  publishedYear: string;
  coverGradient: string;
  coverBorder: string;
  coverEmoji: string;
  accentColor: string;
  readTimeMinutes: number;
  totalSections: number;
  featured?: boolean;
  synopsis: string;
  targetAudience: string;
  learningOutcomes: string[];
  tableOfContents: string[];
  sections: BookSection[];
  downloadableCheatsheet?: {
    title: string;
    summaryPoints: string[];
  };
}

export interface ReadingProgressRecord {
  bookId: string;
  currentSectionIndex: number;
  completedSectionIds: string[];
  isCompleted: boolean;
  lastReadAt: string;
  bookmarkedSections: string[];
}
