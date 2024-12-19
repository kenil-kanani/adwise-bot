import { Scenes } from 'telegraf';
import { SessionData } from '../bot';


interface BusinessData {
  industry?: string;
    objective?: string;
    website?: {
      url?: string;
      analyzePermission?: boolean;
    };
    socialMedia?: {
      platforms: {
        name: string;
        url: string;
      }[];
      analyzePermission?: boolean;
    };
    ppcCampaigns?: {
      exists: boolean;
      analyzePermission?: boolean;
    };
    targetAudience?: {
      demographics?: string[];
      interests?: string[];
    };
    location?: {
      primary?: string;
      secondary?: string[];
    };
    generatedKeywords?: string[];
}

interface BusinessWizardSession extends Scenes.WizardSessionData {
  businessData: BusinessData;
}

interface BusinessWizardContext extends Scenes.WizardContext<SessionData> {
  wizard: Scenes.WizardContextWizard<BusinessWizardContext> & {
    state: {
      businessData?: BusinessData;
    };
  };
}

export const BusinessAnalysisScene = new Scenes.WizardScene<BusinessWizardContext>(
  'business-analysis',

  async (ctx) => {
    await ctx.reply('What industry is your business in?');
    ctx.wizard.next();
  },
  
  async (ctx) => {
    if (ctx.message && 'text' in ctx.message) {
      ctx.wizard.state.businessData = ctx.wizard.state.businessData || {};
      ctx.wizard.state.businessData.industry = ctx.message.text;
      await ctx.reply('What is your business objective?');
    }
    ctx.wizard.next();
  }
);

BusinessAnalysisScene.command('cancel', async (ctx) => {
  await ctx.reply('Operation cancelled');
  return ctx.scene.leave();
});

export type { BusinessWizardSession };
