import type { Theme } from '../hooks/useTheme';

interface TopNavProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export default function TopNav({ theme, onToggleTheme }: TopNavProps) {
  return (
    <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-[15px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
              TrendLink
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
              Multi-Platform Post Automation
            </p>
          </div>
        </div>

        <button
          onClick={onToggleTheme}
          className="text-xl p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
}
