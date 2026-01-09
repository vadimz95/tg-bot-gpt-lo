import TelegramBot from 'node-telegram-bot-api';
import { config } from './config';
import { setupGlobalErrorHandler } from './utils/globalErrorHandler';
import { enqueueExcelWrite } from './storage/excelQueue';
import { savePhotosToFolder } from './storage/photos';
import { saveInfo } from './storage/info';
import { formatDate, sanitizeFolderName } from './utils/format';
import { collectMedia } from './utils/mediaGroup';
import { safeDeleteMessages } from './utils/deleteMessages';

const bot = new TelegramBot(config.telegramToken, { polling: true });
console.log('🤖 Bot polling started');
// Налаштовуємо глобальний лог
setupGlobalErrorHandler(bot);

bot.onText(/\/start/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    '👋 Бот запущений.\nНадішли фото для збереження.'
  );
});

// Розбір фото
bot.on('photo', (msg) => {
  collectMedia(msg, async (messages) => {
    try {
      const caption = messages[0].caption ?? 'Без назви';
      const dateStr = formatDate();
      const safeTitle = sanitizeFolderName(caption);

      const folderName = `${safeTitle}_${dateStr}`;
      const targetDir = `${config.dataDir}/${folderName}`;

      const fileUrls: string[] = [];

      for (const m of messages) {
        const photo = m.photo![m.photo!.length - 1];
        const file = await bot.getFile(photo.file_id);
        fileUrls.push(
          `https://api.telegram.org/file/bot${config.telegramToken}/${file.file_path}`
        );
      }

      const photoPaths = await savePhotosToFolder(fileUrls, targetDir);

      saveInfo(targetDir, {
        caption,
        date: dateStr,
        photos: photoPaths,
        mediaGroupId: msg.media_group_id ?? null,
      });

      // Запис в Excel через чергу
      await enqueueExcelWrite({
        date: dateStr,
        user:
          msg.from?.username ??
          `${msg.from?.first_name ?? ''} ${msg.from?.last_name ?? ''}`.trim() ??
          String(msg.from?.id),
        caption,
      });

      // Видаляємо повідомлення користувача
      const messageIds = messages.map((m) => m.message_id);
      await safeDeleteMessages(bot, msg.chat.id, messageIds);

      // Підтвердження з авто-видалення
      const confirmation = await bot.sendMessage(
        msg.chat.id,
        `✅ Збережено ${photoPaths.length} фото`
      );
      setTimeout(() => {
        bot.deleteMessage(msg.chat.id, confirmation.message_id).catch(() => {});
      }, 5000);
    } catch (err) {
      // Глобальний лог вже налаштований, але тут додатково можна контекст
      import('./utils/errorHandler').then(({ logError }) =>
        logError(err, 'photo_handler')
      );
      bot.sendMessage(msg.chat.id, '❌ Помилка при збереженні фото');
    }
  });
});
