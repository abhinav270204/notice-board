import React from "react";
import Layout from "@/components/Layout";
import NoticeForm from "@/components/NoticeForm";
import Head from "next/head";

export default function AddNoticePage() {
  return (
    <Layout>
      <Head>
        <title>New Notice | Campus Notice Board</title>
        <meta name="description" content="Publish a new notice to the campus board." />
      </Head>
      
      <div className="max-w-5xl mx-auto">
        <NoticeForm />
      </div>
    </Layout>
  );
}
