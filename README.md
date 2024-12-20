# AdWise Bot - Digital Marketing Assistant

A Telegram bot powered by AI that helps businesses optimize their digital marketing strategies through personalized analysis, keyword recommendations, and industry insights.

## 🌟 Features
- **Business Analysis**: Get personalized keyword recommendations based on your business profile.
- **Industry Trends**: Access real-time PPC benchmarks and industry trends.
- **Marketing FAQ**: Get expert answers to digital marketing questions.
- **AI-Powered**: Utilizes both Gemini and OpenAI models for intelligent responses.
- **Web Scraping**: Automated data collection for industry benchmarks.

## 🛠️ Tech Stack
- **TypeScript**
- **Node.js**
- **Telegraf** (Telegram Bot Framework)
- **LangChain**
- **Google Gemini AI**
- **OpenAI GPT**
- **Puppeteer**
- **Cheerio**

## 📋 Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Telegram Bot Token**
- **OpenAI API Key**
- **Google Gemini API Key**

## 🚀 Getting Started

1. **Clone the repository**  
   ```bash
   git clone https://github.com/yourusername/adwise-bot.git
   cd adwise-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Create a `.env` file in the root directory with the following variables:
   ```
   BOT_TOKEN=your_telegram_bot_token
   OPENAI_API_KEY=your_openai_api_key 
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start the bot**
   ```bash
   npm start
   ```

   For development with hot-reload:
   ```bash
   npm run watch
   ```

## 🤖 Bot Commands

- `/start` - Initialize the bot and see available commands
- `/analyze` - Start business analysis wizard
- `/trends` - View industry trends and benchmarks
- `/faq` - Ask marketing-related questions
- `/cancel` - Exit current operation

## 📁 Project Structure
- `src/`: Contains the source code for the bot.
- `dist/`: Contains the compiled TypeScript code.
- `node_modules/`: Contains the dependencies.
- `package.json`: Contains the project dependencies and scripts.
- `tsconfig.json`: Contains the TypeScript configuration.
- `.env.sample`: Contains the environment variables.
- `.gitignore`: Contains the files and directories to be ignored by Git.