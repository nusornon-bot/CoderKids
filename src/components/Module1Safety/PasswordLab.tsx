import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Check, X, ShieldAlert, Sparkles } from 'lucide-react';

interface PasswordLabProps {
  addPoints: (points: number) => void;
}

export const PasswordLab: React.FC<PasswordLabProps> = ({ addPoints }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hasAwardedPoints, setHasAwardedPoints] = useState(false);

  // Criteria checks
  const hasLength = password.length >= 10;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const passedCriteria = [hasLength, hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;

  let strengthLabel = 'อ่อนมาก (เสี่ยงสูง)';
  let strengthColor = 'text-rose-600 bg-rose-50 border-rose-200';
  let crackTime = 'น้อยกว่า 1 วินาที (แฮกเกอร์เจาะได้ทันที)';

  if (passedCriteria === 5 && password.length >= 12) {
    strengthLabel = 'แข็งแกร่งมาก (ปลอดภัยสูง)';
    strengthColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    crackTime = 'ประมาณ 2,500 ปี (ด้วยคอมพิวเตอร์ระดับซูเปอร์คอมพิวเตอร์)';
  } else if (passedCriteria >= 4) {
    strengthLabel = 'แข็งแกร่ง (ปลอดภัยดี)';
    strengthColor = 'text-emerald-600 bg-emerald-50/70 border-emerald-200';
    crackTime = 'ประมาณ 30 ปี';
  } else if (passedCriteria >= 3) {
    strengthLabel = 'ปานกลาง (ควรปรับปรุง)';
    strengthColor = 'text-amber-600 bg-amber-50 border-amber-200';
    crackTime = 'ประมาณ 2 สัปดาห์';
  } else if (password.length > 0) {
    strengthLabel = 'อ่อนแอ (อันตราย)';
    strengthColor = 'text-rose-600 bg-rose-50 border-rose-200';
    crackTime = 'ประมาณ 2-5 นาที';
  }

  const handleGenerateStrong = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*';
    let res = '';
    for (let i = 0; i < 14; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(res);
    if (!hasAwardedPoints) {
      addPoints(15);
      setHasAwardedPoints(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
      <div className="mb-6 pb-4 border-b border-slate-100">
        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">ห้องปฏิบัติการไซเบอร์</span>
        <h3 className="text-xl font-bold text-slate-900 mt-0.5">
          เครื่องมือทดสอบความปลอดภัยของรหัสผ่าน (Password Strength Lab)
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          ทดลองป้อนหรือสร้างรหัสผ่านเพื่อดูระยะเวลาที่คอมพิวเตอร์ของแฮกเกอร์ใช้ในการสุ่มถอดรหัส (Brute-force)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left input and strength meter */}
        <div className="lg:col-span-7 space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              ลองพิมพ์รหัสผ่านจำลอง (ไม่ใช้รหัสผ่านจริงของคุณเพื่อความปลอดภัย)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="พิมพ์รหัสผ่านเพื่อทดสอบ เช่น Hero_Pass@2026"
                className="w-full px-4 py-3 pr-24 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono tracking-wide"
              />
              <div className="absolute inset-y-0 right-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
                  title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleGenerateStrong}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>สร้างรหัสผ่านปลอดภัยอัตโนมัติ</span>
            </button>
            {password && (
              <button
                onClick={() => setPassword('')}
                className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800"
              >
                ล้างข้อมูล
              </button>
            )}
          </div>

          {/* Strength Bar */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">ระดับความปลอดภัย:</span>
              <span className={`font-semibold px-2.5 py-0.5 rounded-md border text-xs ${strengthColor}`}>
                {strengthLabel}
              </span>
            </div>

            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  passedCriteria <= 2
                    ? 'bg-rose-500'
                    : passedCriteria <= 3
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.max(password ? 15 : 0, (passedCriteria / 5) * 100)}%` }}
              />
            </div>

            <div className="text-xs text-slate-600 pt-1">
              <span className="font-medium text-slate-700">ประมาณการเวลาในการเจาะรหัสผ่าน: </span>
              <span className="font-semibold text-slate-900">{password ? crackTime : 'ยังไม่ได้ป้อนรหัสผ่าน'}</span>
            </div>
          </div>
        </div>

        {/* Right: Checklist Rules */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
          <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600" />
            <span>เกณฑ์รหัสผ่านปลอดภัย 5 ประการ</span>
          </h4>

          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-center gap-2">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${hasLength ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-400'}`}>
                {hasLength ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              </span>
              <span>ความยาวอย่างน้อย 10-12 ตัวอักษรขึ้นไป</span>
            </li>
            <li className="flex items-center gap-2">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${hasUpper ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-400'}`}>
                {hasUpper ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              </span>
              <span>มีตัวอักษรพิมพ์ใหญ่ (A-Z) อย่างน้อย 1 ตัว</span>
            </li>
            <li className="flex items-center gap-2">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${hasLower ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-400'}`}>
                {hasLower ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              </span>
              <span>มีตัวอักษรพิมพ์เล็ก (a-z)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${hasNumber ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-400'}`}>
                {hasNumber ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              </span>
              <span>มีตัวเลข (0-9)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${hasSymbol ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-400'}`}>
                {hasSymbol ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              </span>
              <span>มีสัญลักษณ์หรืออักขระพิเศษ (@, #, $, %, &amp;)</span>
            </li>
          </ul>

          <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 leading-normal">
            <span className="font-semibold text-rose-600">ข้อควรระวัง: </span>
            หลีกเลี่ยงการใช้วันเกิด เบอร์โทรศัพท์ หรือคำในพจนานุกรมเดี่ยวๆ และเปิดใช้งานการยืนยันตัวตนสองชั้น (2FA) เสมอ
          </div>
        </div>
      </div>
    </div>
  );
};
