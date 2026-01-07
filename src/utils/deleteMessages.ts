import TelegramBot from 'node-telegram-bot-api';

export async function safeDeleteMessages(
  bot: TelegramBot,
  chatId: number,
  messageIds: number[]
) {
  for (const id of messageIds) {
    try {
      await bot.deleteMessage(chatId, id);
    } catch {
      // ігноруємо помилки (нема прав / вже видалено)
    }
  }
}
