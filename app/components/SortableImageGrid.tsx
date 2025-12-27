'use client';

import { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
    MeasuringStrategy,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { AnimatePresence, motion } from 'framer-motion';
import { ImagePreview, DragOverlayPreview } from './ImagePreview';
import { ImageListItem, ListItemDragOverlay } from './ImageListItem';
import { ImageFile } from '../utils/pdfGenerator';
import { ViewMode } from './ViewToggle';
import { Orientation } from './PDFOptions';

interface SortableImageGridProps {
    images: ImageFile[];
    viewMode: ViewMode;
    onReorder: (images: ImageFile[]) => void;
    onRemove: (id: string) => void;
    onOrientationChange: (id: string, orientation: Orientation | undefined) => void;
}

export function SortableImageGrid({ images, viewMode, onReorder, onRemove, onOrientationChange }: SortableImageGridProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const activeImage = activeId ? images.find((img) => img.id === activeId) : null;
    const activeIndex = activeId ? images.findIndex((img) => img.id === activeId) : -1;

    // Use TouchSensor for better mobile support
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 150,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
        // Add haptic feedback on mobile if available
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (over && active.id !== over.id) {
            const oldIndex = images.findIndex((img) => img.id === active.id);
            const newIndex = images.findIndex((img) => img.id === over.id);
            onReorder(arrayMove(images, oldIndex, newIndex));

            // Haptic feedback on successful reorder
            if (navigator.vibrate) {
                navigator.vibrate([50, 30, 50]);
            }
        }
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    if (images.length === 0) {
        return null;
    }

    const sortingStrategy = viewMode === 'list' ? verticalListSortingStrategy : rectSortingStrategy;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
            measuring={{
                droppable: {
                    strategy: MeasuringStrategy.Always,
                },
            }}
        >
            <SortableContext items={images.map((img) => img.id)} strategy={sortingStrategy}>
                {viewMode === 'grid' ? (
                    <motion.div
                        layout
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
                    >
                        <AnimatePresence mode="popLayout">
                            {images.map((image, index) => (
                                <div key={image.id} className="relative">
                                    <ImagePreview
                                        image={image}
                                        onRemove={onRemove}
                                        onOrientationChange={onOrientationChange}
                                    />
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white shadow-lg z-10"
                                    >
                                        {index + 1}
                                    </motion.div>
                                </div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <motion.div layout className="flex flex-col gap-2">
                        <AnimatePresence mode="popLayout">
                            {images.map((image, index) => (
                                <ImageListItem
                                    key={image.id}
                                    image={image}
                                    index={index}
                                    onRemove={onRemove}
                                    onOrientationChange={onOrientationChange}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </SortableContext>

            {/* Drag overlay */}
            <DragOverlay dropAnimation={{
                duration: 200,
                easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
            }}>
                {activeImage ? (
                    viewMode === 'grid' ? (
                        <DragOverlayPreview image={activeImage} />
                    ) : (
                        <ListItemDragOverlay image={activeImage} index={activeIndex} />
                    )
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
