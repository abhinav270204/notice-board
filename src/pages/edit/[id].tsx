import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import NoticeForm from "@/components/NoticeForm";
import Head from "next/head";
import { Notice } from "@/components/NoticeCard";

export default function EditNoticePage() {
  const router = useRouter();
  const { id } = router.query;
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchNotice = async () => {
      try {
        const res = await fetch(`/api/notices/${id}`);
        if (!res.ok) {
          throw new Error("Failed to load notice. It may have been deleted.");
        }
        const data = await res.json();
        setNotice(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [id]);

  return (
    <Layout>
      <Head>
        <title>Edit Notice | Campus Notice Board</title>
        <meta name="description" content="Modify notice contents and configuration." />
      </Head>

      <div className="max-w-5xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-slate-400 font-semibold text-sm">Fetching notice details...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center max-w-md mx-auto">
            <span className="text-3xl">⚠️</span>
            <h3 className="text-lg font-bold text-red-800 mt-3">Error Loading Notice</h3>
            <p className="text-sm text-red-600/90 mt-1 mb-4">{error}</p>
            <button
              onClick={() => router.push("/")}
              className="bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Go to Dashboard
            </button>
          </div>
        ) : notice ? (
          <NoticeForm initialData={notice} isEditMode={true} />
        ) : null}
      </div>
    </Layout>
  );
}
