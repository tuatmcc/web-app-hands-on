import dayjs from "dayjs";
import { relations } from "drizzle-orm";
import {
	foreignKey,
	integer,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";
import { ulid } from "ulid";

export const posts = sqliteTable(
	"posts",
	{
		// Primary Key
		id: text("id")
			.primaryKey()
			.$defaultFn(() => ulid()),

		name: text("name"),
		content: text("content").notNull(),
		parentId: text("parent_id"),
		likes: integer("likes").notNull().default(0),

		createdAt: integer("created_at")
			.notNull()
			.$defaultFn(() => dayjs().valueOf()),
		updatedAt: integer("updated_at")
			.notNull()
			.$defaultFn(() => dayjs().valueOf()),
	},
	(table) => [
		foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
		}),
	],
);

export const postsRelations = relations(posts, ({ one, many }) => ({
	replies: many(posts),
	parent: one(posts, {
		fields: [posts.parentId],
		references: [posts.id],
	}),
}));
