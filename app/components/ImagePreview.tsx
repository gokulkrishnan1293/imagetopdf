'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GripVertical, Settings, RotateCcw, Square, RectangleVertical, RectangleHorizontal, Globe, Check } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ImageFile } from '../utils/pdfGenerator';
import { Orientation } from './PDFOptions';

interface ImagePreviewProps {
    image: ImageFile;
    onRemove: (id: string) => void;
    onOrientationChange: (id: string, orientation: Orientation | undefined) => void;
    isDragOverlay?: boolean;
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

export function ImagePreview({ image, onRemove, onOrientationChange, isDragOverlay }: ImagePreviewProps) {
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
        transition: transition || 'transform 200ms cubic-bezier(0.25, 1, 0.5, 1)',
        zIndex: isDragging ? 1000 : undefined,
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

    if (isDragOverlay) {
        return (
            <motion.div
                initial={{ scale: 1.05, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                animate={{ scale: 1.08, rotate: 2 }}
                className="aspect-square rounded-xl overflow-hidden bg-white dark:bg-zinc-800 shadow-2xl border-2 border-violet-500 cursor-grabbing"
            >
                <img
                    src={image.preview}
                    alt={image.name}
                    className="h-full w-full object-cover"
                    draggable={false}
                />
                <div className="absolute inset-0 bg-violet-500/10" />
            </motion.div>
        );
    }

    const currentOrientation = orientationOptions.find(o => o.value === image.orientation);

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            layout
            layoutId={image.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
                opacity: isDragging ? 0.4 : 1,
                scale: isDragging ? 0.95 : 1,
            }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            transition={{
                layout: { type: 'spring', stiffness: 350, damping: 25 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 },
            }}
            className={`
        group relative aspect-square rounded-xl overflow-visible
        bg-white dark:bg-zinc-800 shadow-lg
        border-2 transition-all duration-200
        ${isDragging
                    ? 'border-violet-500/50 border-dashed'
                    : showMenu
                        ? 'border-violet-400 dark:border-violet-500 z-[100]'
                        : 'border-transparent hover:border-violet-400 dark:hover:border-violet-500 hover:shadow-xl'
                }
      `}
        >
            {/* Image */}
            <div className="absolute inset-0 rounded-xl overflow-hidden">
                <img
                    src={image.preview}
                    alt={image.name}
                    className="h-full w-full object-cover"
                    draggable={false}
                />
            </div>

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

            {/* Drag handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
                <div className="absolute top-2 left-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <GripVertical className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
                </div>
            </div>

            {/* Orientation indicator badge */}
            {image.orientation && currentOrientation && (
                <div className="absolute top-2 left-12 flex h-8 px-2 items-center gap-1.5 rounded-lg bg-violet-500/90 backdrop-blur-sm shadow-md text-xs font-medium text-white">
                    {currentOrientation.icon}
                    <span className="hidden sm:inline">{currentOrientation.label}</span>
                </div>
            )}

            {/* Settings button */}
            <div className="absolute bottom-12 right-2" ref={menuRef}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(!showMenu);
                    }}
                    className={`
            flex h-8 w-8 items-center justify-center rounded-lg backdrop-blur-sm shadow-md transition-all z-10
            ${showMenu
                            ? 'bg-violet-500 text-white'
                            : 'bg-white/90 dark:bg-zinc-800/90 opacity-0 group-hover:opacity-100 hover:bg-violet-100 dark:hover:bg-violet-900/50 text-zinc-600 dark:text-zinc-300'
                        }
          `}
                    aria-label="Image settings"
                >
                    <Settings className="h-4 w-4" />
                </button>

                {/* Settings menu */}
                <AnimatePresence>
                    {showMenu && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.15 }}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 bottom-10 w-56 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-border overflow-hidden z-[9999]"
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
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Remove button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(image.id);
                }}
                className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/90 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:scale-110 z-10"
                aria-label={`Remove ${image.name}`}
            >
                <X className="h-4 w-4 text-white" />
            </button>

            {/* File info */}
            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <p className="text-xs sm:text-sm font-medium text-white truncate">{image.name}</p>
                <p className="text-xs text-white/70">{formatFileSize(image.size)}</p>
            </div>
        </motion.div>
    );
}

// Simplified preview for drag overlay
export function DragOverlayPreview({ image }: { image: ImageFile }) {
    return (
        <div className="aspect-square w-40 rounded-xl overflow-hidden bg-white dark:bg-zinc-800 shadow-2xl border-2 border-violet-500 rotate-3 cursor-grabbing">
            <img
                src={image.preview}
                alt={image.name}
                className="h-full w-full object-cover"
                draggable={false}
            />
            <div className="absolute inset-0 bg-violet-500/10" />
        </div>
    );
}
