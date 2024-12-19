import { Scenes } from 'telegraf';
import { SessionData } from '../bot';

interface FAQData {
  recentQuestions?: {
    question: string;
    answer: string;
    timestamp: Date;
  }[];
  context?: {
    industry?: string;
    previousInteractions?: string[];
  };
}

interface FAQWizardSession extends Scenes.WizardSessionData {
    faqData: FAQData;
}

interface FAQWizardContext extends Scenes.WizardContext<SessionData> {
    wizard: Scenes.WizardContextWizard<FAQWizardContext> & {
        state: {
            faqData?: FAQData;
        };
    };
}

export const FAQMarketingScene = new Scenes.WizardScene<FAQWizardContext>(
    'marketing-faq',
    async (ctx) => {
        await ctx.reply('What is your question?');
        ctx.wizard.next();
    }
);

FAQMarketingScene.command('cancel', async (ctx) => {
    await ctx.reply('Operation cancelled');
    return ctx.scene.leave();
});

export type { FAQWizardContext, FAQWizardSession };