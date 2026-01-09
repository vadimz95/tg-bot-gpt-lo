import TelegramBot, { InlineKeyboardButton } from 'node-telegram-bot-api';

export const confirmCaptionKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: '✅ Підтвердити', callback_data: 'confirm_caption' },
        { text: '❌ Скасувати', callback_data: 'cancel_caption' }
      ]
    ]
  }
};