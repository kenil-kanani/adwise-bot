import { Scenes } from 'telegraf';
import { SessionData } from '../bot';
import { fetchIndustryBenchmarks, transformData } from '../utils/fetchIndustryBenchmarks';
import { IndustryBenchmarks } from '../types/global';
import { scrapeWebContent } from '../utils/scrapeWebContent';

interface TrendData {
  industry?: string;
  metrics?: IndustryBenchmarks;
}

interface TrendWizardSession extends Scenes.WizardSessionData {
  trendData: TrendData;
}

interface TrendWizardContext extends Scenes.WizardContext<SessionData> {
    wizard: Scenes.WizardContextWizard<TrendWizardContext> & {
        state: {
            trendData?: TrendData;
        };
    };
}

export const TrendAnalysisScene = new Scenes.WizardScene<TrendWizardContext>(
    'trend-analysis',

    async (ctx) => {
        await ctx.reply('Fetching industry benchmarks...');
        const data = await scrapeWebContent();
        const benchmarks = await fetchIndustryBenchmarks(data);
        const transformedData = await transformData(data);
        await ctx.reply(transformedData);
        await ctx.reply(benchmarks);

        return ctx.wizard.next();
    }
);

export type { TrendWizardSession, TrendWizardContext };