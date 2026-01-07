import { logError } from './errorHandler';
import TelegramBot from 'node-telegram-bot-api';

export function setupGlobalErrorHandler(bot: TelegramBot) {
  // uncaughtException – необроблені синхронні помилки
  process.on('uncaughtException', (err) => {
    logError(err, 'uncaughtException');
    console.error('uncaughtException', err);
  });

  // unhandledRejection – необроблені проміси
  process.on('unhandledRejection', (reason) => {
    logError(reason, 'unhandledRejection');
    console.error('unhandledRejection', reason);
  });

  // Telegram polling_error
  bot.on('polling_error', (err) => {
    logError(err, 'polling_error');
    console.error('polling_error', err);
  });
}
