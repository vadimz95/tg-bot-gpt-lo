import TelegramBot from 'node-telegram-bot-api';
import { resetUserState } from '../state/userState';
import { mainMenu } from './menu';

export function setupCancelHandler(bot: TelegramBot) {
  bot.on('message', (msg) => {
    if (msg.text !== '❌ Скасувати') return;
    if (!msg.from) return;

    resetUserState(msg.from.id);

    bot.sendMessage(msg.chat.id, '🚫 Дію скасовано', {
      reply_markup: mainMenu,
    });
  });
}
