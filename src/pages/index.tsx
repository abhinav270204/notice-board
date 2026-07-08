import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "@/components/Layout";
import NoticeCard, { Notice } from "@/components/NoticeCard";

export default function Home() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  // Deletion Modal State
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all notices ordered by server (Urgent first, then publishDate desc)
  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notices");
      if (!res.ok) throw new Error("Failed to load notice list.");
      const data = await res.json();
      setNotices(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // Handle actual deletion
  const confirmDelete = async () => {
    if (deleteId === null) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/notices/${deleteId}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete notice.");
      
      // Update notices local state
      setNotices(notices.filter((n) => n.id !== deleteId));
      setDeleteId(null);
    } catch (err: any) {
      alert(err.message || "Error deleting notice");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter & Search Logic
  const filteredNotices = notices.filter((notice) => {
    // 1. Text Search Filter
    const matchesSearch =
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.body.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Category / Priority Tab Filter
    if (selectedFilter === "All") return matchesSearch;
    if (selectedFilter === "Urgent") return notice.priority === "Urgent" && matchesSearch;
    return notice.category === selectedFilter && matchesSearch;
  });

  return (
    <Layout>
      <Head>
        <title>Campus Notice Board | Dashboard</title>
        <meta name="description" content="Stay updated with exams, events, and important campus notices." />
      </Head>

      {/* Hero / Welcome Section */}
      <div className="mb-10 text-center md:text-left md:flex md:items-center md:justify-between gap-6 bg-gradient-to-tr from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg relative overflow-hidden">
        {/* Abstract background blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -ml-20 -mb-20" />

        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Campus Bulletin Hub
          </h2>
          <p className="text-slate-300 text-sm max-w-xl font-medium leading-relaxed">
            Get the latest official announcements, exam timetables, and event notices, ordered by priority and relevance.
          </p>
        </div>
        <Link
          href="/add"
          className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-semibold text-white rounded-xl group bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 group-hover:from-indigo-500 group-hover:via-purple-500 group-hover:to-pink-500 focus:ring-4 focus:outline-none focus:ring-indigo-800 transition-all duration-200 hover:-translate-y-0.5 shrink-0 mt-4 md:mt-0"
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-slate-950 rounded-xl group-hover:bg-opacity-0 font-bold flex items-center gap-1.5">
            Create Announcement
          </span>
        </Link>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1 w-full md:w-auto">
          {["All", "Exam", "Event", "General", "Urgent"].map((filter) => {
            const isActive = selectedFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? filter === "Urgent"
                      ? "bg-red-500 text-white shadow-md shadow-red-100"
                      : "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {filter === "Urgent" && "🚨 "}
                {filter === "Exam" && "📝 "}
                {filter === "Event" && "📅 "}
                {filter === "General" && "💡 "}
                {filter}s
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80 shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="w-full bg-slate-50 border border-slate-200/80 focus:border-indigo-500 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 font-semibold"
            placeholder="Search notices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Notices Display Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-slate-400 font-semibold text-sm">Loading announcements...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center max-w-md mx-auto">
          <span className="text-3xl">⚠️</span>
          <h3 className="text-lg font-bold text-red-800 mt-3">Notice Load Failed</h3>
          <p className="text-sm text-red-600/90 mt-1 mb-4">{error}</p>
          <button
            onClick={fetchNotices}
            className="bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm px-6 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-50 text-2xl flex items-center justify-center mx-auto mb-4">
            🔍
          </div>
          <h3 className="text-base font-bold text-slate-800">No notices found</h3>
          <p className="text-sm text-slate-400 font-medium mt-1 mb-6 leading-relaxed">
            {searchQuery
              ? `We couldn't find matches for "${searchQuery}". Try editing keywords.`
              : `There are currently no published ${selectedFilter.toLowerCase()} notices on the board.`}
          </p>
          {!searchQuery && (
            <Link
              href="/add"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-100"
            >
              Add First Notice
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      )}

      {/* Premium Deletion Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md p-6 relative overflow-hidden animate-[scaleUp_0.25s_ease-out]">
            {/* Warning top stripe */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 to-rose-500" />
            
            <div className="flex items-start gap-4 mt-2">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Delete Announcement?</h3>
                <p className="text-sm text-slate-400 font-medium mt-1 leading-relaxed">
                  Are you sure you want to remove this notice? This action is permanent and cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-100 flex items-center gap-1.5 cursor-pointer"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Delete Permanently"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
