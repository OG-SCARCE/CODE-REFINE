
import React, { useState } from 'react';
import type { AnalysisResult, Optimization } from '../types';

const severityStyles = {
    High: 'bg-red-800/50 text-red-300 border-red-700/50',
    Medium: 'bg-yellow-800/50 text-yellow-300 border-yellow-700/50',
    Low: 'bg-sky-800/50 text-sky-300 border-sky-700/50',
};

const categoryStyles = 'bg-gray-700/60 text-gray-300 border-gray-600/50';

const Badge: React.FC<{ text: string, className?: string }> = ({ text, className }) => (
    <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${className}`}>
        {text}
    </span>
);

const OptimizationCard: React.FC<{ optimization: Optimization, index: number }> = ({ optimization, index }) => {
    return (
        <details className="bg-gray-800/60 rounded-lg overflow-hidden group border border-gray-700/50" style={{ animationDelay: `${index * 100}ms` }}>
            <summary className="p-4 cursor-pointer flex justify-between items-center list-none group-hover:bg-gray-700/50 transition-colors">
                <div>
                    <h4 className="font-semibold">{optimization.issue}</h4>
                    <div className="flex items-center gap-2 mt-2">
                         <Badge text={optimization.severity} className={severityStyles[optimization.severity]} />
                         <Badge text={optimization.category} className={categoryStyles} />
                    </div>
                </div>
                <div className="transform transition-transform duration-300 group-open:rotate-180">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
                    </svg>
                </div>
            </summary>
            <div className="p-4 border-t border-gray-700 bg-black/20">
                <div className="mb-4">
                    <h5 className="font-semibold text-sm text-gray-300 mb-1">Suggestion:</h5>
                    <p className="text-sm text-gray-400 font-mono bg-gray-900/50 p-2 rounded">{optimization.suggestion}</p>
                </div>
                <div>
                    <h5 className="font-semibold text-sm text-gray-300 mb-1">Explanation:</h5>
                    <p className="text-sm text-gray-400">{optimization.explanation}</p>
                </div>
            </div>
        </details>
    );
};

const CodeBlock: React.FC<{ code: string }> = ({ code }) => {
    const [copyText, setCopyText] = useState('Copy Code');

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopyText('Copied!');
        setTimeout(() => setCopyText('Copy Code'), 2000);
    };

    return (
        <div className="relative group">
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 bg-gray-700 text-white text-xs font-semibold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-600"
            >
                {copyText}
            </button>
            <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm font-mono border border-gray-700">
                <code className="text-gray-200">{code}</code>
            </pre>
        </div>
    );
};


const ResultDisplay: React.FC<{ result: AnalysisResult }> = ({ result }) => {
    return (
        <div className="space-y-8">
            <div className="animate-slide-in-bottom" style={{ animationDelay: '0ms' }}>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-2xl font-bold">Analysis Summary</h2>
                    <Badge text={result.language} className="bg-blue-900/50 text-blue-300 border-blue-700/50 !text-sm !px-4 !py-1" />
                </div>
                <p className="text-gray-300 text-base">{result.summary}</p>
            </div>

            <div className="animate-slide-in-bottom" style={{ animationDelay: '100ms' }}>
                <h2 className="text-2xl font-bold mb-3">Optimization Suggestions</h2>
                <div className="space-y-3">
                    {result.optimizations.map((opt, index) => (
                        <div key={index} className="animate-slide-in-bottom" style={{ animationDelay: `${100 + index * 100}ms`}}>
                             <OptimizationCard optimization={opt} index={index} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="animate-slide-in-bottom" style={{ animationDelay: `${200 + result.optimizations.length * 100}ms`}}>
                <h2 className="text-2xl font-bold mb-3">Refactored Code</h2>
                <CodeBlock code={result.refactoredCode} />
            </div>
        </div>
    );
};

export default ResultDisplay;
