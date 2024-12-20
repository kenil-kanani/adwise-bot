"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const serverConfig_1 = require("./config/serverConfig");
const businessAnalysis_1 = require("./scenes/businessAnalysis");
const marketingFAQ_1 = require("./scenes/marketingFAQ");
const trendAnalysis_1 = require("./scenes/trendAnalysis");
const bot = new telegraf_1.Telegraf(serverConfig_1.BOT_TOKEN);
const stage = new telegraf_1.Scenes.Stage([
    businessAnalysis_1.BusinessAnalysisScene,
    marketingFAQ_1.FAQMarketingScene,
    trendAnalysis_1.TrendAnalysisScene,
]);
bot.use((0, telegraf_1.session)());
bot.use(stage.middleware());
bot.command('start', (ctx) => {
    ctx.reply('🤖 Welcome to the Digital Marketing Assistant!\n\n' +
        'I can help you optimize your digital marketing strategy. Here are the available commands:\n\n' +
        '📊 /analyze - Get personalized business analysis and keyword recommendations\n' +
        '📈 /trends - Explore industry trends and benchmark data\n' +
        '❓ /faq - Get answers to common digital marketing questions\n\n' +
        'Choose any command to get started!');
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
