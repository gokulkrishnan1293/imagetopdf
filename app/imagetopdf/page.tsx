'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileImage, Sparkles } from 'lucide-react';
import { DropZone } from '../components/DropZone';
import { SortableImageGrid } from '../components/SortableImageGrid';
import { ActionButtons } from '../components/ActionButtons';
import { ProgressBar } from '../components/ProgressBar';
import { ErrorToast } from '../components/ErrorToast';
import { ThemeToggle } from '../components/ThemeToggle';
import { PDFOptions, PDFSettings, Orientation } from '../components/PDFOptions';
import { ViewToggle, ViewMode } from '../components/ViewToggle';
import { ImageFile, generatePDF, downloadPDF } from '../utils/pdfGenerator';

export default function Home() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [pdfSettings, setPdfSettings] = useState<PDFSettings>({
    filename: 'my-images',
    orientation: 'auto',
    quality: 'high',
  });

  // Auto-switch to list view on mobile
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 640) {
        setViewMode('list');
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFilesAccepted = useCallback((files: File[]) => {
    const newImages: ImageFile[] = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      orientation: undefined, // Will use global setting
    }));
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const handleError = useCallback((message: string) => {
    setError(message);
  }, []);

  const handleDismissError = useCallback(() => {
    setError(null);
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  const handleReorder = useCallback((newImages: ImageFile[]) => {
    setImages(newImages);
  }, []);

  const handleOrientationChange = useCallback((id: string, orientation: Orientation | undefined) => {
    setImages((prev) => prev.map((img) =>
      img.id === id ? { ...img, orientation } : img
    ));
  }, []);

  const handleClearAll = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
  }, [images]);

  const handleDownload = useCallback(async () => {
    if (images.length === 0) return;

    setIsGenerating(true);
    setProgress(0);

    try {
      const blob = await generatePDF({
        images,
        globalOrientation: pdfSettings.orientation,
        quality: pdfSettings.quality,
        onProgress: setProgress,
      });

      const filename = pdfSettings.filename.trim() || 'my-images';
      downloadPDF(blob, filename);
    } catch (err) {
      console.error('PDF generation failed:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  }, [images, pdfSettings]);

  // Count images with custom orientation
  const customOrientationCount = images.filter(img => img.orientation).length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      {/* Background pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-violet-500/10 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-fuchsia-500/10 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-zinc-50/80 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/25">
                <FileImage className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Image to PDF</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Free • Private • Instant</p>
              </div>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            100% Client-Side Processing
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Convert Images to{' '}
            <span className="gradient-text">PDF</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Drag, drop, and reorder your images. Download as a perfectly formatted PDF.
            Your files never leave your device.
          </p>
        </motion.div>

        {/* Drop zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <DropZone onFilesAccepted={handleFilesAccepted} onError={handleError} />
        </motion.div>

        {/* PDF Options - Show when images are added */}
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <PDFOptions
              settings={pdfSettings}
              onSettingsChange={setPdfSettings}
              disabled={isGenerating}
            />
            {customOrientationCount > 0 && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                💡 {customOrientationCount} image{customOrientationCount > 1 ? 's have' : ' has'} custom orientation (overrides global setting)
              </p>
            )}
          </motion.div>
        )}

        {/* View toggle and action buttons */}
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* View toggle */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">View:</span>
                <ViewToggle mode={viewMode} onModeChange={setViewMode} />
              </div>

              <div className="flex-1" />

              {/* Action buttons */}
              <ActionButtons
                imageCount={images.length}
                isGenerating={isGenerating}
                onClearAll={handleClearAll}
                onDownload={handleDownload}
              />
            </div>
          </motion.div>
        )}

        {/* Image grid/list */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <SortableImageGrid
            images={images}
            viewMode={viewMode}
            onReorder={handleReorder}
            onRemove={handleRemoveImage}
            onOrientationChange={handleOrientationChange}
          />
        </motion.div>

        {/* Empty state hint */}
        {images.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-12"
          >
            <p className="text-zinc-500 dark:text-zinc-400">
              Your images will appear here after you add them
            </p>
          </motion.div>
        )}

        {/* Reorder hint */}
        {images.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-6"
          >
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {viewMode === 'list'
                ? '👆 Drag to reorder • Use dropdown to set per-image orientation'
                : '💡 Drag to reorder • Click 🔄 icon to set per-image orientation'
              }
            </p>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Made with ❤️ • Your images are processed locally and never uploaded
          </p>
        </div>
      </footer>

      {/* Progress bar */}
      <ProgressBar progress={progress} isVisible={isGenerating} />

      {/* Error toast */}
      <ErrorToast message={error} onDismiss={handleDismissError} />
    </div>
  );
}
