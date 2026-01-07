import TelegramBot from 'node-telegram-bot-api';
import path from 'node:path';
import { config } from './config';
import { appendRow } from './storage/excel';
import { savePhotosToFolder } from './storage/photos';
import { saveInfo } from './storage/info';
import { formatDate, sanitizeFolderName } from './utils/format';
import { collectMedia } from './utils/mediaGroup';
import { enqueueExcelWrite } from './storage/excelQueue';
import { logError } from './utils/errorHandler';

const bot = new TelegramBot(config.telegramToken, {
     polling: true
    });

bot.on('photo', (msg) => {
  collectMedia(msg, async (messages) => {
    try {
        const caption = messages[0].caption ?? 'Без назви';
        const dateStr = formatDate();
        const safeTitle = sanitizeFolderName(caption);

        const folderName = `${safeTitle}_${dateStr}`;
        const targetDir = path.join(config.dataDir, folderName);

        const fileUrls: string[] = [];
        const messageIds = messages.map(m => m.message_id);
        
      for (const m of messages) {
        const photo = m.photo![m.photo!.length - 1];
        const file = await bot.getFile(photo.file_id);

        fileUrls.push(
          `https://api.telegram.org/file/bot${config.telegramToken}/${file.file_path}`
        );
      }

    function resolveUser(msg: TelegramBot.Message): string {
        const from = msg.from;
        if (!from) return 'Unknown';

        if (from.username) return from.username;
        if (from.first_name || from.last_name)
            return `${from.first_name ?? ''} ${from.last_name ?? ''}`.trim();

        return String(from.id);
    }


    const photoPaths = await savePhotosToFolder(fileUrls, targetDir);
    const user = resolveUser(messages[0]);

      saveInfo(targetDir, {
        caption,
        date: dateStr,
        photos: photoPaths,
        mediaGroupId: msg.media_group_id ?? null,
      });


    await enqueueExcelWrite({
        date: dateStr,
        user,
        caption,
    });
    

      bot.sendMessage(msg.chat.id, `✅ Збережено ${photoPaths.length} фото`);
    } catch (e) {
      console.error(e);
      bot.sendMessage(msg.chat.id, '❌ Помилка при збереженні');
    }
  });
});


bot.on('polling_error', (err) => {
  console.error('[polling_error]', err);
  // можна перезапустити polling вручну:
  if (err.code === 'EFATAL') {
    setTimeout(() => {
      bot.stopPolling();
      bot.startPolling();
    }, 5000);
  }
});

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