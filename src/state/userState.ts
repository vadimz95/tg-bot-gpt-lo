export type UserStep =
  | 'idle'
  | 'awaiting_caption'
  | 'awaiting_photos';

export interface UserState {
  step: UserStep;
  caption?: string;
  photos?: string[];
}

const users = new Map<number, UserState>();

export function getUserState(userId: number): UserState {
  if (!users.has(userId)) {
    users.set(userId, { step: 'idle', photos: [] });
  }
  return users.get(userId)!;
}

export function setUserState(userId: number, patch: Partial<UserState>) {
  const current = getUserState(userId);
  users.set(userId, { ...current, ...patch });
}

export function resetUserState(userId: number) {
  users.set(userId, { step: 'idle', photos: [] });
}
