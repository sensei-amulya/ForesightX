"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function AnalysisComponent() {
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalysis = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/analysis", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setAnalysis(data.analysis);
        } catch (err: any) {
            console.error("Error fetching analysis:", err);
            setError(err.message || "Failed to generate analysis");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">AI Insights</h2>
                </div>
                {!analysis && !loading && (
                    <button
                        onClick={fetchAnalysis}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
                    >
                        <span>✨</span> Generate Analysis
                    </button>
                )}
                {analysis && !loading && (
                    <button
                        onClick={fetchAnalysis}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition"
                    >
                        🔄 Refresh
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-8 text-indigo-600 animate-pulse">
                    <svg className="animate-spin h-8 w-8 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm font-medium">Generating sophisticated analysis...</span>
                </div>
            ) : error ? (
                <div className="text-red-500 text-sm p-4 bg-red-50 rounded-lg border border-red-100">
                    {error}
                </div>
            ) : analysis ? (
                <div className="prose prose-indigo prose-sm max-w-none text-gray-700 leading-relaxed">
                    <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
            ) : (
                <p className="text-gray-500 text-sm italic">
                    Click "Generate Analysis" to get a detailed report on your business performance.
                </p>
            )}
        </div>
    );
}
