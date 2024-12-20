"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FAQMarketingScene = void 0;
const telegraf_1 = require("telegraf");
const generateFAQResponse_1 = require("../utils/generateFAQResponse");
exports.FAQMarketingScene = new telegraf_1.Scenes.WizardScene('marketing-faq', async (ctx) => {
    ctx.wizard.state.faqData = {
        context: []
    };
    await ctx.reply('👋 Welcome to the Marketing FAQ Assistant!\nI\'m here to help answer your marketing-related questions.\n\nWhat would you like to know?\n\nType "/cancel" to end the conversation.');
    ctx.wizard.next();
}, 
// Step 1
async (ctx) => {
    if (!ctx.message || !('text' in ctx.message)) {
        await ctx.reply('Please send a text message with your question.');
        return;
    }
    const userInput = ctx.message.text;
    if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === '/cancel') {
        await ctx.reply('Thank you for using Marketing FAQ Assistant! Goodbye 👋');
        return ctx.scene.leave();
    }
    const answer = await (0, generateFAQResponse_1.generateFAQResponse)(ctx.wizard.state.faqData, userInput);
    if (!ctx.wizard.state.faqData.context) {
        ctx.wizard.state.faqData.context = [{
                question: '',
                answer: '',
            }];
    }
    ctx.wizard.state.faqData.context.push({
        question: userInput,
        answer: answer,
    });
    await ctx.reply(answer);
    // await ctx.reply('Do you have any more questions? Ask away! Or type "exit" to end the conversation.');
    if (answer.toLowerCase().includes('exit')) {
        return ctx.scene.leave();
    }
    return ctx.wizard.selectStep(1);
});
exports.FAQMarketingScene.command('cancel', async (ctx) => {
    await ctx.reply('Operation cancelled');
    return ctx.scene.leave();
});
