'use client';

import { useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface DropZoneProps {
    onFilesAccepted: (files: File[]) => void;
    onError: (message: string) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
};

export function DropZone({ onFilesAccepted, onError }: DropZoneProps) {
    const onDrop = useCallback(
        (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
            if (rejectedFiles.length > 0) {
                const errors = rejectedFiles.map((rejection) => {
                    if (rejection.errors.some((e) => e.code === 'file-too-large')) {
                        return `${rejection.file.name} is too large (max 10MB)`;
                    }
                    if (rejection.errors.some((e) => e.code === 'file-invalid-type')) {
                        return `${rejection.file.name} is not a supported format (JPG, PNG, WebP only)`;
                    }
                    return `${rejection.file.name} was rejected`;
                });
                onError(errors.join('\n'));
            }

            if (acceptedFiles.length > 0) {
                onFilesAccepted(acceptedFiles);
            }
        },
        [onFilesAccepted, onError]
    );

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: ACCEPTED_TYPES,
        maxSize: MAX_FILE_SIZE,
        multiple: true,
    });

    // Destructure out event handlers that conflict with Framer Motion's types
    const {
        onDrag, onDragStart, onDragEnd, onDragOver, onDragEnter, onDragLeave,
        onAnimationStart, onAnimationEnd,
        ...rootProps
    } = getRootProps();

    return (
        <motion.div
            {...rootProps}
            className={`
        relative overflow-hidden rounded-2xl border-2 border-dashed p-8 sm:p-12 cursor-pointer
        transition-all duration-300 ease-out
        ${isDragActive && !isDragReject
                    ? 'border-violet-500 bg-violet-500/10 scale-[1.02]'
                    : isDragReject
                        ? 'border-red-500 bg-red-500/10'
                        : 'border-zinc-300 dark:border-zinc-700 hover:border-violet-400 dark:hover:border-violet-500 bg-white/50 dark:bg-zinc-900/50'
                }
        backdrop-blur-sm
      `}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
        >
            <input {...getInputProps()} />

            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5 pointer-events-none" />

            <div className="relative flex flex-col items-center justify-center gap-4 text-center">
                <motion.div
                    className={`
            flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full
            ${isDragReject
                            ? 'bg-red-100 dark:bg-red-900/30'
                            : 'bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/30 dark:to-fuchsia-900/30'
                        }
          `}
                    animate={isDragActive ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                    transition={{ duration: 0.5, repeat: isDragActive ? Infinity : 0 }}
                >
                    {isDragReject ? (
                        <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 text-red-500" />
                    ) : isDragActive ? (
                        <ImageIcon className="h-8 w-8 sm:h-10 sm:w-10 text-violet-600 dark:text-violet-400" />
                    ) : (
                        <Upload className="h-8 w-8 sm:h-10 sm:w-10 text-violet-600 dark:text-violet-400" />
                    )}
                </motion.div>

                <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-semibold text-zinc-800 dark:text-zinc-100">
                        {isDragReject
                            ? 'Invalid file type'
                            : isDragActive
                                ? 'Drop your images here'
                                : 'Drag & drop your images'}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {isDragReject
                            ? 'Only JPG, PNG, and WebP files are accepted'
                            : 'or click to browse • JPG, PNG, WebP • Max 10MB per file'}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
