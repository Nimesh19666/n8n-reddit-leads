import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getKeywordSuggestions = async (subreddits: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `I am building a Reddit scraper for the following subreddits: ${subreddits}. 
      Suggest 10 high-intent keywords or phrases that would indicate someone is looking for a solution, tool, or help (lead generation context).
      Return ONLY a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    return ["looking for", "recommend", "help with", "alternative to", "best tool for"];
  } catch (error) {
    console.error("Failed to fetch keywords", error);
    // Fallback
    return ["looking for", "recommend", "help with", "alternative to", "best tool for"];
  }
};

export const getOptimizationTips = async (config: {subreddits: string, keywords: string}) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze this reddit scraper config: Subreddits: ${config.subreddits}, Keywords: ${config.keywords}. 
            Provide 3 brief bullet points on how to improve the search quality to get better leads.`,
        });
        return response.text;
    } catch (e) {
        return "Tip: Ensure your keywords are specific enough to avoid spam.";
    }
}
