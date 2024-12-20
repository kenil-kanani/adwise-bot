"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFAQResponse = generateFAQResponse;
const openai_1 = require("@langchain/openai");
const generative_ai_1 = require("@google/generative-ai");
const prompts_1 = require("@langchain/core/prompts");
const output_parsers_1 = require("@langchain/core/output_parsers");
const serverConfig_1 = require("../config/serverConfig");
async function generateFAQResponse(context, question, provider = 'gemini') {
    try {
        const template = `You are an AI Digital Marketing Assistant. Your role is to provide expert guidance on digital marketing topics only.

    Previous conversation context (context is nothing but the old conversation between the user and the assistant if it is empty, it means the user has not asked any question yet): 
    {context}

    User Question: {userQuestion}

    Instructions:
    1. Only respond to questions related to digital marketing, advertising, social media marketing, SEO, content marketing, analytics, or marketing strategy.
    2. If the question is not related to digital marketing, politely inform the user that you can only assist with digital marketing topics.
    3. When answering marketing questions:
       - Provide clear, actionable insights
       - Include relevant industry best practices
       - Be specific and practical in your recommendations
       - Keep answers concise but comprehensive
       - Format responses using Telegram markdown for better readability:
         * Do not use *bold* for headings and key terms
         * Use bullet points (•) for lists
         * Add line breaks between sections
         * Keep paragraphs short and scannable
         * Use Emojis to make the answer more engaging
    4. If the user asks to exit or end the conversation, acknowledge and say goodbye.

    Please provide your response following these guidelines, ensuring proper formatting for Telegram display. Give the answer in the formate that telegram supports. Limit the answer to 1000 characters.`;
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
                context: context.context || 'N/A',
                userQuestion: question,
            });
            responses.push(openAIResponse.trim());
        }
        if (provider === 'gemini') {
            const genAI = new generative_ai_1.GoogleGenerativeAI(serverConfig_1.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
            const formattedPrompt = template
                .replace('{context}', JSON.stringify(context.context))
                .replace('{userQuestion}', question);
            const result = await model.generateContent(formattedPrompt);
            const geminiResponse = result.response.text();
            responses.push(geminiResponse.trim());
        }
        return responses[0].toString();
    }
    catch (error) {
        console.error('Error generating FAQ response:', error);
        throw error;
    }
}
