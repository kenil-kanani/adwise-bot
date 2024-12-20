"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrendAnalysisScene = void 0;
const telegraf_1 = require("telegraf");
const fetchIndustryBenchmarks_1 = require("../utils/fetchIndustryBenchmarks");
const scrapeWebContent_1 = require("../utils/scrapeWebContent");
exports.TrendAnalysisScene = new telegraf_1.Scenes.WizardScene('trend-analysis', async (ctx) => {
    await ctx.reply('Fetching industry benchmarks...');
    const data = await (0, scrapeWebContent_1.scrapeWebContent)();
    const benchmarks = await (0, fetchIndustryBenchmarks_1.fetchIndustryBenchmarks)(data);
    const transformedData = await (0, fetchIndustryBenchmarks_1.transformData)(data);
    await ctx.reply(transformedData);
    await ctx.reply(benchmarks);
    return ctx.wizard.next();
});
