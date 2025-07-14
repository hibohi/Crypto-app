
import React, { useState, useCallback } from 'react';
import { fetchMarketInsights } from '../services/geminiService';
import { GroundingChunk } from '../types';

const MarketInsights: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('What are the latest trends for Bitcoin?');
  const [insight, setInsight] = useState<string>('');
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const getInsights = useCallback(async () => {
    if (!prompt) {
      setError('Please enter a question.');
      return;
    }
    setIsLoading(true);
    setError('');
    setInsight('');
    setSources([]);

    try {
      const response = await fetchMarketInsights(prompt);
      setInsight(response.text);
      if (response.sources) {
        setSources(response.sources);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      getInsights();
    }
  };
  
  const presetPrompts = [
    "What is the current sentiment around Ethereum's upcoming network upgrade?",
    "Compare Bitcoin's on-chain metrics to last quarter.",
    "What are the main risk factors for the crypto market this month?"
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-brand-surface border border-brand-border rounded-xl p-6 md:p-8 shadow-lg">
        <h2 className="text-xl font-semibold text-brand-text mb-4">Ask Our AI Analyst</h2>
        <p className="text-brand-secondary mb-6">Get up-to-date market insights powered by Google's Gemini model. Enter your question below or choose a preset.</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., What are the latest trends for Bitcoin?"
            className="flex-grow bg-gray-800/50 border border-brand-border rounded-lg px-4 py-2 text-brand-text focus:ring-2 focus:ring-brand-primary focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={getInsights}
            disabled={isLoading}
            className="bg-brand-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-500 transition-colors duration-300 disabled:bg-brand-secondary disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "Get Insights"}
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {presetPrompts.map(p => (
            <button key={p} onClick={() => setPrompt(p)} className="text-xs bg-gray-700/60 text-brand-secondary px-2 py-1 rounded-md hover:bg-gray-600">
              {p.split(' ')[0]}...
            </button>
          ))}
        </div>
      </div>
      
      {error && <div className="mt-6 p-4 bg-red-500/20 text-brand-danger rounded-lg">{error}</div>}

      {insight && (
        <div className="mt-6 bg-brand-surface border border-brand-border rounded-xl p-6 shadow-lg animate-fade-in">
           <h3 className="text-lg font-semibold text-brand-text mb-4">Analysis</h3>
           <div className="prose prose-invert prose-p:text-brand-text prose-strong:text-brand-text text-brand-text max-w-none whitespace-pre-wrap font-sans">
              {insight}
           </div>
           {sources.length > 0 && (
            <div className="mt-6">
                <h4 className="text-md font-semibold text-brand-secondary mb-2">Sources</h4>
                <ul className="list-disc list-inside space-y-1">
                    {sources.map((source, index) => (
                        <li key={index}>
                            <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline text-sm">
                                {source.web.title || source.web.uri}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
           )}
        </div>
      )}
    </div>
  );
};

export default MarketInsights;
