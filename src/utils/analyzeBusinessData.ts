import { BusinessData } from "../types/global";

async function analyzeBusinessData(businessData: BusinessData) : Promise<string[]> {
    return ['keyword1', 'keyword2', 'keyword3', 'keyword4', 'keyword5', 'keyword6', 'keyword7', 'keyword8', 'keyword9', 'keyword10'];
}

export { analyzeBusinessData };