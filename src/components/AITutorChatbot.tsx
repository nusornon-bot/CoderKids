import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  Sparkles,
  MessageSquare,
  HelpCircle,
  Lightbulb,
  Code2,
  Shield,
  Brain,
  Volume2,
  VolumeX,
  RotateCcw,
  Minimize2,
  Maximize2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { UserProfile } from '../types/index.ts';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    actionType: 'navigate' | 'copy';
    target?: string;
  };
}

export interface AITutorChatbotProps {
  profile: UserProfile;
  points: number;
  activeModule?: string;
  onNavigate?: (moduleKey: string, subSection?: string) => void;
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
}

const QUICK_PROMPTS = [
  {
    icon: '🛡️',
    category: 'PDPA & ความปลอดภัย',
    prompt: 'ข้อมูลส่วนตัวแบบไหนที่ห้ามโพสต์ลงโซเชียลตาม PDPA?',
  },
  {
    icon: '🧩',
    category: 'อัลกอริทึม & ตรรกะ',
    prompt: 'ช่วยอธิบาย 4 เสาหลักการคิดเชิงคำนวณ (Computational Thinking) แบบเข้าใจง่ายๆ หน่อยครับ',
  },
  {
    icon: '🐱',
    category: 'Scratch Coding',
    prompt: 'จะเขียนบล็อกคำสั่ง Scratch ให้ตัวละครเดินชนสิ่งกีดขวางแล้วเด้งกลับและนับคะแนน ต้องทำยังไง?',
  },
  {
    icon: '📟',
    category: 'Micro:bit IoT',
    prompt: 'อยากเขียนโค้ด Micro:bit ตรวจจับอุณหภูมิห้อง ถ้าสูงเกิน 30 องศาให้แสดงไอคอนแจ้งเตือน ต้องใช้บล็อกอะไรบ้าง?',
  },
  {
    icon: '💡',
    category: 'ไอเดียโครงงาน',
    prompt: 'ช่วยแนะนำ 3 ไอเดียโครงงานสิ่งประดิษฐ์วิทยาการคำนวณสำหรับส่งประกวดโครงงาน ป.4-ป.6 หน่อยครับ',
  },
  {
    icon: '🔁',
    category: 'การทำซ้ำ (Loops)',
    prompt: 'การวนซ้ำแบบมีเงื่อนไข (While) กับวนซ้ำตามจำนวนรอบ (Repeat) แตกต่างกันอย่างไร ขอยกตัวอย่างในชีวิตประจำวัน',
  },
];

