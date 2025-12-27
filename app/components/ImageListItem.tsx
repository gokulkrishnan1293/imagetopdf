'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GripVertical, Settings, RotateCcw, Square, RectangleVertical, RectangleHorizontal, Globe, Check } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ImageFile } from '../utils/pdfGenerator';
import { Orientation } from './PDFOptions';

interface ImageListItemProps {
    image: ImageFile;
    index: number;
    onRemove: (id: string) => void;
    onOrientationChange: (id: string, orientation: Orientation | undefined) => void;
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

const orientationOptions: {
    value: Orientation | undefined;
    label: string;
    icon: React.ReactNode;
    description: string;
}[] = [
        {
            value: undefined,
            label: 'Use Global',
            icon: <Globe className="h-4 w-4" />,
            description: 'Use PDF settings'
        },
        {
            value: 'auto',
            label: 'Auto',
            icon: <Square className="h-4 w-4" />,
            description: 'Fit to image'
        },
        {
            value: 'portrait',
            label: 'Portrait',
            icon: <RectangleVertical className="h-4 w-4" />,
            description: 'Vertical page'
        },
        {
            value: 'landscape',
            label: 'Landscape',
            icon: <RectangleHorizontal className="h-4 w-4" />,
            description: 'Horizontal page'
        },
    ];

export function ImageListItem({ image, index, onRemove, onOrientationChange }: ImageListItemProps) {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: image.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || 'transform 150ms ease',
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showMenu]);

    const currentOrientation = orientationOptions.find(o => o.value === image.orientation) || orientationOptions[0];

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{
                opacity: isDragging ? 0.5 : 1,
                scale: isDragging ? 1.02 : 1,
                boxShadow: isDragging ? '0 10px 40px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.1)',
            }}
            exit={{ opacity: 0, x: -20 }}
            className={`
        relative flex items-center gap-3 p-3 rounded-xl
        bg-white dark:bg-zinc-800 border
        ${isDragging
                    ? 'border-violet-500 z-50'
                    : showMenu
                        ? 'border-violet-300 dark:border-violet-700 z-[100]'
                        : 'border-border hover:border-violet-300 dark:hover:border-violet-700'
                }
        transition-colors
      `}
        >
            {/* Drag handle */}
            <div
                {...attributes}
                {...listeners}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted hover:bg-violet-100 dark:hover:bg-violet-900/30 cursor-grab active:cursor-grabbing touch-none flex-shrink-0"
            >
                <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>

            {/* Page number */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white flex-shrink-0">
                {index + 1}
            </div>

            {/* Thumbnail */}
            <div className="h-14 w-14 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                <img
                    src={image.preview}
                    alt={image.name}
                    className="h-full w-full object-cover"
                    draggable={false}
                />
            </div>

            {/* File info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{image.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatFileSize(image.size)}</span>
                    {image.orientation && (
                        <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-violet-600 dark:text-violet-400">
                                {currentOrientation.icon}
                                {currentOrientation.label}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Settings menu button */}
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className={`
            flex h-10 w-10 items-center justify-center rounded-lg transition-colors flex-shrink-0
            ${showMenu
                            ? 'bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }
          `}
                    aria-label="Image settings"
                >
                    <Settings className="h-5 w-5" />
                </button>

                {/* Dropdown menu */}
                <AnimatePresence>
                    {showMenu && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-12 w-56 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-border overflow-hidden z-[9999]"
                        >
                            {/* Section: Orientation */}
                            <div className="p-2">
                                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                    <RotateCcw className="h-3 w-3" />
                                    Page Orientation
                                </div>
                                <div className="mt-1 space-y-0.5">
                                    {orientationOptions.map((option) => (
                                        <button
                                            key={option.label}
                                            onClick={() => {
                                                onOrientationChange(image.id, option.value);
                                                setShowMenu(false);
                                            }}
                                            className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
                        ${image.orientation === option.value
                                                    ? 'bg-violet-100 dark:bg-violet-900/50'
                                                    : 'hover:bg-muted'
                                                }
                      `}
                                        >
                                            <span className={`${image.orientation === option.value ? 'text-violet-600 dark:text-violet-400' : 'text-muted-foreground'}`}>
                                                {option.icon}
                                            </span>
                                            <div className="flex-1">
                                                <p className={`text-sm font-medium ${image.orientation === option.value ? 'text-violet-600 dark:text-violet-400' : 'text-foreground'}`}>
                                                    {option.label}
                                                </p>
                                                <p className="text-xs text-muted-foreground">{option.description}</p>
                                            </div>
                                            {image.orientation === option.value && (
                                                <Check className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Divider for future sections */}
                            {/* <div className="border-t border-border my-1" /> */}

                            {/* Future section placeholder */}
                            {/* <div className="p-2">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  More Options
                </div>
              </div> */}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Remove button */}
            <button
                onClick={() => onRemove(image.id)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
                aria-label={`Remove ${image.name}`}
            >
                <X className="h-5 w-5" />
            </button>
        </motion.div>
    );
}

// Drag overlay version for list items
export function ListItemDragOverlay({ image, index }: { image: ImageFile; index: number }) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-zinc-800 border-2 border-violet-500 shadow-2xl">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                <GripVertical className="h-5 w-5 text-violet-600" />
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                {index + 1}
            </div>
            <div className="h-14 w-14 rounded-lg overflow-hidden bg-muted">
                <img
                    src={image.preview}
                    alt={image.name}
                    className="h-full w-full object-cover"
                    draggable={false}
                />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{image.name}</p>
            </div>
        </div>
    );
}
