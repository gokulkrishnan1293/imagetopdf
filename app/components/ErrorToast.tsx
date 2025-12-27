'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

interface ErrorToastProps {
    message: string | null;
    onDismiss: () => void;
}

export function ErrorToast({ message, onDismiss }: ErrorToastProps) {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(onDismiss, 5000);
            return () => clearTimeout(timer);
        }
    }, [message, onDismiss]);

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                    className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md"
                >
                    <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 shadow-xl backdrop-blur-sm">
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-800 dark:text-red-200 whitespace-pre-line">
                                {message}
                            </p>
                        </div>
                        <button
                            onClick={onDismiss}
                            className="flex-shrink-0 p-1 rounded-lg hover:bg-red-200/50 dark:hover:bg-red-800/50 transition-colors"
                        >
                            <X className="h-4 w-4 text-red-500" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
