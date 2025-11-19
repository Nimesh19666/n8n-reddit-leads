import React, { useState } from 'react';
import { ScraperConfig } from '../types';
import { generateN8nWorkflow } from '../services/n8nTemplate';
import { Copy, Download, Check, Terminal } from 'lucide-react';

interface WorkflowPreviewProps {
  config: ScraperConfig;
}

const WorkflowPreview: React.FC<WorkflowPreviewProps> = ({ config }) => {
  const workflowJson = generateN8nWorkflow(config);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(workflowJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([workflowJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reddit-scraper-n8n.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-slate-300">n8n-workflow.json</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors border border-slate-600"
            >
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors shadow-sm shadow-blue-900/20"
            >
              <Download className="w-3 h-3" />
              Download .json
            </button>
          </div>
        </div>
        <div className="relative">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-gradient-to-b from-transparent via-transparent to-slate-900/10"></div>
            <pre className="p-4 text-xs sm:text-sm text-blue-100 font-mono overflow-x-auto max-h-[500px] scrollbar-thin">
                {workflowJson}
            </pre>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
              <h4 className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Target Subreddits</h4>
              <p className="text-white truncate">{config.subreddits}</p>
          </div>
          <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
              <h4 className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Keywords</h4>
              <p className="text-white truncate">{config.keywords}</p>
          </div>
           <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
              <h4 className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Frequency</h4>
              <p className="text-white">Every {config.scheduleHours} Hours</p>
          </div>
      </div>
    </div>
  );
};

export default WorkflowPreview;
