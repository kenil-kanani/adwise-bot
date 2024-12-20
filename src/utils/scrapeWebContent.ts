import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

async function scrapeWebContent(): Promise<string> {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Set viewport and user agent for better compatibility
        await page.setViewport({ width: 1920, height: 1080 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        await page.goto('https://databox.com/ppc-industry-benchmarks', { 
            waitUntil: 'networkidle0',
            timeout: 30000 
        });

        const scrollPage = async () => {
            await page.evaluate(() => {
                window.scrollBy(0, window.innerHeight);
            });
            await new Promise(resolve => setTimeout(resolve, 100));
        };

        for (let i = 0; i < 5; i++) {
            await scrollPage();
        }

        const content = await page.content();

        await browser.close();

        const $ = cheerio.load(content);
        // select only table data first 5 tables
        const tableData = $('table').slice(0, 5).text();
        console.log("tableData : ", tableData);
        return tableData;

    } catch (error) {
        console.error('Error scraping web content:', error);
        throw new Error('Failed to scrape web content');
    }
}

export { scrapeWebContent }; 