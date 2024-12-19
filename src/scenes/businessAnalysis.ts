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
      socialMediaPlatforms?: string;
      analyzePermission?: boolean;
    };
    ppcCampaigns?: {
      exists: boolean;
      analyzePermission?: boolean;
    };
    targetAudience?: string;
    location?: string;
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

  // Step - 1, This is the first step of the wizard, it executes when the user starts the wizard
  async (ctx) => {
    ctx.wizard.state.businessData = {};
    await ctx.reply('What industry is your business in?');
    ctx.wizard.next();
  },

  // Step - 2, This is the second step of the wizard, it executes when the user provides the industry
  async (ctx) => {
    if (ctx.message && 'text' in ctx.message) {
      // I need to check if the businessData is already initialized, if not, initialize it, Else it will give me the type error
      if (!ctx.wizard.state.businessData) {
        ctx.wizard.state.businessData = {};
      }
      ctx.wizard.state.businessData.industry = ctx.message.text;
      await ctx.reply('What is your business objective?');
      ctx.wizard.next();
    }
  },

  // Step - 3, This is the third step of the wizard, it executes when the user provides the objective
  async (ctx) => {
    if (ctx.message && 'text' in ctx.message) {
      // Safely store objective
      if (!ctx.wizard.state.businessData) {
        ctx.wizard.state.businessData = {};
      }
      ctx.wizard.state.businessData.objective = ctx.message.text;
      await ctx.reply('What is your website URL?');
      ctx.wizard.next();
    }
  },

  // Step - 4, This is the fourth step of the wizard, it executes when the user provides the website URL
  async (ctx) => {
    if (ctx.message && 'text' in ctx.message) {
      // Safely store website
      if (!ctx.wizard.state.businessData) {
        ctx.wizard.state.businessData = {};
      }
      ctx.wizard.state.businessData.website = {
        url: ctx.message.text,
        analyzePermission: true,
      };
      await ctx.reply('Do you have any social media platforms?');
      ctx.wizard.next();
    }
  },

  // Step - 5, This is the fifth step of the wizard, it executes when the user provides the social media platforms
  async (ctx) => {
    if (ctx.message && 'text' in ctx.message) {
      if (!ctx.wizard.state.businessData) {
        ctx.wizard.state.businessData = {};
      }
      ctx.wizard.state.businessData.socialMedia = {
        socialMediaPlatforms: ctx.message.text,
        analyzePermission: true,
      };
      await ctx.reply('Do you have any PPC campaigns?');
      ctx.wizard.next();
    }
  },

  // Step - 6, This is the sixth step of the wizard, it executes when the user provides the PPC campaigns
  async (ctx) => {
    if (ctx.message && 'text' in ctx.message) {
      if (!ctx.wizard.state.businessData) {
        ctx.wizard.state.businessData = {};
      }
      ctx.wizard.state.businessData.ppcCampaigns = {
        exists: true,
        analyzePermission: true,
      };
      await ctx.reply('What is your target audience?');
      ctx.wizard.next();
    }
  },

// Step - 7, This is the seventh step of the wizard, it executes when the user provides the target audience
async (ctx) => {
  if (ctx.message && 'text' in ctx.message) {
      if (!ctx.wizard.state.businessData) {
        ctx.wizard.state.businessData = {};
      }
      ctx.wizard.state.businessData.targetAudience = ctx.message.text;
      await ctx.reply('What is your target location?');
      ctx.wizard.next();
    }
  },

  // Step - 8, This is the eighth step of the wizard, it executes when the user provides the target location
  async (ctx) => {
    if (ctx.message && 'text' in ctx.message) {
      if (!ctx.wizard.state.businessData) {
        ctx.wizard.state.businessData = {};
      }
      ctx.wizard.state.businessData.location = ctx.message.text;
      await ctx.reply('Thank you for providing the information. I will now analyze your business and provide you with keyword suggestions.');
      ctx.wizard.next();
    }
  },

);

// 

BusinessAnalysisScene.command('cancel', async (ctx) => {
  await ctx.reply('Operation cancelled');
  return ctx.scene.leave();
});

export type { BusinessWizardSession };
