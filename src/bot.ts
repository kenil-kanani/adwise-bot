import { Telegraf, Scenes, session } from 'telegraf';
import { BOT_TOKEN } from './config/serverConfig';
import { BusinessAnalysisScene, BusinessWizardSession } from './scenes/businessAnalysis';
import { FAQMarketingScene, FAQWizardSession } from './scenes/marketingFAQ';
import { TrendAnalysisScene, TrendWizardSession } from './scenes/trendAnalysis';

export interface SessionData extends BusinessWizardSession, FAQWizardSession, TrendWizardSession {}

type MyContext = Scenes.WizardContext<SessionData>

const bot = new Telegraf<MyContext>(BOT_TOKEN!);
const stage = new Scenes.Stage<MyContext>([
  BusinessAnalysisScene,
  FAQMarketingScene,
  TrendAnalysisScene,
]);

bot.use(session());
bot.use(stage.middleware());

bot.command('start', (ctx) => {
  ctx.reply(
    'Welcome to the Digital Marketing Assistant! Choose an option:\n\n' +
    '1. /analyze - Analyze your business and get keyword suggestions\n' +
    '2. /trends - Get industry benchmark data\n' +
    '3. /faq - Ask questions about digital marketing'
  );
});

bot.command('analyze', (ctx) => {
  ctx.scene.enter('business-analysis');
});

bot.command('trends', (ctx) => {
  ctx.scene.enter('trend-analysis');
});

bot.command('faq', (ctx) => {
  ctx.scene.enter('marketing-faq');
});

// Launch bot
bot.launch().then(() => {
  console.log('Bot is running...');
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
