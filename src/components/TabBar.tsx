export type Tab = 'dashboard' | 'posts' | 'preview' | 'settings';

const TABS: { id: Tab; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'posts',     label: 'Posts' },
  { id: 'preview',   label: 'Preview' },
  { id: 'settings',  label: 'Settings' },
];

interface TabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
      <div className="max-w-6xl mx-auto px-6 flex items-stretch h-10 min-w-max sm:min-w-0">
        {TABS.map((tab, index) => (
          <div key={tab.id} className="flex items-stretch">
            {index > 0 && (
              <div className="w-px bg-slate-200 dark:bg-slate-700 my-1.5" />
            )}
            <button
              onClick={() => onTabChange(tab.id)}
              className={`px-5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-blue-700 dark:text-blue-400 border-blue-700 dark:border-blue-400 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-900'
                  : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              {tab.label}
            </button>
          </div>
        ))}
      </div>
    </nav>
  );
}
