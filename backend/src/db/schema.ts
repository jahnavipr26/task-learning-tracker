import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';

export const priorityEnum = pgEnum('priority', ['LOW', 'MEDIUM', 'HIGH']);
export const statusEnum = pgEnum('task_status', ['PENDING', 'IN_PROGRESS', 'COMPLETED']);

export const users = pgTable('users', {
  id:           uuid('id').primaryKey().defaultRandom(),
  email:        varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name:         varchar('name', { length: 100 }),
  createdAt:    timestamp('created_at').defaultNow().notNull(),
  updatedAt:    timestamp('updated_at').defaultNow().notNull(),
});

export const tasks = pgTable('tasks', {
  id:          uuid('id').primaryKey().defaultRandom(),
  userId:      uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title:       varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  priority:    priorityEnum('priority').default('MEDIUM').notNull(),
  status:      statusEnum('status').default('PENDING').notNull(),
  dueDate:     timestamp('due_date'),
  completedAt: timestamp('completed_at'),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
  updatedAt:   timestamp('updated_at').defaultNow().notNull(),
});

export const learningTopics = pgTable('learning_topics', {
  id:          uuid('id').primaryKey().defaultRandom(),
  userId:      uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title:       varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  progress:    integer('progress').default(0).notNull(),
  notes:       text('notes'),
  completed:   boolean('completed').default(false).notNull(),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
  updatedAt:   timestamp('updated_at').defaultNow().notNull(),
});

export const activityLogs = pgTable('activity_logs', {
  id:         uuid('id').primaryKey().defaultRandom(),
  userId:     uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  action:     text('action').notNull(),
  entityType: varchar('entity_type', { length: 50 }),
  entityId:   uuid('entity_id'),
  createdAt:  timestamp('created_at').defaultNow().notNull(),
});