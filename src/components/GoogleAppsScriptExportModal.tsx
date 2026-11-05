import React, { useState } from 'react';
import {
  FileCode,
  Download,
  Copy,
  Check,
  ExternalLink,
  X,
  Code2,
  FileSpreadsheet,
  Terminal,
  BookOpen,
  FolderArchive,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import {
  GAS_EXPORT_TEMPLATES,
  GasFileTemplate,
  GAS_SPREADSHEET_ID,
} from '../data/gasExportTemplates.ts';

interface GoogleAppsScriptExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  spreadsheetId?: string;
}

export const GoogleAppsScriptExportModal: React.FC<GoogleAppsScriptExportModalProps> = ({
  isOpen,
  onClose,
  spreadsheetId = GAS_SPREADSHEET_ID,
}) => {
  const [selectedFileIdx, setSelectedFileIdx] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentFile: GasFileTemplate = GAS_EXPORT_TEMPLATES[selectedFileIdx];

  // Helper to trigger single file download
  const handleDownloadFile = (file: GasFileTemplate) => {
    try {
      const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadStatus(`ดาวน์โหลดไฟล์ ${file.filename} เรียบร้อยแล้ว`);
      setTimeout(() => setDownloadStatus(null), 3000);
    } catch (e) {
      console.error('Download error:', e);
    }
  };

  // Helper to trigger batch download of all 4 files
  const handleDownloadAllFiles = () => {
    try {
      GAS_EXPORT_TEMPLATES.forEach((file, index) => {
        setTimeout(() => {
          const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = file.filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, index * 250);
      });

      setDownloadStatus('ดาวน์โหลดชุดไฟล์สำหรับ Google Apps Script ครบทั้ง 4 ไฟล์เรียบร้อยแล้ว!');
      setTimeout(() => setDownloadStatus(null), 4000);
    } catch (e) {
      console.error('Batch download error:', e);
    }
  };

  // Helper to copy content to clipboard
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(currentFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Copy failed:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 shrink-0">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  ส่งออกไฟล์สำหรับพัฒนาต่อกับ Google Apps Script (GAS)
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                  พร้อมใช้งาน 100%
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ชุดไฟล์สคริปต์เซิร์ฟเวอร์, เทมเพลตเว็บแอป และคู่มือติดตั้งบน Google Sheets ID: {spreadsheetId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
            title="ปิดหน้าต่าง"
            aria-label="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Step Deployment Visual Guide Strip */}
        <div className="px-5 py-3.5 bg-indigo-50/50 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/40 text-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-indigo-950 dark:text-indigo-200 font-medium">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>4 ขั้นตอนง่ายๆ:</span>
            <span className="hidden sm:inline text-indigo-700 dark:text-indigo-300">
              1. เปิด Sheets &gt; 2. วาง Code.gs &amp; Index.html &gt; 3. รัน setupCoderKidsDatabase &gt; 4. Deploy เป็น Web App
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 font-semibold text-xs transition-all shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>เปิด Google Sheets</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <button
              onClick={handleDownloadAllFiles}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-xs transition-all shadow-sm shadow-indigo-600/20"
            >
              <FolderArchive className="w-3.5 h-3.5" />
              <span>ดาวน์โหลดทั้ง 4 ไฟล์</span>
            </button>
          </div>
        </div>

        {/* Download notification alert if any */}
        {downloadStatus && (
          <div className="px-5 py-2.5 bg-emerald-50 dark:bg-emerald-950/50 border-b border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {downloadStatus}
            </span>
            <button onClick={() => setDownloadStatus(null)} className="text-emerald-600 hover:underline">
              รับทราบ
            </button>
          </div>
        )}

        {/* File Tabs & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          {/* File Switcher Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {GAS_EXPORT_TEMPLATES.map((file, idx) => (
              <button
                key={file.filename}
                onClick={() => setSelectedFileIdx(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedFileIdx === idx
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{file.name}</span>
              </button>
            ))}
          </div>

          {/* Current File Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all active:scale-95"
              title="คัดลอกโค้ดทั้งหมดของไฟล์นี้"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-bold">คัดลอกแล้ว!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>คัดลอกโค้ด</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleDownloadFile(currentFile)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 text-xs font-semibold transition-all active:scale-95"
              title={`ดาวน์โหลด ${currentFile.filename}`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลด {currentFile.filename}</span>
            </button>
          </div>
        </div>

        {/* File Description Header */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 truncate">
            <Terminal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{currentFile.filename}</span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline truncate">{currentFile.description}</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 shrink-0">
            {currentFile.content.split('\n').length} บรรทัด
          </span>
        </div>

        {/* Code Content Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed custom-scrollbar selection:bg-indigo-600 selection:text-white">
          <pre className="whitespace-pre-wrap break-all sm:break-normal font-mono">
            {currentFile.content}
          </pre>
        </div>

        {/* Footer info & deployment summary */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Info className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>
              ไฟล์ทั้งหมดถูกบันทึกไว้ในโฟลเดอร์ <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono">/gas-export/</code> ในโปรเจกต์แล้วเช่นกัน
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
            >
              ปิดหน้าต่าง
            </button>
            <button
              onClick={handleDownloadAllFiles}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-all active:scale-95"
            >
              ดาวน์โหลดครบทั้งชุด (.gs / .html / .json / .md)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
