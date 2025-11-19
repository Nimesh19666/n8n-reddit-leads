import React, { useState } from 'react';
import { ScraperConfig } from '../types';
import { getKeywordSuggestions, getOptimizationTips } from '../services/geminiService';
import { Wand2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

interface ConfigurationProps {
  onNext: (config: ScraperConfig) => void;
}

const Configuration: React.FC<ConfigurationProps> = ({ onNext }) => {
  const [loadingAi, setLoadingAi] = useState(false);
  const [config, setConfig] = useState<ScraperConfig>({
    subreddits: 'saas, entrepreneur, startups',
    keywords: 'looking for tools, need automation, seeking developer',
    daysOld: 7,
    scheduleHours: 6,
    checkDuplicates: true,
  });
  const [aiTips, setAiTips] = useState<string | null>(null);

  const handleAiSuggest = async () => {
    if (!config.subreddits) return;
    setLoadingAi(true);
    setAiTips(null);
    try {
      const keywords = await getKeywordSuggestions(config.subreddits);
      const tips = await getOptimizationTips({ subreddits: config.subreddits, keywords: config.keywords });
      setConfig(prev => ({ ...prev, keywords: keywords.join(', ') }));
      setAiTips(tips);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="bg-slate-800/40 p-8 rounded-2xl border border-slate-700 backdrop-blur-sm shadow-xl">
        <div className="space-y-6">
          
          {/* Subreddits Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Target Subreddits (comma separated)
            </label>
            <input
              type="text"
              value={config.subreddits}
              onChange={(e) => setConfig({ ...config, subreddits: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-600"
              placeholder="e.g. r/marketing, r/smallbusiness"
            />
          </div>

          {/* Keywords Input with AI */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-slate-300">
                Search Keywords
              </label>
              <button
                onClick={handleAiSuggest}
                disabled={loadingAi || !config.subreddits}
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
              >
                {loadingAi ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                {loadingAi ? 'Analyzing...' : 'AI Suggest Keywords'}
              </button>
            </div>
            <textarea
              value={config.keywords}
              onChange={(e) => setConfig({ ...config, keywords: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-600 resize-none"
              placeholder="e.g. 'how to build', 'looking for crm'"
            />
            {aiTips && (
               <div className="mt-2 p-3 bg-blue-900/20 border border-blue-800/50 rounded-md">
                  <p className="text-xs text-blue-200 italic flex gap-2">
                     <Wand2 className="w-3 h-3 mt-0.5 shrink-0" />
                     {aiTips}
                  </p>
               </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Schedule */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Run Every (Hours)
              </label>
              <select
                value={config.scheduleHours}
                onChange={(e) => setConfig({ ...config, scheduleHours: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value={1}>1 Hour</option>
                <option value={6}>6 Hours</option>
                <option value={12}>12 Hours</option>
                <option value={24}>24 Hours</option>
              </select>
            </div>

            {/* Age Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Filter Posts Older Than
              </label>
              <div className="flex items-center bg-slate-900/50 border border-slate-700 rounded-lg overflow-hidden">
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={config.daysOld}
                  onChange={(e) => setConfig({ ...config, daysOld: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-transparent text-white focus:outline-none"
                />
                <span className="px-4 text-slate-500 text-sm">Days</span>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="pt-4 border-t border-slate-700/50">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${config.checkDuplicates ? 'bg-blue-500 border-blue-500' : 'border-slate-600 bg-slate-900'}`}>
                 {config.checkDuplicates && <CheckIcon className="w-3.5 h-3.5 text-white" />}
              </div>
              <input 
                type="checkbox" 
                className="hidden"
                checked={config.checkDuplicates}
                onChange={(e) => setConfig({...config, checkDuplicates: e.target.checked})}
              />
              <span className="text-slate-300 text-sm group-hover:text-white transition-colors">
                Prevent Duplicates (Check if URL exists in Sheet)
              </span>
            </label>
            <p className="mt-2 ml-8 text-xs text-slate-500 flex items-start gap-1">
              <AlertCircle className="w-3 h-3 mt-0.5" />
              Recommended to avoid processing the same lead twice.
            </p>
          </div>

          <button
            onClick={() => onNext(config)}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-4 rounded-lg shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
          >
            Generate Workflow JSON
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

        </div>
      </div>
    </div>
  );
};

const CheckIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default Configuration;