export const AITutorChatbot: React.FC<AITutorChatbotProps> = ({
  profile,
  points,
  activeModule = 'dashboard',
  onNavigate,
  isOpenExternal,
  onCloseExternal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg_welcome',
        role: 'model',
        text: `สวัสดีครับน้อง ${profile.nickname || profile.name || 'คนเก่ง'}! 👋 ครูพี่โค้ดดิ้ง (Coder Kids AI Tutor) ยินดีต้อนรับครับ! 🤖✨\n\nน้องๆ สามารถถามคำถามเกี่ยวกับ:\n1. 🛡️ ความปลอดภัยไซเบอร์ & กฎหมาย PDPA\n2. 🧩 การคิดเชิงคำนวณและผังงาน Flowchart\n3. 💻 การเขียนบล็อก Scratch & บอร์ด Micro:bit\n4. 💡 ขอคำแนะนำหรือไอเดียทำโครงงานวิทยาการคำนวณ\n\nมีข้อสงสัยหรือติดปัญหาตรงไหน พิมพ์ถามหรือเลือกหัวข้อด้านล่างได้เลยนะครับ!`,
        timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external open state if provided
  useEffect(() => {
    if (typeof isOpenExternal === 'boolean') {
      setIsOpen(isOpenExternal);
      if (isOpenExternal) {
        setIsMinimized(false);
      }
    }
  }, [isOpenExternal]);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  // Web Speech API text-to-speech for children who want to listen
  const speakText = (text: string) => {
    if (!speechEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    // Clean markdown stars and special symbols for natural speech
    const clean = text.replace(/[*_#`]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'th-TH';
    utterance.rate = 1.0;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: messages.map((m) => ({ role: m.role, text: m.text })),
          studentContext: {
            name: profile.name,
            nickname: profile.nickname,
            grade: profile.grade,
            school: profile.school,
            points,
            activeModule,
          },
        }),
      });

      const data = await response.json();

      let replyText = '';
      if (response.ok && data.reply) {
        replyText = data.reply;
      } else if (data.fallbackReply) {
        replyText = data.fallbackReply;
      } else {
        replyText =
          'ขออภัยครับน้องๆ ตอนนี้ระบบกำลังอัปเดตข้อมูล ครูพี่โค้ดดิ้งแนะนำให้น้องๆ ตรวจสอบบทเรียนในแผนที่การเรียนรู้ (Roadmap) หรือลองถามใหม่อีกครั้งในอีกสักครู่ครับ! 🤖';
      }

      const botMsg: ChatMessage = {
        id: `msg_bot_${Date.now()}`,
        role: 'model',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      speakText(replyText);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        role: 'model',
        text: 'ขออภัยครับน้องๆ ระบบเครือข่ายมีข้อขัดข้องชั่วคราว ลองตรวจสอบการเชื่อมต่ออินเทอร์เน็ตแล้วลองส่งคำถามใหม่อีกครั้งนะครับ! 🌐',
        timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    if (window.confirm('ต้องการล้างประวัติการสนทนากับครูพี่โค้ดดิ้งหรือไม่?')) {
      setMessages([
        {
          id: `msg_welcome_${Date.now()}`,
          role: 'model',
          text: `เริ่มบทสนทนาใหม่แล้วครับ! น้อง ${profile.nickname || profile.name || 'คนเก่ง'} มีเรื่องอะไรอยากปรึกษาครูพี่โค้ดดิ้งถามได้เลยนะครับ 🤖💡`,
          timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const handleToggleClose = () => {
    setIsOpen(false);
    if (onCloseExternal) {
      onCloseExternal();
    }
  };

  return (
    <>
      {/* ----------------- FLOATING LAUNCHER BUTTON ----------------- */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 group">
          {/* Friendly Popover Tooltip */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-lg animate-bounce pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>มีคำถามเรื่องโค้ดดิ้ง ทักครูพี่โค้ดได้นะ!</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="relative p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center border-2 border-white/40"
            aria-label="เปิดหน้าต่าง AI Tutor ครูพี่โค้ดดิ้ง"
            title="ปรึกษาครูพี่โค้ดดิ้ง (AI Tutor)"
          >
            <Bot className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
          </button>
        </div>
      )}

      {/* ----------------- EXPANDED CHAT PANEL / MODAL ----------------- */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isMinimized
              ? 'bottom-6 right-6 w-72 sm:w-80'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 md:w-[420px] max-w-full h-[580px] max-h-[85vh]'
          }`}
          role="dialog"
          aria-label="AI Tutor Chatbot"
        >
          <div className="w-full h-full bg-white rounded-3xl shadow-2xl border border-indigo-200/90 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500 text-white flex items-center justify-center font-bold text-lg shadow-inner border border-white/20">
                    🤖
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-indigo-900 rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-white">ครูพี่โค้ดดิ้ง (AI Tutor)</h3>
                    <span className="px-1.5 py-0.2 rounded-md bg-indigo-500/30 border border-indigo-400/40 text-[10px] font-mono text-indigo-200">
                      Gemini
                    </span>
                  </div>
                  <p className="text-[11px] text-indigo-200">ผู้ช่วยสอนวิทยาการคำนวณและที่ปรึกษาโครงงาน</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                {/* Speech read-out toggle */}
                <button
                  type="button"
                  onClick={() => setSpeechEnabled(!speechEnabled)}
                  className={`p-1.5 rounded-xl transition-colors ${
                    speechEnabled ? 'bg-amber-500 text-white' : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                  title={speechEnabled ? 'ปิดเสียงอ่านคำตอบ' : 'เปิดเสียงอ่านคำตอบ (Audio Voice)'}
                  aria-label="เปิด/ปิดเสียงอ่าน"
                >
                  {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Clear chat history */}
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  title="เริ่มบทสนทนาใหม่"
                  aria-label="เริ่มบทสนทนาใหม่"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Minimize / Maximize */}
                <button
                  type="button"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  title={isMinimized ? 'ขยายหน้าต่าง' : 'ย่อหน้าต่าง'}
                  aria-label="ย่อ/ขยาย"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>

                {/* Close */}
                <button
                  type="button"
                  onClick={handleToggleClose}
                  className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  title="ปิดหน้าต่าง"
                  aria-label="ปิดหน้าต่าง"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* When not minimized: Messages List and Input */}
            {!isMinimized && (
              <>
                {/* Chat Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60 text-xs sm:text-sm">
                  {messages.map((msg) => {
                    const isUser = msg.role === 'user';
                    return (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        {/* Avatar */}
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs text-sm ${
                            isUser
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white border border-indigo-200 text-indigo-700'
                          }`}
                        >
                          {isUser ? profile.avatarEmoji || '🐱' : '🤖'}
                        </div>

                        {/* Bubble Content */}
                        <div
                          className={`relative max-w-[82%] rounded-2xl p-3.5 shadow-xs space-y-1 ${
                            isUser
                              ? 'bg-indigo-600 text-white rounded-tr-xs'
                              : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                          }`}
                        >
                          {/* Sender Label */}
                          <div
                            className={`flex items-center justify-between text-[10px] pb-1 border-b ${
                              isUser
                                ? 'text-indigo-200 border-indigo-500/50'
                                : 'text-slate-400 border-slate-100'
                            }`}
                          >
                            <span className="font-bold">
                              {isUser ? profile.nickname || profile.name || 'คุณ' : 'ครูพี่โค้ดดิ้ง'}
                            </span>
                            <span>{msg.timestamp}</span>
                          </div>

                          {/* Message Body (Pre-wrap for formatted code and paragraphs) */}
                          <div className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm break-words">
                            {msg.text}
                          </div>

                          {/* Copy Button for Bot Messages */}
                          {!isUser && (
                            <div className="pt-1.5 flex items-center justify-end gap-2 border-t border-slate-100 text-[11px] text-slate-400">
                              <button
                                type="button"
                                onClick={() => handleCopyText(msg.id, msg.text)}
                                className="hover:text-indigo-600 flex items-center gap-1 transition-colors"
                              >
                                {copiedId === msg.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span className="text-emerald-600">คัดลอกแล้ว</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>คัดลอก</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isLoading && (
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-white border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0 shadow-xs text-sm">
                        🤖
                      </div>
                      <div className="bg-white rounded-2xl rounded-tl-xs p-3.5 border border-slate-200 shadow-xs text-xs text-slate-500 flex items-center gap-2">
                        <span className="inline-flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </span>
                        <span className="text-[11px] text-slate-400">ครูพี่โค้ดดิ้งกำลังคิดคำตอบ...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Suggested Question Chips (Scrollable) */}
                <div className="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto flex items-center gap-1.5 shrink-0 scrollbar-none">
                  <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap pl-1">
                    💡 คำถามแนะนำ:
                  </span>
                  {QUICK_PROMPTS.map((qp, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleSendMessage(qp.prompt)}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-[11px] font-medium whitespace-nowrap border border-slate-200 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1"
                    >
                      <span>{qp.icon}</span>
                      <span>{qp.category}</span>
                    </button>
                  ))}
                </div>

                {/* Input Field & Submit */}
                <div className="p-3 bg-white border-t border-slate-200 shrink-0">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="พิมพ์คำถามเกี่ยวกับบทเรียนหรือโครงงาน..."
                      disabled={isLoading}
                      className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 focus:bg-white text-xs sm:text-sm text-slate-900 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || isLoading}
                      className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 disabled:hover:bg-indigo-600 shadow-md transition-all active:scale-95 shrink-0"
                      aria-label="ส่งข้อความ"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 pt-1.5">
                    <span>💡 ขับเคลื่อนด้วย Google Gemini API</span>
                    <span>ป้อนคำถามได้ทั้งไทยและอังกฤษ</span>
                  </div>
                </div>
              </>
            )}

            {/* Minimized Bar Content */}
            {isMinimized && (
              <div
                onClick={() => setIsMinimized(false)}
                className="p-3 bg-slate-50 cursor-pointer flex items-center justify-between hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  <span>คลิกเพื่อเปิดบทสนทนาต่อ ({messages.length} ข้อความ)</span>
                </div>
                <ChevronUp className="w-4 h-4 text-slate-400" />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
