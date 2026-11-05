import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 py-10 text-xs text-slate-500 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
            C
          </div>
          <span className="font-semibold text-slate-800 dark:text-slate-100">Coder Kids</span>
          <span aria-hidden="true">·</span>
          <span>สื่อการเรียนรู้วิทยาการคำนวณ &amp; โลกดิจิทัล</span>
        </div>

        <div className="flex items-center gap-6">
          <span>สอดคล้องหลักสูตรแกนกลาง สพฐ. &amp; สสวท.</span>
          <span aria-hidden="true">·</span>
          <span>Creative Commons CC BY-NC 4.0</span>
        </div>
      </div>
    </footer>
  );
};
