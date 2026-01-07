import TelegramBot from 'node-telegram-bot-api';
import { config } from './config';
import { setupGlobalErrorHandler } from './utils/globalErrorHandler';
import { saveUser, savePhoto } from './storage/savePhoto';
import { collectMedia } from './utils/mediaGroup';
import { savePhotosToFolder } from './storage/photos';
import { safeDeleteMessages } from './utils/deleteMessages';
import { formatDate, sanitizeFolderName } from './utils/format';
import { waitForDb } from './db';


// Глобальний лог

(async () => {
    try {
        await waitForDb();
        const bot = new TelegramBot(config.telegramToken, { polling: true });
        setupGlobalErrorHandler(bot);

        bot.on('photo', (msg) => {
            collectMedia(msg, async (messages) => {
                try{
                const user = msg.from!;
                await saveUser(user.id, user.username, user.first_name, user.last_name);

                const caption = messages[0].caption ?? 'Без назви';
                const dateStr = formatDate();
                const safeTitle = sanitizeFolderName(caption);
                const folderName = `${safeTitle}_${dateStr}`;
                const targetDir = `${config.dataDir}/${folderName}`;

                const filePaths: string[] = [];
                for (const m of messages) {
                    const photo = m.photo![m.photo!.length - 1];
                    const file = await bot.getFile(photo.file_id);
                    const paths = await savePhotosToFolder(
                    [`https://api.telegram.org/file/bot${config.telegramToken}/${file.file_path}`],
                    targetDir
                    );
                    filePaths.push(...paths);

                    // Зберігаємо фото в БД
                    await savePhoto(user.id, caption, paths[0], msg.media_group_id);
                }

                const messageIds = messages.map((m) => m.message_id);
                await safeDeleteMessages(bot, msg.chat.id, messageIds);

                const confirmation = await bot.sendMessage(msg.chat.id, `✅ Збережено ${filePaths.length} фото`);
                setTimeout(() => {
                    bot.deleteMessage(msg.chat.id, confirmation.message_id).catch(() => {});
                }, 5000);
                } catch (err) {
                import('./utils/errorHandler').then(({ logError }) =>
                    logError(err, 'photo_handler')
                );
                bot.sendMessage(msg.chat.id, '❌ Помилка при збереженні фото');
                }
            });
        });
    } catch (err) {
        console.error('❌ Bot failed to start:', err);
    }
})();
