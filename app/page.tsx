'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  Download,
  ChevronRight,
  AlertTriangle,
  ArrowLeft,
  Activity,
  Heart,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

// --- MOCK AI RESPONSE ---
const MOCK_AI_RESPONSE = {
  summary: "The analysis indicates a potential Vitamin D deficiency and elevated LDL cholesterol. These markers suggest a need for dietary adjustments and increased sun exposure or supplementation. Liver function appears normal.",
  score: 86,
  critical_items: 1,
  results: [
    { name: "Testosterone", value: "650", unit: "ng/dL", status: "normal", range: "300-1000", insight: "Optimal levels.", category: "Hormones" },
    { name: "Estradiol", value: "15", unit: "pg/mL", status: "low", range: "20-50", insight: "Below optimal range.", category: "Hormones" },
    { name: "Hemoglobin", value: "14.2", unit: "g/dL", status: "normal", range: "13.2-16.6", insight: "Optimal oxygen transport capacity.", category: "Full Blood Count" },
    { name: "White Blood Cells", value: "6.5", unit: "K/uL", status: "normal", range: "4.5-11.0", insight: "Normal immune function.", category: "Full Blood Count" },
    { name: "ALT", value: "55", unit: "U/L", status: "high", range: "7-56", insight: "Slightly elevated.", category: "Liver" },
    { name: "AST", value: "25", unit: "U/L", status: "normal", range: "10-40", insight: "Normal liver enzyme.", category: "Liver" },
    { name: "Total Cholesterol", value: "210", unit: "mg/dL", status: "high", range: "<200", insight: "Borderline high.", category: "Lipids" },
    { name: "HDL", value: "65", unit: "mg/dL", status: "normal", range: ">40", insight: "Good 'good' cholesterol.", category: "Lipids" },
    { name: "Vitamin D", value: "18", unit: "ng/mL", status: "low", range: "30-100", insight: "Deficiency detected.", category: "Vitamins" },
  ]
};

