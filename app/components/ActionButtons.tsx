'use client';

import { motion } from 'framer-motion';
import { Trash2, Download, Loader2 } from 'lucide-react';

interface ActionButtonsProps {
    imageCount: number;
    isGenerating: boolean;
    onClearAll: () => void;
    onDownload: () => void;
}

export function ActionButtons({
    imageCount,
    isGenerating,
    onClearAll,
    onDownload,
}: ActionButtonsProps) {
    const hasImages = imageCount > 0;

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            {/* Image count badge */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800"
            >
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                    {imageCount} {imageCount === 1 ? 'image' : 'images'} selected
                </span>
            </motion.div>

            <div className="flex-1" />

            {/* Clear All button */}
            <motion.button
                onClick={onClearAll}
                disabled={!hasImages || isGenerating}
                className={`
          flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium
          transition-all duration-200
          ${hasImages && !isGenerating
                        ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-600'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
                    }
        `}
                whileHover={hasImages && !isGenerating ? { scale: 1.02 } : {}}
                whileTap={hasImages && !isGenerating ? { scale: 0.98 } : {}}
            >
                <Trash2 className="h-4 w-4" />
                <span>Clear All</span>
            </motion.button>

            {/* Download PDF button */}
            <motion.button
                onClick={onDownload}
                disabled={!hasImages || isGenerating}
                className={`
          relative flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium
          transition-all duration-200 overflow-hidden
          ${hasImages && !isGenerating
                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30'
                        : 'bg-zinc-300 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-500 cursor-not-allowed'
                    }
        `}
                whileHover={hasImages && !isGenerating ? { scale: 1.02 } : {}}
                whileTap={hasImages && !isGenerating ? { scale: 0.98 } : {}}
            >
                {isGenerating ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Generating...</span>
                    </>
                ) : (
                    <>
                        <Download className="h-4 w-4" />
                        <span>Download PDF</span>
                    </>
                )}
            </motion.button>
        </div>
    );
}
