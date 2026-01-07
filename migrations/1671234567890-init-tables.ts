import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder) {
  // Таблиця користувачів
  pgm.createTable('users', {
    id: { type: 'bigint', primaryKey: true },
    username: { type: 'text' },
    first_name: { type: 'text' },
    last_name: { type: 'text' },
  });

  // Таблиця фото
  pgm.createTable('photos', {
    id: { type: 'serial', primaryKey: true },
    user_id: { type: 'bigint', notNull: true, references: 'users(id)' },
    caption: { type: 'text' },
    photo_path: { type: 'text', notNull: true },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') },
    media_group_id: { type: 'text' },
  });
}

export async function down(pgm: MigrationBuilder) {
  pgm.dropTable('photos');
  pgm.dropTable('users');
}
