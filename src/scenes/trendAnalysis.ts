import { Scenes } from 'telegraf';
import { SessionData } from '../bot';
import { fetchIndustryBenchmarks } from '../utils/fetchIndustryBenchmarks';
import { IndustryBenchmarks } from '../types/global';

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
        await ctx.reply('Please specify your industry (e.g., construction, healthcare, retail):');
        ctx.wizard.state.trendData = {};
        return ctx.wizard.next();
    },

    async (ctx) => {
        if (!ctx.message || !('text' in ctx.message)) {
            await ctx.reply('Please provide a valid industry name.');
            return;
        }

        const industry = ctx.message.text.toLowerCase();
        ctx.wizard.state.trendData = { industry };
        
        const benchmarks = await fetchIndustryBenchmarks(industry);
        if (benchmarks) {
            ctx.wizard.state.trendData.metrics = benchmarks;
            await ctx.reply(
                `Industry Benchmarks for ${industry}:\n` +
                `CPC: $${benchmarks.cpc}\n` +
                `CTR: ${benchmarks.ctr}%\n` +
                `Conversion Rate: ${benchmarks.conversionRate}%\n` +
                `Cost Per Lead: $${benchmarks.costPerLead}`
            );
        } else {
            await ctx.reply('Sorry, could not fetch industry benchmarks at this time. Please try again later.');
        }

        return ctx.wizard.next();
    }
);

export type { TrendWizardSession, TrendWizardContext };