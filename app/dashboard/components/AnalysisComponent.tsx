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
        <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-violet-200 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm border border-violet-100">
                        <span className="text-xl">✨</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">AI Application Insights</h2>
                        <p className="text-xs text-slate-500">Powered by Gemini</p>
                    </div>
                </div>
                {!analysis && !loading && (
                    <button
                        onClick={fetchAnalysis}
                        className="bg-violet-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet-700 transition shadow-md hover:shadow-lg flex items-center gap-2 group"
                    >
                        <span>Analyze Data</span>
                        <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </button>
                )}
                {analysis && !loading && (
                    <button
                        onClick={fetchAnalysis}
                        className="text-violet-600 hover:text-violet-800 text-sm font-semibold transition flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Refresh
                    </button>
                )}
            </div>

            <div className="relative z-10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-10 text-violet-600 animate-pulse bg-white/50 rounded-xl border border-violet-100/50">
                        <svg className="animate-spin h-8 w-8 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm font-semibold">Generating sophisticated analysis...</span>
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-sm p-4 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2">
                        <span>⚠️</span> {error}
                    </div>
                ) : analysis ? (
                    <div className="prose prose-violet prose-sm max-w-none text-slate-700 leading-relaxed bg-white/60 p-4 rounded-xl border border-violet-100/50">
                        <ReactMarkdown>{analysis}</ReactMarkdown>
                    </div>
                ) : (
                    <div className="bg-white/50 rounded-xl p-6 text-center border border-dashed border-violet-200">
                        <p className="text-slate-500 text-sm">
                            Click "Analyze Data" to get specific, actionable insights based on your recent performance metrics and activity.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
