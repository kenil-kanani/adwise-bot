"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeBusinessData = analyzeBusinessData;
const openai_1 = require("@langchain/openai");
const generative_ai_1 = require("@google/generative-ai");
const prompts_1 = require("@langchain/core/prompts");
const output_parsers_1 = require("@langchain/core/output_parsers");
const serverConfig_1 = require("../config/serverConfig");
const puppeteer_1 = __importDefault(require("puppeteer"));
async function analyzeBusinessData(businessData, provider = 'gemini') {
    try {
        const template = `Analyze this business data and suggest the top 15 most relevant keywords for digital marketing:
    Industry: {industry}
    Objective: {objective}
    WebsiteData : {websiteData}
    Target Audience: {targetAudience}
    Location: {location}
    
    Instructions:
    1. Analyze the business context carefully
    2. Focus on high-intent, targeted keywords
    3. Include a mix of:
       - Industry-specific terms
       - Location-based keywords
       - Problem/solution keywords
       - Long-tail variations
    4. Consider search volume and competition
    5. Ensure keywords align with business objectives
    
    Please provide exactly 15 relevant keywords, one per line, ordered by potential impact.`;
        let response;
        if (provider === 'openai') {
            const chat = new openai_1.ChatOpenAI({
                openAIApiKey: serverConfig_1.OPENAI_API_KEY,
                modelName: "gpt-4o-mini",
                temperature: 0.7,
            });
            const prompt = prompts_1.PromptTemplate.fromTemplate(template);
            const chain = prompt.pipe(chat).pipe(new output_parsers_1.StringOutputParser());
            const websiteData = await scrapeWebsite(businessData.website || 'N/A');
            response = await chain.invoke({
                industry: businessData.industry || 'N/A',
                objective: businessData.objective || 'N/A',
                websiteData: websiteData,
                targetAudience: businessData.targetAudience || 'N/A',
                location: businessData.location || 'N/A',
            });
        }
        else {
            const genAI = new generative_ai_1.GoogleGenerativeAI(serverConfig_1.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const websiteData = await scrapeWebsite(businessData.website || 'N/A');
            const formattedPrompt = template
                .replace('{industry}', businessData.industry || 'N/A')
                .replace('{objective}', businessData.objective || 'N/A')
                .replace('{websiteData}', websiteData)
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
    }
    catch (error) {
        console.error('Error analyzing business data:', error);
        throw error;
    }
}
async function getWebsiteURL(url) {
    try {
        const genAI = new generative_ai_1.GoogleGenerativeAI(serverConfig_1.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const formattedPrompt = `Given the following website URL, extract the website URL: ${url} and return the URL only. Do not include any other text. I need the URL to scrape the website. if the URL is not valid, return an empty string.`;
        const result = await model.generateContent(formattedPrompt);
        console.log('|' + result.response.text().trim() + '|');
        return result.response.text().trim();
    }
    catch (error) {
        console.error('Error getting website URL:', error);
        return '';
    }
}
async function scrapeWebsite(website) {
    try {
        const url = await getWebsiteURL(website);
        const browser = await puppeteer_1.default.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.goto(url, { waitUntil: 'networkidle0' });
        const content = await page.evaluate(() => {
            const elementsToRemove = document.querySelectorAll('script, style, iframe, noscript');
            elementsToRemove.forEach(element => element.remove());
            return document.body.innerText;
        });
        await browser.close();
        const cleanedContent = content
            .replace(/\s+/g, ' ')
            .trim();
        console.log(cleanedContent);
        return cleanedContent;
    }
    catch (error) {
        console.error('Error scraping website:', error);
        return '';
    }
}
