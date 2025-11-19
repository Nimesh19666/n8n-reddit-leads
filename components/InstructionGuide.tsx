import React from 'react';
import { Shield, Key, FileSpreadsheet, Play } from 'lucide-react';

const InstructionGuide: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6 bg-slate-900/50 rounded-xl border border-slate-800">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Implementation Guide</h2>
        <p className="text-slate-400">Follow these steps to get your automation running in 15 minutes.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Step 1: Reddit API */}
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 hover:border-orange-500/50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Shield className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-semibold text-lg text-white">1. Reddit API Credentials</h3>
          </div>
          <ol className="list-decimal list-inside space-y-3 text-slate-300 text-sm">
            <li>Go to <a href="https://www.reddit.com/prefs/apps" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Reddit Apps Preferences</a>.</li>
            <li>Click <strong>Create Another App...</strong> at the bottom.</li>
            <li>Select <strong>script</strong> (personal use).</li>
            <li>Name it (e.g., "n8n-scraper").</li>
            <li>For redirect URI, use: <code className="bg-black/50 px-1 py-0.5 rounded">http://localhost:5678/rest/oauth2-credential/callback</code> (for local n8n) or your cloud URL.</li>
            <li>Copy the <strong>Client ID</strong> (under the name) and <strong>Client Secret</strong>.</li>
            <li>In n8n, create a "Reddit OAuth2 API" credential using these keys.</li>
          </ol>
        </div>

        {/* Step 2: Google Sheets */}
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 hover:border-green-500/50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <FileSpreadsheet className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="font-semibold text-lg text-white">2. Google Sheets Setup</h3>
          </div>
          <ol className="list-decimal list-inside space-y-3 text-slate-300 text-sm">
            <li>Create a new Google Sheet.</li>
            <li>Add headers in Row 1: <strong>Title, URL, Author, Content, Date</strong>.</li>
            <li>In n8n, create a "Google Sheets OAuth2 API" credential.</li>
            <li>You will need a Google Cloud Project with the Sheets API enabled.</li>
            <li>Alternatively, for quick testing, make the sheet public (not recommended for sensitive data) or use a Service Account.</li>
          </ol>
        </div>

        {/* Step 3: Import Workflow */}
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 hover:border-indigo-500/50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Key className="w-6 h-6 text-indigo-500" />
            </div>
            <h3 className="font-semibold text-lg text-white">3. Import Workflow</h3>
          </div>
          <ul className="space-y-3 text-slate-300 text-sm">
            <li>Copy the JSON generated in the previous step.</li>
            <li>Open your n8n dashboard.</li>
            <li>Press <code className="bg-black/50 px-1 py-0.5 rounded">Ctrl + V</code> (or Cmd + V) anywhere on the canvas to paste the nodes.</li>
            <li>Or use the menu: <strong>Workflow &gt; Import from File/JSON</strong>.</li>
          </ul>
        </div>

        {/* Step 4: Final Config */}
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 hover:border-pink-500/50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-pink-500/20 rounded-lg">
              <Play className="w-6 h-6 text-pink-500" />
            </div>
            <h3 className="font-semibold text-lg text-white">4. Activate & Run</h3>
          </div>
          <ul className="space-y-3 text-slate-300 text-sm">
            <li>Double-click the <strong>Reddit Search</strong> node and select your Credential.</li>
            <li>Double-click the <strong>Google Sheets</strong> nodes and select your Credential.</li>
            <li>Paste your Google Sheet URL into the 'Spreadsheet ID' field (or use the ID).</li>
            <li>Toggle the workflow to <strong>Active</strong> in the top right.</li>
            <li>Enjoy your automated leads!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InstructionGuide;
