import { pgTable, uuid, varchar, text, timestamp, decimal, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 50 }).default('member'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  emailIdx: index('idx_users_email').on(table.email),
}));

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  createdBy: uuid('created_by').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  createdByIdx: index('idx_projects_created_by').on(table.createdBy),
}));

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).default('todo'),
  priority: varchar('priority', { length: 50 }).default('medium'),
  estimatedHours: decimal('estimated_hours', { precision: 10, scale: 2 }),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  createdBy: uuid('created_by').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  projectIdIdx: index('idx_tasks_project_id').on(table.projectId),
  createdByIdx: index('idx_tasks_created_by').on(table.createdBy),
}));
