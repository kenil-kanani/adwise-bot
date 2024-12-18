import { Telegraf } from 'telegraf';
import { BOT_TOKEN } from './config/serverConfig';

const bot = new Telegraf(BOT_TOKEN!);

bot.start((ctx) => {
  ctx.reply('Welcome! I’m here to assist you. Type /help to see what I can do.');
});

bot.help((ctx) => {
  ctx.reply('Here are the commands you can use:\n/start - Start the bot\n/help - Show this help message');
});

bot.on('text', (ctx) => {
  const userMessage = ctx.message.text;
  ctx.reply(`Hi : "${userMessage}"`);
});

bot.launch().then(() => {
  console.log('Bot is running...');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
