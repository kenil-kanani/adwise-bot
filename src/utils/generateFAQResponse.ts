import { BusinessData, FAQData } from "../types/global";

async function generateFAQResponse(context: FAQData, question: string) : Promise<string> {
    return 'answer';
}

export { generateFAQResponse };