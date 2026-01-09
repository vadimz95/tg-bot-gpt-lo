import TelegramBot from 'node-telegram-bot-api';
import {
  getUserState,
  setUserState,
  resetUserState,
} from '../state/userState';
import { photoFlowKeyboard, mainMenu } from './menu';
import { saveToExcel } from './excelHandler';

export function setupPhotoHandler(bot: TelegramBot) {
  // 📝 Отримали опис
  bot.on('message', async (msg) => {
    if (!msg.text || !msg.from) return;

    const userId = msg.from.id;
    const chatId = msg.chat.id;
    const state = getUserState(userId);

    if (msg.text === '✅ Завершити') {
      if (!state.caption || !state.photos?.length) {
        bot.sendMessage(chatId, '⚠️ Немає даних для збереження');
        return;
      }

      saveToExcel(state.caption, state.photos);

      resetUserState(userId);

      bot.sendMessage(chatId, '✅ Позицію збережено', {
        reply_markup: mainMenu,
      });

      return;
    }

    if (state.step !== 'awaiting_caption') return;

    setUserState(userId, {
      step: 'awaiting_photos',
      caption: msg.text,
      photos: [],
    });

    bot.sendMessage(chatId, '📸 Надішли фото позиції', {
      reply_markup: photoFlowKeyboard,
    });
  });

  // 📸 Отримали фото
  bot.on('photo', async (msg) => {
    if (!msg.from) return;

    const userId = msg.from.id;
    const chatId = msg.chat.id;
    const state = getUserState(userId);

    if (state.step !== 'awaiting_photos') return;

    const photo = msg.photo?.at(-1);
    if (!photo) return;

    const file = await bot.getFile(photo.file_id);

    setUserState(userId, {
      photos: [...(state.photos ?? []), file.file_id],
    });

    bot.sendMessage(chatId, '📸 Фото додано', {
      reply_markup: photoFlowKeyboard,
    });
  });
}
