import React from "react";
import Link from "next/link";

export type Notice = {
  id: number;
  title: string;
  body: string;
  category: string;
  priority: string;
  publishDate: string;
  image?: string | null;
};

type NoticeCardProps = {
  notice: Notice;
  onDelete: (id: number) => void;
};

export default function NoticeCard({ notice, onDelete }: NoticeCardProps) {
  const isUrgent = notice.priority === "Urgent";
  
  // Format publish date nicely using UTC to prevent timezone shifts and SSR hydration mismatch
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = months[date.getUTCMonth()];
      const day = date.getUTCDate();
      const year = date.getUTCFullYear();
      return `${month} ${day}, ${year}`;
    } catch {
      return dateStr;
    }
  };

  // Get category badge style and icon
  const getCategoryDetails = (category: string) => {
    switch (category) {
      case "Exam":
        return {
          classes: "bg-purple-50 text-purple-700 border-purple-100",
          icon: (
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )
        };
      case "Event":
        return {
          classes: "bg-emerald-50 text-emerald-700 border-emerald-100",
          icon: (
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )
        };
      case "General":
      default:
        return {
          classes: "bg-blue-50 text-blue-700 border-blue-100",
          icon: (
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
    }
  };

  const categoryDetails = getCategoryDetails(notice.category);

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-300 flex flex-col h-full overflow-hidden ${
        isUrgent
          ? "border-red-200/80 shadow-md shadow-red-50 hover:shadow-lg hover:shadow-red-100 hover:border-red-300 ring-2 ring-red-500/10"
          : "border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200/80"
      } hover:-translate-y-1`}
    >
      {/* Visual Accent Line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 z-10 ${
          isUrgent
            ? "bg-gradient-to-r from-red-500 to-rose-500"
            : notice.category === "Exam"
            ? "bg-gradient-to-r from-purple-500 to-indigo-500"
            : notice.category === "Event"
            ? "bg-gradient-to-r from-emerald-500 to-teal-500"
            : "bg-gradient-to-r from-blue-500 to-sky-500"
        }`}
      />

      {/* Notice Image (if present) */}
      {notice.image ? (
        <div className="relative w-full h-44 overflow-hidden bg-slate-100 shrink-0">
          <img
            src={notice.image}
            alt={notice.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={(e) => {
              // Hide image container on broken URL
              (e.target as HTMLElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      ) : null}

      {/* Card Content Area */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Category Badge & Priority Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${categoryDetails.classes}`}>
            {categoryDetails.icon}
            {notice.category}
          </span>

          {isUrgent ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 animate-pulse">
              <span className="relative flex h-2 w-2 mr-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              Urgent
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
              Normal
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors duration-200 mb-2 line-clamp-2">
          {notice.title}
        </h3>

        {/* Body Text */}
        <p className="text-sm text-slate-500 font-normal leading-relaxed line-clamp-3 mb-4">
          {notice.body}
        </p>

        {/* Divider & Footer Info */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(notice.publishDate)}
          </div>

          <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
            <Link
              href={`/edit/${notice.id}`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/60 transition-all"
              title="Edit Notice"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </Link>

            <button
              onClick={() => onDelete(notice.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50/60 transition-all cursor-pointer"
              title="Delete Notice"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
