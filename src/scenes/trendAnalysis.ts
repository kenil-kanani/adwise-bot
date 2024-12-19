import { Scenes } from 'telegraf';
import { SessionData } from '../bot';

interface TrendData {
  industry?: string;
  metrics?: {
    cpc?: number;
    ctr?: number;
    conversionRate?: number;
    costPerLead?: number;
    lastUpdated?: Date;
  };
  historicalTrends?: {
    date: Date;
    metric: string;
    value: number;
  }[];
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
        await ctx.reply('What is your question?');
        ctx.wizard.next();
    }
);

export type { TrendWizardSession, TrendWizardContext };