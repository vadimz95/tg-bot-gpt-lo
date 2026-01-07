import { enqueueQuery } from './dbQueue';

export async function saveUser(id: number, username?: string, first_name?: string, last_name?: string) {
  const sql = `
    INSERT INTO users(id, username, first_name, last_name)
    VALUES($1,$2,$3,$4)
    ON CONFLICT (id) DO UPDATE
      SET username = EXCLUDED.username,
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name
  `;
  await enqueueQuery(sql, [id, username, first_name, last_name]);
}

export async function savePhoto(userId: number, caption: string, photoPath: string, mediaGroupId?: string) {
  const sql = `
    INSERT INTO photos(user_id, caption, photo_path, media_group_id)
    VALUES($1,$2,$3,$4)
  `;
  await enqueueQuery(sql, [userId, caption, photoPath, mediaGroupId ?? null]);
}
