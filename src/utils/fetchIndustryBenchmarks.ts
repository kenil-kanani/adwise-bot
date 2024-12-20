import { ChatOpenAI } from "@langchain/openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { OPENAI_API_KEY, GEMINI_API_KEY } from "../config/serverConfig";
import { scrapeWebContent } from "./scrapeWebContent";


const transformData = async (data: string) => {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const formattedPrompt = `Transform this PPC benchmark data into a concise summary with emojis.

    Raw Data:
    ${data}

    Instructions:
    1. 📊 Show key metrics with emojis (CPC 💰, CTR 🎯, etc.)
    2. 📝 Keep it brief - one line per metric
    3. 🔢 Round numbers to 2 decimal places
    4. 📈 Show % changes with up/down arrows
    5. ✨ Highlight top performing metrics
    6. 🎨 Use clear sections with spacing

    Format Guidelines:
    • Use bullet points (•) for all lists
    • Include relevant emojis
    • Keep insights brief and data-focused
    • No bold text formatting
    • Add line breaks between sections
    
    Make it quick and easy to scan through the data.`;

    const result = await model.generateContent(formattedPrompt);
    const geminiResponse = result.response.text();
    return geminiResponse.trim();
}

async function fetchIndustryBenchmarks(
    data: string,
    provider: 'openai' | 'gemini' = 'gemini'
): Promise<string> {
    // take first 1000 characters
    data = data.substring(0, 1000);

  try {
    const template = `You are an AI Digital Marketing Assistant analyzing PPC industry benchmarks.

    Raw Industry Data:
    {context}

    Instructions:
    1. 📊 Analyze the data and provide insights in bullet points format:
       • Key Metrics Summary:
         - 💰 Cost Per Click (CPC)
         - 🎯 Click-Through Rate (CTR) 
         - 🎉 Conversion Rate
         - 💵 Cost Per Conversion

    2. 📈 For each metric include:
       • Current value
       • Industry average comparison
       • Percentage difference
       • Performance rating (Good/Needs Improvement)

    3. 🔍 Highlight Key Findings:
       • Top performing metrics
       • Areas needing attention
       • Notable trends

    4. ✨ Provide 2-3 actionable tips based on the data

    Format Guidelines:
    • Use bullet points (•) for all lists
    • Include relevant emojis
    • Keep insights brief and data-focused
    • No bold text formatting
    • Add line breaks between sections

    Analyze the data and provide clear, actionable insights to improve PPC performance.`;

    let responses: string[] = [];

    if (provider === 'openai') {
      const chat = new ChatOpenAI({
        openAIApiKey: OPENAI_API_KEY,
        modelName: "gpt-4o-mini",
        temperature: 0.7,
      });
      
      const prompt = PromptTemplate.fromTemplate(template);
      const chain = prompt.pipe(chat).pipe(new StringOutputParser());
      
      const openAIResponse = await chain.invoke({
        context: data,
      });
      
      responses.push(openAIResponse.trim());
    }

    if (provider === 'gemini') {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const formattedPrompt = template
        .replace('{context}', data);

      const result = await model.generateContent(formattedPrompt);
      const geminiResponse = result.response.text();
      responses.push(geminiResponse.trim());
    }

    return responses[0].toString();
    
  } catch (error) {
    console.error('Error generating Industry Benchmarks:', error);
    throw error;
  }
}

export { fetchIndustryBenchmarks, transformData };