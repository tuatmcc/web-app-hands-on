import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable("posts", {
	// Primary Key
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),

	name: text("name"),
	content: text("content"),
	parent_id: text("parent_id").references(() => posts.id),
	likes: integer("likes").default(0),

	createdAt: integer("created_at", {
		mode: "timestamp_ms",
	}).$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", {
		mode: "timestamp_ms",
	}).$defaultFn(() => new Date()),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
	replies: many(posts),
	parent: one(posts, {
		fields: [posts.parent_id],
		references: [posts.id],
	}),
}));
