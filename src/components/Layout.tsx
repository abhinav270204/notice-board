import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      {/* Decorative background grid mesh */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-70" />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/55 bg-white/85 backdrop-blur-md transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group transition-transform duration-200 hover:scale-[1.02]">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:shadow-indigo-200 transition-all">
              <span className="text-xl font-bold">📋</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                NoticeBoard
              </span>
              <span className="text-[10px] font-medium text-slate-400 -mt-1 uppercase tracking-wider">
                Campus Connect
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {router.pathname !== "/add" && (
              <Link
                href="/add"
                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-semibold text-slate-900 rounded-xl group bg-gradient-to-br from-purple-600 to-indigo-500 group-hover:from-purple-600 group-hover:to-indigo-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300/30 transition-all duration-200 hover:-translate-y-0.5 mt-2"
              >
                <span className="relative px-4 py-2 transition-all ease-in duration-75 bg-white text-slate-800 font-bold rounded-xl group-hover:bg-opacity-0 group-hover:text-white flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                  New Notice
                </span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-[fadeIn_0.4s_ease-out]">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/55 bg-white/60 backdrop-blur-sm py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} NoticeBoard. Built for academic excellence.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xs text-slate-400 hover:text-indigo-600 transition-colors font-medium">
              Dashboard
            </Link>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            <Link href="/add" className="text-xs text-slate-400 hover:text-indigo-600 transition-colors font-medium">
              Create Notice
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