export default function SmartReportTool() {
  const [step, setStep] = useState('upload'); // upload, processing, result, error
  const [file, setFile] = useState<File | null>(null);
  const [report, setReport] = useState<typeof MOCK_AI_RESPONSE | null>(null);
  const [error, setError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // Background Orbs Animation
  const BackgroundOrbs = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-50">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
    </div>
  );

  // 1. Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      processFile(selectedFile);
    }
  };

  // 2. Process File
  const processFile = async (fileToProcess?: File) => {
    setStep('processing');
    setError(null);

    try {
      if (!fileToProcess) {
        // Demo mode
        setTimeout(() => {
          setReport(MOCK_AI_RESPONSE);
          setStep('result');
        }, 3000);
        return;
      }

      const formData = new FormData();
      formData.append('file', fileToProcess);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to analyze file');
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        throw new Error('No biomarkers found in the report. Please upload a valid blood test report.');
      }

      setReport(data);
      setStep('result');

    } catch (err: any) {
      console.error('Error processing file:', err);
      setError(err.message || 'Failed to process the file. Please try again.');
      setStep('upload');
    }
  };

  // 3. Handle Print/Download
  const handleDownload = () => {
    window.print();
  };

  // --- COMPONENT: Upload Section ---
  const UploadSection = () => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const droppedFile = e.dataTransfer.files[0];
        setFile(droppedFile);
        processFile(droppedFile);
      }
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 border border-indigo-500/30 bg-white/50 backdrop-blur-md shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-xs font-medium text-indigo-600 tracking-wide">AI-POWERED ANALYSIS v2.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-slate-800">
            Read <br />
            <span className="text-indigo-600">Your Blood Test</span>
          </h1>

          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Transform complex medical PDFs into clear, actionable health insights.
            Instant analysis powered by advanced AI models.
          </p>
        </div>

        <div
          className={`
            w-full max-w-xl p-1 rounded-2xl transition-all duration-500 animate-fade-in-up
            ${isDragging ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 scale-105' : 'bg-white shadow-xl'}
          `}
          style={{ animationDelay: '0.2s' }}
        >
          <div
            className={`
              rounded-xl p-12 text-center transition-all duration-300 bg-white
              ${isDragging ? 'bg-slate-50' : 'hover:bg-slate-50'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Upload className={`w-10 h-10 ${isDragging ? 'text-indigo-600' : 'text-indigo-400'}`} />
            </div>

            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              {isDragging ? 'Drop it like it\'s hot!' : 'Upload your report'}
            </h3>
            <p className="text-slate-500 text-sm mb-8">
              Drag & drop your PDF here, or click to browse
            </p>

            <label className="relative inline-flex group cursor-pointer">
              <input type="file" className="hidden" accept=".pdf,.jpg,.png" onChange={handleFileChange} />
              <div className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-indigo-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30">
                Select File
              </div>
            </label>

            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Private & Secure</span>
              <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Instant Results</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-8 bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-xl flex items-center gap-3 animate-fade-in-up">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <p>{error}</p>
          </div>
        )}

        <button
          onClick={() => processFile()}
          className="mt-8 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          No file? Try the Demo Report →
        </button>
      </div>
    );
  };

  // --- COMPONENT: Processing State ---
  const ProcessingSection = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] relative z-10">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-r-2 border-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Activity className="w-10 h-10 text-indigo-500 animate-pulse" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-slate-800 mb-2 animate-pulse">Analyzing Data...</h2>
      <div className="flex flex-col items-center gap-2 text-slate-500 text-sm">
        <span className="animate-fade-in-up" style={{ animationDelay: '0s' }}>Extracting biomarkers</span>
        <span className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>Comparing reference ranges</span>
        <span className="animate-fade-in-up" style={{ animationDelay: '1s' }}>Generating health insights</span>
      </div>
    </div>
  );

  // --- COMPONENT: Report Section ---
  const ReportSection = () => {
    if (!report) return null;

    // Helper to group results by category
    const groupedResults = report.results.reduce((acc: any, item: any) => {
      const category = item.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});

    // Helper to get category color
    const getCategoryColor = (category: string) => {
      const colors: any = {
        'Hormones': 'bg-orange-50 text-orange-700',
        'Full Blood Count': 'bg-yellow-50 text-yellow-700',
        'Liver': 'bg-red-50 text-red-700',
        'Lipids': 'bg-blue-50 text-blue-700',
        'Vitamins': 'bg-green-50 text-green-700',
        'Other': 'bg-slate-50 text-slate-700'
      };
      return colors[category] || colors['Other'];
    };

    // Helper to get category icon
    const getCategoryIcon = (category: string) => {
      // Simple mapping based on string includes
      if (category.includes('Hormones')) return <Activity className="w-5 h-5" />;
      if (category.includes('Blood')) return <Heart className="w-5 h-5" />;
      if (category.includes('Liver')) return <Activity className="w-5 h-5" />;
      if (category.includes('Lipids')) return <Heart className="w-5 h-5" />;
      return <FileText className="w-5 h-5" />;
    };

    return (
      <div className="max-w-5xl mx-auto py-8 px-4 md:px-6 relative z-10 animate-fade-in-up">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Smart Report Dashboard</h1>
          <p className="text-slate-500">Analysis generated on {new Date().toLocaleDateString()}</p>
        </div>

        {/* Health Score Circle */}
        <div className="flex justify-center mb-16">
          <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md relative overflow-hidden">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-slate-800">Overall Health Score</h3>
            </div>

            {/* Circular Gauge */}
            <div className="relative w-64 h-64 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="#f1f5f9"
                  strokeWidth="20"
                  fill="transparent"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke={report.score > 80 ? '#10b981' : report.score > 60 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="20"
                  fill="transparent"
                  strokeDasharray={691} // 2 * PI * 110
                  strokeDashoffset={691 - (691 * report.score) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-6xl font-bold ${report.score > 80 ? 'text-emerald-500' : report.score > 60 ? 'text-amber-500' : 'text-red-500'}`}>
                  {report.score}
                  <span className="text-2xl text-slate-400 font-normal">/100</span>
                </span>
                <span className="text-slate-500 font-medium mt-2">
                  {report.score > 80 ? 'Optimal' : report.score > 60 ? 'Moderate' : 'Needs Attention'}
                </span>
              </div>
            </div>

            {/* Linear Range Indicator */}
            <div className="px-4">
              <div className="h-4 w-full rounded-full bg-gradient-to-r from-red-400 via-amber-400 to-emerald-400 relative mb-2">
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-slate-200 rounded-full shadow-lg transition-all duration-1000"
                  style={{ left: `${report.score}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-slate-400 font-medium">
                <span>Poor</span>
                <span>Moderate</span>
                <span>Optimal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(groupedResults).map(([category, items]: [string, any]) => (
            <div key={category} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
              {/* Card Header */}
              <div className={`px-6 py-4 flex items-center gap-3 ${getCategoryColor(category)}`}>
                <div className="p-2 bg-white/50 rounded-lg backdrop-blur-sm">
                  {getCategoryIcon(category)}
                </div>
                <h3 className="font-bold text-lg">{category}</h3>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-6 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item: any, idx: number) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-700">{item.name}:</span>
                      <span className={`
                        text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide
                        ${item.status === 'normal' ? 'bg-emerald-100 text-emerald-700' : ''}
                        ${item.status === 'low' ? 'bg-amber-100 text-amber-700' : ''}
                        ${item.status === 'high' ? 'bg-red-100 text-red-700' : ''}
                      `}>
                        {item.status === 'normal' ? 'Optimal' : item.status}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                      {/* Range Markers (Simplified for visual) */}
                      <div className="absolute left-[20%] right-[20%] top-0 bottom-0 bg-emerald-100"></div>

                      {/* Value Indicator */}
                      <div
                        className={`absolute top-0 bottom-0 w-1/2 rounded-full ${item.status === 'normal' ? 'bg-emerald-400' :
                          item.status === 'low' ? 'bg-amber-400' : 'bg-red-400'
                          }`}
                        style={{
                          left: '0%', // Simplified positioning for demo
                          width: item.status === 'normal' ? '50%' : item.status === 'low' ? '20%' : '90%',
                          marginLeft: item.status === 'normal' ? '25%' : '0'
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>{item.value} {item.unit}</span>
                      <span>Range: {item.range}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-12 print:hidden">
          <button
            onClick={() => { setStep('upload'); setFile(null); }}
            className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all font-medium flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> New Analysis
          </button>
          <button
            onClick={handleDownload}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>

      </div>
    );
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 selection:bg-indigo-100">
      <BackgroundOrbs />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between items-center print:hidden">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <span className="text-slate-800">read<span className="text-indigo-600">my</span>blood</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-md">Dashboard</span>
          <a href="#" className="hover:text-indigo-600 transition-colors">My Reports</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Upload PDF</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Profile</a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12">
        {step === 'upload' && <UploadSection />}
        {step === 'processing' && <ProcessingSection />}
        {step === 'result' && <ReportSection />}
      </main>
    </div>
  );
}
