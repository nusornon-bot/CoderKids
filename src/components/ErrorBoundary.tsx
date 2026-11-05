import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Coder Kids application:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetAll = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then((names) => {
          for (const name of names) {
            caches.delete(name);
          }
        });
      }
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-lg w-full bg-slate-800/90 border border-slate-700 rounded-3xl p-8 text-center space-y-6 shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-3xl">
              🚀
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">
                พร้อมเริ่มเรียนรู้กับ Coder Kids แล้ว!
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                ระบบได้รีเซ็ตและเตรียมความพร้อมของแอปพลิเคชันให้ทำงานได้อย่างราบรื่น
              </p>
            </div>

            {this.state.error && (
              <div className="text-left bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-[11px] font-mono text-rose-300 max-h-32 overflow-y-auto">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                🔄 โหลดหน้าเว็บใหม่ (Reload)
              </button>
              <button
                type="button"
                onClick={this.handleResetAll}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs transition-all cursor-pointer"
              >
                🧹 ล้างแคชและเริ่มใหม่ (Clear Cache)
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
