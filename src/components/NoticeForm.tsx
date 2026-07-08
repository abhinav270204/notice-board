import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import NoticeCard, { Notice } from "./NoticeCard";

type NoticeFormProps = {
  initialData?: Notice;
  isEditMode?: boolean;
};

export default function NoticeForm({ initialData, isEditMode = false }: NoticeFormProps) {
  const router = useRouter();
  
  const [form, setForm] = useState({
    title: "",
    body: "",
    category: "General",
    priority: "Normal",
    publishDate: "",
    image: ""
  });
  
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Set initial form data if in edit mode
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        body: initialData.body || "",
        category: initialData.category || "General",
        priority: initialData.priority || "Normal",
        publishDate: initialData.publishDate ? initialData.publishDate.slice(0, 10) : "",
        image: initialData.image || ""
      });
    }
  }, [initialData]);

  // Handle client-side validation
  const validateForm = () => {
    if (!form.title.trim()) return "Notice Title is required";
    if (form.title.trim().length < 3) return "Title must be at least 3 characters long";
    if (!form.body.trim()) return "Notice details (Body) are required";
    if (form.body.trim().length < 10) return "Body must be at least 10 characters long";
    if (!form.publishDate) return "Publish Date is required";
    if (isNaN(Date.parse(form.publishDate))) return "Please specify a valid Publish Date";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    
    const url = isEditMode && initialData ? `/api/notices/${initialData.id}` : "/api/notices";
    const method = isEditMode ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          // Explicit format mapping
          publishDate: new Date(form.publishDate).toISOString()
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save notice. Please verify input data.");
      }

      router.push("/");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock notice data for live preview
  const previewNotice: Notice = {
    id: 0,
    title: form.title || "Preview Title Here",
    body: form.body || "This is where your notice details will be displayed. Write something compelling!",
    category: form.category,
    priority: form.priority,
    publishDate: form.publishDate ? new Date(form.publishDate).toISOString() : new Date().toISOString(),
    image: form.image || null
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 lg:col-span-7">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            {isEditMode ? "✍️" : "✨"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {isEditMode ? "Edit Notice" : "Create Notice"}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Fill in the fields below to publish a notice to the campus board.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-5 bg-red-50/70 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600 flex items-start gap-2 animate-[shake_0.4s_ease-in-out]">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Title input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Notice Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full bg-slate-50/50 border border-slate-200/80 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 font-medium"
              placeholder="e.g., Final Semester Examination Schedule"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              maxLength={100}
              required
            />
          </div>

          {/* Details input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Details (Body) <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full bg-slate-50/50 border border-slate-200/80 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 font-medium resize-none"
              placeholder="Provide a detailed description of the notice contents..."
              rows={5}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              maxLength={2000}
              required
            />
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
              <select
                className="w-full bg-slate-50/50 border border-slate-200/80 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold cursor-pointer"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="General">General</option>
                <option value="Exam">Exam</option>
                <option value="Event">Event</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</label>
              <select
                className="w-full bg-slate-50/50 border border-slate-200/80 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold cursor-pointer"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Publish Date input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Publish Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full bg-slate-50/50 border border-slate-200/80 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold cursor-pointer"
              value={form.publishDate}
              onChange={(e) => setForm({ ...form, publishDate: e.target.value })}
              required
            />
          </div>

          {/* Optional Image URL input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Image URL <span className="text-slate-400 font-semibold normal-case">(optional)</span>
            </label>
            <input
              type="url"
              className="w-full bg-slate-50/50 border border-slate-200/80 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 font-medium"
              placeholder="e.g., https://images.unsplash.com/photo-..."
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-2">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold py-3.5 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-grow-[2] bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-bold py-3.5 rounded-xl transition-all shadow-md shadow-indigo-100 hover:shadow-indigo-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : isEditMode ? (
                "Save Changes"
              ) : (
                "Publish Notice"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Live Preview Card */}
      <div className="lg:col-span-5 sticky top-24">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Live Card Preview</h3>
        <div className="w-full max-w-sm mx-auto lg:max-w-none">
          {mounted && <NoticeCard notice={previewNotice} onDelete={() => {}} />}
        </div>
      </div>
    </div>
  );
}
