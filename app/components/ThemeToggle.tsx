'use client';

import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            onClick={toggleTheme}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                {theme === 'light' ? (
                    <Sun className="h-5 w-5 text-amber-500" />
                ) : (
                    <Moon className="h-5 w-5 text-blue-300" />
                )}
            </motion.div>
        </motion.button>
    );
}
