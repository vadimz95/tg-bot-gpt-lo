import TelegramBot from 'node-telegram-bot-api';

type MediaItem = {
  msg: TelegramBot.Message;
  timeout: NodeJS.Timeout;
};

const groups = new Map<string, TelegramBot.Message[]>();

export function collectMedia(
  msg: TelegramBot.Message,
  onComplete: (messages: TelegramBot.Message[]) => void,
  delay = 700
) {
  const groupId = msg.media_group_id;

  if (!groupId) {
    onComplete([msg]);
    return;
  }

  if (!groups.has(groupId)) {
    groups.set(groupId, []);
  }

  groups.get(groupId)!.push(msg);

  if ((groups.get(groupId) as any).timeout) {
    clearTimeout((groups.get(groupId) as any).timeout);
  }

  (groups.get(groupId) as any).timeout = setTimeout(() => {
    const messages = groups.get(groupId)!;
    groups.delete(groupId);
    onComplete(messages);
  }, delay);
}
