import { IndustryBenchmarks } from "../types/global";


async function fetchIndustryBenchmarks(industry: string): Promise<IndustryBenchmarks | null> {
    try {
        const mockData: IndustryBenchmarks = {
            cpc: industry === 'construction' ? 2.5 : 1.5,
            ctr: 2.8,
            conversionRate: 3.75,
            costPerLead: 75.0,
            lastUpdated: new Date()
        };
        return mockData;
    } catch (error) {
        console.error('Error fetching industry benchmarks:', error);
        return null;
    }
}

export { fetchIndustryBenchmarks };