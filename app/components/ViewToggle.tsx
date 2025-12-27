'use client';

import { LayoutGrid, List } from 'lucide-react';

export type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
    mode: ViewMode;
    onModeChange: (mode: ViewMode) => void;
}

export function ViewToggle({ mode, onModeChange }: ViewToggleProps) {
    return (
        <div className="inline-flex items-center rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1 gap-1">
            <button
                onClick={() => onModeChange('grid')}
                className={`
          flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
          ${mode === 'grid'
                        ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }
        `}
                aria-label="Grid view"
            >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Grid</span>
            </button>
            <button
                onClick={() => onModeChange('list')}
                className={`
          flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
          ${mode === 'list'
                        ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }
        `}
                aria-label="List view"
            >
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">List</span>
            </button>
        </div>
    );
}
