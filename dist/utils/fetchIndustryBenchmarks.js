"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformData = void 0;
exports.fetchIndustryBenchmarks = fetchIndustryBenchmarks;
const openai_1 = require("@langchain/openai");
const generative_ai_1 = require("@google/generative-ai");
const prompts_1 = require("@langchain/core/prompts");
const output_parsers_1 = require("@langchain/core/output_parsers");
const serverConfig_1 = require("../config/serverConfig");
const transformData = async (data) => {
    const genAI = new generative_ai_1.GoogleGenerativeAI(serverConfig_1.GEMINI_API_KEY);
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
};
exports.transformData = transformData;
async function fetchIndustryBenchmarks(data, provider = 'gemini') {
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
        let responses = [];
        if (provider === 'openai') {
            const chat = new openai_1.ChatOpenAI({
                openAIApiKey: serverConfig_1.OPENAI_API_KEY,
                modelName: "gpt-4o-mini",
                temperature: 0.7,
            });
            const prompt = prompts_1.PromptTemplate.fromTemplate(template);
            const chain = prompt.pipe(chat).pipe(new output_parsers_1.StringOutputParser());
            const openAIResponse = await chain.invoke({
                context: data,
            });
            responses.push(openAIResponse.trim());
        }
        if (provider === 'gemini') {
            const genAI = new generative_ai_1.GoogleGenerativeAI(serverConfig_1.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const formattedPrompt = template
                .replace('{context}', data);
            const result = await model.generateContent(formattedPrompt);
            const geminiResponse = result.response.text();
            responses.push(geminiResponse.trim());
        }
        return responses[0].toString();
    }
    catch (error) {
        console.error('Error generating Industry Benchmarks:', error);
        throw error;
    }
}
