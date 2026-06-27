import { pgTable, uuid, text, numeric, boolean, timestamp } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
});

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'restrict' }),
  price: numeric('price').notNull().default('0'),
  description: text('description'),
  image: text('image').array().default([]),
  video: text('video').array().default([]),
  shopeeUrl: text('shopee_url'),
  isActive: boolean('is_active').default(true),
});
