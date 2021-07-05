import * as dotenv from "dotenv";
import TelegramBot, * as telegramBot from "node-telegram-bot-api";

dotenv.config();
const botToken: string = process.env.BOT_TOKEN ? process.env.BOT_TOKEN : "";
const channelId: string = process.env.CHANNEL_ID ? process.env.CHANNEL_ID : "";

const bot = new TelegramBot(botToken, { polling: true });

function sendBotMessage(
  workerNumber: string,
  temperature: string,
  isSucceed: boolean
) {
  const message: string = `${workerNumber} ${temperature} ${
    isSucceed ? "✅" : "❌"
  }`;
  bot.sendMessage(channelId, message, { parse_mode: "Markdown" });
}

export { sendBotMessage };
