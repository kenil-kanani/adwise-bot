import { Scenes } from 'telegraf';
import { SessionData } from '../bot';
import { BusinessData } from '../types/global';
import { analyzeBusinessData } from '../utils/analyzeBusinessData';

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

  // Step 1
  async (ctx) => {
    ctx.wizard.state.businessData = {};
    await ctx.reply('🏢 Welcome to the Business Analysis Wizard!\n\nTo get started, please tell me which industry your business operates in. Be as specific as possible.');
    ctx.wizard.next();
  },

  // Step 2
  async (ctx) => {
    if (ctx.message && 'text' in ctx.message) {
      if (!ctx.wizard.state.businessData) {
        ctx.wizard.state.businessData = {};
      }
      ctx.wizard.state.businessData.industry = ctx.message.text;
      await ctx.reply('🎯 Great! Now, what are your main business objectives?\n\nFor example:\n• Increase online sales\n• Boost brand awareness\n• Generate more leads');
      ctx.wizard.next();
    }
  },

  // Step 3
  async (ctx) => {
    if (ctx.message && 'text' in ctx.message) {
      if (!ctx.wizard.state.businessData) {
        ctx.wizard.state.businessData = {};
      }
      ctx.wizard.state.businessData.objective = ctx.message.text;
      await ctx.reply('🌐 What is your business website URL?\n\nProviding your website will allow us to analyze your:\n• SEO performance\n• Content strategy\n• User experience\n• Technical optimization\n\nIf you don\'t have a website, please type "none".');
      ctx.wizard.next();
    }
  },

  // Step 4
  async (ctx) => {
    if (ctx.message && 'text' in ctx.message) {
      if (!ctx.wizard.state.businessData) {
        ctx.wizard.state.businessData = {};
      }
      ctx.wizard.state.businessData.website = ctx.message.text;
      await ctx.reply('📱 Let\'s talk about your social media presence.\n\nPlease share your main social media profiles (Facebook, Instagram, LinkedIn, etc.).\nThis will allow us to analyze:\n• Engagement rates\n• Content performance\n• Audience demographics\n• Growth opportunities\n\nIf you don\'t have any social media presence, type "none".');
      ctx.wizard.next();
    }
  },

  // Step 5
  async (ctx) => {
    if (ctx.message && 'text' in ctx.message) {
      if (!ctx.wizard.state.businessData) {
        ctx.wizard.state.businessData = {};
      }
      ctx.wizard.state.businessData.socialMedia = ctx.message.text;
      await ctx.reply('💰 Are you currently running any PPC (Pay-Per-Click) campaigns?\n\nIf yes, please provide details about your campaigns. This will allow us to analyze:\n• ROI performance\n• Keyword effectiveness\n• Budget optimization\n• Audience targeting\n\nIf none, simply type "none".');
      ctx.wizard.next();
    }
  },

  // Step 6
  async (ctx) => {
    if (ctx.message && 'text' in ctx.message) {
      if (!ctx.wizard.state.businessData) {
        ctx.wizard.state.businessData = {};
      }
      ctx.wizard.state.businessData.ppcCampaigns = ctx.message.text;
      await ctx.reply('👥 Who is your target audience?\n\nPlease describe:\n• Age range\n• Interests\n• Pain points\n• Buying behavior');
      ctx.wizard.next();
    }
  },

  // Step 7
  async (ctx) => {
    if (ctx.message && 'text' in ctx.message) {
      if (!ctx.wizard.state.businessData) {
        ctx.wizard.state.businessData = {};
      }
      ctx.wizard.state.businessData.targetAudience = ctx.message.text;
      await ctx.reply('📍 What is your target location?\n\nFor example:\n• Specific cities\n• Regions\n• Countries\n• Or "Worldwide"');
      ctx.wizard.next();
    }
  },

  // Step 8
  async (ctx) => {
    if (ctx.message && 'text' in ctx.message) {
      if (!ctx.wizard.state.businessData) {
        ctx.wizard.state.businessData = {};
      }
      ctx.wizard.state.businessData.location = ctx.message.text;
      await ctx.reply('✨ Thank you for providing all the information!\n\nI\'m now processing your business data to generate targeted keyword suggestions and insights. This analysis will take just a moment...\n\nPlease wait while I prepare your personalized recommendations. 🔄');

      const businessData = ctx.wizard.state.businessData;

      // Analyze business data
      const analysisResults = await analyzeBusinessData(businessData!);

      if (analysisResults.length === 0) {
        await ctx.reply('🔍 No keyword suggestions found based on your business data. Please try again with more detailed information.');
      } else {
        ctx.wizard.state.businessData!.generatedKeywords = analysisResults;
  
        let formattedResults = '🎯 Top Keyword Suggestions:\n';
        
        for (let i = 0; i < Math.min(5, analysisResults.length); i++) {
          formattedResults += `   ${i + 1}. ${analysisResults[i]}\n`;
        }
        
        formattedResults += '\n💡 Additional Recommendations:\n';
        
        for (let i = 5; i < analysisResults.length; i++) {
          formattedResults += `   ${i + 1}. ${analysisResults[i]}\n`;
        }
        
        await ctx.reply(
          '✨ Analysis Complete! Here are your personalized keyword recommendations:\n\n' +
          formattedResults + '\n\n' +
          '💪 These keywords are tailored to your business profile and target audience. ' +
          'Consider incorporating them into your marketing strategy for better visibility and engagement.'
        );
      }
    }
  },

);

BusinessAnalysisScene.command('cancel', async (ctx) => {
  await ctx.reply('❌ Operation cancelled. You can start over anytime by using the /start command.');
  return ctx.scene.leave();
});

export type { BusinessWizardSession };
