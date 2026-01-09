import TelegramBot from 'node-telegram-bot-api';
import { setUserState } from '../state/userState';
import { mainMenu } from './menu';

export function setupMenuHandlers(bot: TelegramBot) {
  bot.on('message', (msg) => {
    if (!msg.text || !msg.from) return;

    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if (msg.text === '➕ Додати нову позицію') {
      setUserState(userId, { step: 'awaiting_caption' });

      bot.sendMessage(chatId, '📝 Введи опис позиції');
    }

    if (msg.text === '🔍 Пошук') {
      bot.sendMessage(chatId, '🚧 Пошук поки що не реалізований', {
        reply_markup: mainMenu,
      });
    }
  });
}
