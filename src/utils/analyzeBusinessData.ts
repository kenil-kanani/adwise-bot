import { BusinessData } from "../types/global";
import { ChatOpenAI } from "@langchain/openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { OPENAI_API_KEY, GEMINI_API_KEY } from "../config/serverConfig";

async function analyzeBusinessData(
  businessData: BusinessData, 
  provider: 'openai' | 'gemini' = 'gemini'
): Promise<string[]> {
  try {
    const template = `Analyze this business data and suggest relevant keywords for digital marketing:
    Industry: {industry}
    Objective: {objective}
    Website: {website}
    Target Audience: {targetAudience}
    Location: {location}
    
    Please provide a list of relevant keywords, one per line.`;

    let response: string;

    if (provider === 'openai') {
      const chat = new ChatOpenAI({
        openAIApiKey: OPENAI_API_KEY,
        modelName: "gpt-4o-mini",
        temperature: 0.7,
      });
      
      const prompt = PromptTemplate.fromTemplate(template);
      const chain = prompt.pipe(chat).pipe(new StringOutputParser());
      
      response = await chain.invoke({
        industry: businessData.industry || 'N/A',
        objective: businessData.objective || 'N/A',
        website: businessData.website || 'N/A',
        targetAudience: businessData.targetAudience || 'N/A',
        location: businessData.location || 'N/A',
      });
    } else {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const formattedPrompt = template
        .replace('{industry}', businessData.industry || 'N/A')
        .replace('{objective}', businessData.objective || 'N/A')
        .replace('{website}', businessData.website || 'N/A')
        .replace('{targetAudience}', businessData.targetAudience || 'N/A')
        .replace('{location}', businessData.location || 'N/A');

      const result = await model.generateContent(formattedPrompt);
      response = result.response.text();
    }

    const keywords = response
      .split('\n')
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0);

    return keywords;
  } catch (error) {
    console.error('Error analyzing business data:', error);
    throw error;
  }
}

export { analyzeBusinessData };