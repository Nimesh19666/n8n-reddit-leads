export interface ScraperConfig {
  subreddits: string;
  keywords: string;
  daysOld: number;
  scheduleHours: number;
  checkDuplicates: boolean;
}

export interface KeywordSuggestion {
  category: string;
  keywords: string[];
}

export enum AppStep {
  CONFIG = 'CONFIG',
  PREVIEW = 'PREVIEW',
  GUIDE = 'GUIDE'
}
