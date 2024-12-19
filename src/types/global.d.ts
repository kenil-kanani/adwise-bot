export interface BusinessData {
    industry?: string;
    objective?: string;
    website?: string;
    socialMedia?: string;
    ppcCampaigns?: string;
    targetAudience?: string;
    location?: string;
    generatedKeywords?: string[];
}

export interface QuestionAnswer {
    question?: string;
    answer?: string;
}

export interface FAQData {
    context?: QuestionAnswer[];
}

export interface IndustryBenchmarks {
    cpc: number;
    ctr: number;
    conversionRate: number;
    costPerLead: number;
    lastUpdated: Date;
}