'use client';

import { motion } from 'framer-motion';
import { FileText, RotateCcw, Shrink, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export type Orientation = 'auto' | 'portrait' | 'landscape';
export type Quality = 'high' | 'medium' | 'low';

export interface PDFSettings {
    filename: string;
    orientation: Orientation;
    quality: Quality;
}

interface PDFOptionsProps {
    settings: PDFSettings;
    onSettingsChange: (settings: PDFSettings) => void;
    disabled?: boolean;
}

const qualityLabels: Record<Quality, { label: string; description: string }> = {
    high: { label: 'High Quality', description: 'Best quality, larger file' },
    medium: { label: 'Medium', description: 'Balanced quality and size' },
    low: { label: 'Compressed', description: 'Smaller file, reduced quality' },
};

const orientationLabels: Record<Orientation, { label: string; icon: string }> = {
    auto: { label: 'Auto (Fit to image)', icon: '⬜' },
    portrait: { label: 'Portrait', icon: '📄' },
    landscape: { label: 'Landscape', icon: '🖼️' },
};

export function PDFOptions({ settings, onSettingsChange, disabled }: PDFOptionsProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    const updateSetting = <K extends keyof PDFSettings>(key: K, value: PDFSettings[K]) => {
        onSettingsChange({ ...settings, [key]: value });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden"
        >
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-500/20">
                        <FileText className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                    </div>
                    <span className="font-medium text-foreground">PDF Options</span>
                </div>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                </motion.div>
            </button>

            {/* Content */}
            <motion.div
                initial={false}
                animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
            >
                <div className="p-4 pt-0 space-y-5">
                    {/* Filename */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            Filename
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={settings.filename}
                                onChange={(e) => updateSetting('filename', e.target.value)}
                                placeholder="my-images"
                                disabled={disabled}
                                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all disabled:opacity-50"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                .pdf
                            </span>
                        </div>
                    </div>

                    {/* Orientation */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                            <RotateCcw className="h-4 w-4 text-muted-foreground" />
                            Page Orientation
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {(Object.entries(orientationLabels) as [Orientation, { label: string; icon: string }][]).map(
                                ([value, { label, icon }]) => (
                                    <button
                                        key={value}
                                        onClick={() => updateSetting('orientation', value)}
                                        disabled={disabled}
                                        className={`
                      flex flex-col items-center gap-1 p-3 rounded-xl border transition-all
                      ${settings.orientation === value
                                                ? 'border-violet-500 bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400'
                                                : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:border-violet-300 dark:hover:border-violet-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                                            }
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                                    >
                                        <span className="text-lg">{icon}</span>
                                        <span className="text-xs font-medium">{label.split(' ')[0]}</span>
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    {/* Quality */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground flex items-center gap-2">
                            <Shrink className="h-4 w-4 text-muted-foreground" />
                            Image Quality
                        </label>
                        <div className="space-y-2">
                            {(Object.entries(qualityLabels) as [Quality, { label: string; description: string }][]).map(
                                ([value, { label, description }]) => (
                                    <button
                                        key={value}
                                        onClick={() => updateSetting('quality', value)}
                                        disabled={disabled}
                                        className={`
                      w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left
                      ${settings.quality === value
                                                ? 'border-violet-500 bg-violet-100 dark:bg-violet-500/20'
                                                : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:border-violet-300 dark:hover:border-violet-700'
                                            }
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                                    >
                                        <div>
                                            <p className={`text-sm font-medium ${settings.quality === value ? 'text-violet-700 dark:text-violet-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
                                                {label}
                                            </p>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
                                        </div>
                                        <div
                                            className={`
                        w-4 h-4 rounded-full border-2 flex items-center justify-center
                        ${settings.quality === value
                                                    ? 'border-violet-500 bg-violet-500'
                                                    : 'border-muted-foreground'
                                                }
                      `}
                                        >
                                            {settings.quality === value && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="w-1.5 h-1.5 rounded-full bg-white"
                                                />
                                            )}
                                        </div>
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
