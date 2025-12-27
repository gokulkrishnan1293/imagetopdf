import Link from 'next/link';
import { FileImage, ArrowRight, Github } from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans">
      {/* Background Gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-30 dark:opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/20 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-zinc-50/80 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                Gokul's Apps
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/gokulkrishnan1293"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Hero */}
        <div className="text-center mb-16 sm:mb-24">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
            Everything you need. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
              All in one place.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            A privacy-first collection of developer utilities and tools.
            No server uploads, no data collection. Just pure functionality.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Image to PDF Card */}
          <Link
            href="/imagetopdf"
            className="group relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 -m-4 w-24 h-24 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                <FileImage className="h-6 w-6 text-white" />
              </div>

              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 mb-2">
                Image to PDF
              </h3>

              <p className="text-zinc-500 dark:text-zinc-400 mb-6 line-clamp-2">
                Convert JPG, PNG, and WebP images to PDF instantly.
                Drag & drop, reorder, and download 100% locally.
              </p>

              <div className="flex items-center text-sm font-semibold text-violet-600 dark:text-violet-400 group-hover:translate-x-1 transition-transform">
                Open Tool <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </div>
          </Link>

          {/* Placeholder for future tools */}
          <div className="group relative overflow-hidden rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 p-8 flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">More coming soon</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2">
              JSON Formatter, Base64 Encoder, and more...
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
