
import React, { useState, useCallback, useEffect } from 'react';
import { analyzeCode } from '../services/geminiService';
import type { AnalysisResult } from '../types';
import ResultDisplay from './ResultDisplay';

const AnalysisView: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCode(text);
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!code.trim()) {
      setError('Please enter or upload some code to analyze.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const result = await analyzeCode(code);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [code]);

  const handleReset = () => {
    setCode('');
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  }

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col transition-opacity duration-500 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
        <header className="text-center mb-8 py-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">CodeRefine-ONSLAUGHT</h1>
            <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
              Paste your code or upload a file to receive an expert analysis, refactoring, and optimization suggestions.
            </p>
        </header>

        <div className="flex-grow flex flex-col lg:flex-row gap-8">
            {!analysisResult && (
                 <div className="lg:w-1/2 flex flex-col">
                    <div className="flex-grow flex flex-col bg-gray-900/50 border border-gray-700 rounded-lg p-4 h-[60vh]">
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Paste your code here or upload a file..."
                            className="w-full h-full flex-grow bg-transparent text-gray-200 placeholder-gray-500 resize-none focus:outline-none font-mono text-sm"
                            disabled={isLoading}
                        />
                        <div className="mt-4 flex items-center justify-between">
                            <label htmlFor="file-upload" className="cursor-pointer text-sm text-gray-400 hover:text-white transition-colors">
                                Upload File
                                <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".js,.ts,.jsx,.tsx,.py,.java,.cs,.go,.rs,.html,.css" />
                            </label>
                            <button onClick={handleAnalyze} disabled={isLoading || !code.trim()} className="bg-white text-black font-semibold py-2 px-5 rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-gray-200 transition-all">
                                {isLoading ? 'Analyzing...' : 'Analyze Code'}
                            </button>
                        </div>
                    </div>
                 </div>
            )}
            
            <div className={`flex flex-col ${analysisResult ? 'w-full' : 'lg:w-1/2 w-full'}`}>
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 sm:p-6 flex-grow overflow-y-auto" style={{ minHeight: '60vh', maxHeight: 'calc(100vh - 16rem)'}}>
                    {isLoading && (
                        <div className="flex items-center justify-center h-full">
                            <div className="flex flex-col items-center gap-4">
                               <div className="w-12 h-12 border-4 border-t-white border-gray-600 rounded-full animate-spin"></div>
                               <p className="text-gray-400">ONSLAUGHT is thinking...</p>
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="text-red-400 bg-red-900/50 border border-red-700 rounded-lg p-4">
                            <p className="font-bold">Analysis Failed</p>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                    )}
                    {analysisResult && (
                        <>
                         <button onClick={handleReset} className="mb-4 text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                 <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.224 4.302l-1.423 1.423a.75.75 0 11-1.06-1.06l1.422-1.423A5.5 5.5 0 0115.312 11.424zM4.688 8.576a5.5 5.5 0 019.224-4.302l1.423-1.423a.75.75 0 111.06 1.06l-1.422 1.423A5.5 5.5 0 014.688 8.576z" clipRule="evenodd" />
                                 <path d="M12.06 4.97a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 11-1.06-1.06L14.22 9l-2.16-2.17a.75.75 0 010-1.06zM7.94 15.03a.75.75 0 01-1.06 0L3.63 11.78a.75.75 0 010-1.06l3.25-3.25a.75.75 0 111.06 1.06L5.78 11l2.16 2.17a.75.75 0 010 1.06z" />
                             </svg>
                             Analyze new code
                         </button>
                         <ResultDisplay result={analysisResult} />
                        </>
                    )}
                    {!isLoading && !error && !analysisResult && (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <p>Analysis results will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default AnalysisView;
