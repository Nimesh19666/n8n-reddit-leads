import React, { useState } from 'react';
import { AppStep, ScraperConfig } from './types';
import Configuration from './components/Configuration';
import WorkflowPreview from './components/WorkflowPreview';
import InstructionGuide from './components/InstructionGuide';
import { Layers, Settings, BookOpen, Bot, Share2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.CONFIG);
  const [config, setConfig] = useState<ScraperConfig | null>(null);

  const handleConfigComplete = (newConfig: ScraperConfig) => {
    setConfig(newConfig);
    setCurrentStep(AppStep.PREVIEW);
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-lg shadow-orange-900/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-white tracking-tight">n8n Builder</h1>
              <p className="text-xs text-slate-400 font-medium">Reddit Lead Scraper Edition</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <button
              onClick={() => setCurrentStep(AppStep.CONFIG)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                currentStep === AppStep.CONFIG 
                  ? 'bg-slate-700 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1. Configure
            </button>
            <div className="w-px h-4 bg-slate-700 mx-1"></div>
            <button
              onClick={() => config && setCurrentStep(AppStep.PREVIEW)}
              disabled={!config}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                currentStep === AppStep.PREVIEW 
                  ? 'bg-slate-700 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed'
              }`}
            >
              2. Get JSON
            </button>
            <div className="w-px h-4 bg-slate-700 mx-1"></div>
            <button
              onClick={() => setCurrentStep(AppStep.GUIDE)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                currentStep === AppStep.GUIDE 
                  ? 'bg-slate-700 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3. Setup Guide
            </button>
          </nav>
          
          <a 
            href="https://n8n.io" 
            target="_blank" 
            rel="noreferrer"
            className="hidden sm:flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>n8n Docs</span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-5xl mx-auto px-6 py-12">
        
        {/* Introduction (Only on Config step) */}
        {currentStep === AppStep.CONFIG && (
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-bold text-white mb-4">
              Automate your Lead Gen
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Build a production-ready n8n workflow in seconds. Use AI to find the best keywords, filter out old posts, and sync everything to Google Sheets automatically.
            </p>
          </div>
        )}

        {/* View Switching */}
        {currentStep === AppStep.CONFIG && (
          <Configuration onNext={handleConfigComplete} />
        )}

        {currentStep === AppStep.PREVIEW && config && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Your Custom Workflow</h2>
                <button onClick={() => setCurrentStep(AppStep.GUIDE)} className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1">
                    How to install this? <ArrowRightSmall />
                </button>
            </div>
            <WorkflowPreview config={config} />
          </div>
        )}

        {currentStep === AppStep.GUIDE && (
          <InstructionGuide />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-slate-500 text-sm">
          <p>Generated workflows are compatible with n8n v1.0+</p>
          <p className="mt-2">This tool is not affiliated with Reddit or n8n.</p>
        </div>
      </footer>
    </div>
  );
};

const ArrowRightSmall = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
)

export default App;
