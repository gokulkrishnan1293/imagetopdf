'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
    progress: number;
    isVisible: boolean;
}

export function ProgressBar({ progress, isVisible }: ProgressBarProps) {
    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50"
        >
            <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-zinc-200/50 dark:border-zinc-700/50">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                        Generating PDF...
                    </span>
                    <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">
                        {Math.round(progress)}%
                    </span>
                </div>
                <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                </div>
            </div>
        </motion.div>
    );
}
