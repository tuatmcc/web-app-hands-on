import { DurableObject } from "cloudflare:workers";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono, z } from "@hono/zod-openapi";
import type * as apiSchema from "@mcc/schema/api";
import * as schema from "@mcc/schema/database";
import { and, desc, eq, isNull, lt, sql } from "drizzle-orm";
import type { DrizzleSqliteDODatabase } from "drizzle-orm/durable-sqlite";
import { drizzle } from "drizzle-orm/durable-sqlite";
import { migrate } from "drizzle-orm/durable-sqlite/migrator";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import migrations from "../drizzle/migrations";
import * as routes from "./routes";

// 一つのDurableObjectのみを使うので、IDは固定
const USECASE_ID = "DUMMY";

// 返信の数を取得するSQL
const replySql =
	sql<number>`(select count(*) from "posts" as "children" where "children"."parent_id" = "posts"."id")`.as(
		"replies",
	);

const app = new OpenAPIHono<{ Bindings: Env }>({
	defaultHook: (result, c) => {
		if (!result.success) {
			return c.json({ message: z.prettifyError(result.error) }, 400);
		}

		return;
	},
});

app.use("*", cors());

app.use("*", async (_, next) => {
	await new Promise((resolve) => setTimeout(resolve, 1000));

	await next();
});

app.openapi(routes.helloWorldRoute, (c) => {
	const { name } = c.req.valid("query");
	return c.text(`Hello, ${name ?? "World"}!`);
});

app.openapi(routes.createPostRoute, async (c) => {
	const body = c.req.valid("json");

	const id = c.env.USECASE.idFromName(USECASE_ID);
	const stub = c.env.USECASE.get(id);

	const result = await stub.createPost({ body });
	return c.json(result, 200);
});

app.openapi(routes.likePostRoute, async (c) => {
	const params = c.req.valid("param");

	const id = c.env.USECASE.idFromName(USECASE_ID);
	const stub = c.env.USECASE.get(id);

	const result = await stub.likePost({ params });
	return c.json(result, 200);
});

app.openapi(routes.createReplyRoute, async (c) => {
	const params = c.req.valid("param");
	const body = c.req.valid("json");

	const id = c.env.USECASE.idFromName(USECASE_ID);
	const stub = c.env.USECASE.get(id);

	const result = await stub.createReply({ params, body });
	return c.json(result, 200);
});

app.openapi(routes.listPostsRoute, async (c) => {
	const query = c.req.valid("query");

	const id = c.env.USECASE.idFromName(USECASE_ID);
	const stub = c.env.USECASE.get(id);

	const result = await stub.listPosts({ query });
	return c.json(result, 200);
});

app.openapi(routes.getPostRoute, async (c) => {
	const params = c.req.valid("param");

	const id = c.env.USECASE.idFromName(USECASE_ID);
	const stub = c.env.USECASE.get(id);

	const result = await stub.getPost({ params });
	return c.json(result, 200);
});

app.doc("/openapi", {
	openapi: "3.0.0",
	info: {
		title: "MCC API",
		version: "1.0.0",
	},
	servers: [
		{
			url: "http://localhost:8787",
			description: "Local server",
		},
	],
});

app.get("/docs", swaggerUI({ url: "/openapi" }));

export class UseCase extends DurableObject {
	storage: DurableObjectStorage;
	db: DrizzleSqliteDODatabase<typeof schema>;

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		this.storage = ctx.storage;
		this.db = drizzle(this.storage, { schema });

		ctx.blockConcurrencyWhile(async () => {
			await this._migrate();
		});
	}

	async _migrate() {
		await migrate(this.db, migrations);
	}

	async createPost({
		body,
	}: {
		body: apiSchema.CreatePostBody;
	}): Promise<apiSchema.CreatePostResponse> {
		return this.db.transaction(async (tx) => {
			const postResults = await tx
				.insert(schema.posts)
				.values({
					name: body.name,
					content: body.content,
				})
				.returning();
			const postResult = postResults[0];
			if (!postResult) {
				tx.rollback();
				throw new HTTPException(500, { message: "投稿の作成に失敗しました" });
			}

			return {
				id: postResult.id,
				name: postResult.name,
				content: postResult.content,
				likes: 0,
				replies: 0,
				createdAt: postResult.createdAt,
			};
		});
	}

	async likePost({
		params,
	}: {
		params: apiSchema.LikePostParams;
	}): Promise<apiSchema.LikePostResponse> {
		return this.db.transaction(async (tx) => {
			const postResult = await tx.query.posts.findFirst({
				where: eq(schema.posts.id, params.id),
				extras: {
					replies:
						sql`(select count(*) from "posts" as "children" where "children"."parent_id" = "posts"."id")`.as(
							"replies",
						),
				},
			});
			if (!postResult) {
				tx.rollback();
				throw new HTTPException(404, { message: "投稿が存在しません" });
			}

			const updatedPostResults = await tx
				.update(schema.posts)
				.set({ likes: postResult.likes + 1 })
				.where(eq(schema.posts.id, params.id))
				.returning();
			const updatedPost = updatedPostResults[0];
			if (!updatedPost) {
				tx.rollback();
				throw new HTTPException(500, { message: "投稿のいいねに失敗しました" });
			}

			return {
				id: updatedPost.id,
				name: updatedPost.name,
				content: updatedPost.content,
				likes: updatedPost.likes,
				replies: postResult.replies as number,
				createdAt: updatedPost.createdAt,
			};
		});
	}

	async createReply({
		params,
		body,
	}: {
		params: apiSchema.CreateReplyParams;
		body: apiSchema.CreateReplyBody;
	}): Promise<apiSchema.CreateReplyResponse> {
		return this.db.transaction(async (tx) => {
			const postResult = await tx.query.posts.findFirst({
				where: eq(schema.posts.id, params.id),
			});
			if (!postResult) {
				tx.rollback();
				throw new HTTPException(404, { message: "投稿が存在しません" });
			}

			const replyResults = await tx
				.insert(schema.posts)
				.values({
					name: body.name,
					content: body.content,
					parentId: params.id,
				})
				.returning();
			const replyResult = replyResults[0];
			if (!replyResult) {
				tx.rollback();
				throw new HTTPException(500, { message: "返信の作成に失敗しました" });
			}

			return {
				id: replyResult.id,
				name: replyResult.name,
				content: replyResult.content,
				likes: 0,
				replies: 0,
				createdAt: replyResult.createdAt,
			};
		});
	}

	async listPosts({
		query,
	}: {
		query: apiSchema.ListPostsQuery;
	}): Promise<apiSchema.ListPostsResponse> {
		return this.db.transaction(async (tx) => {
			const result = await tx.query.posts.findMany({
				limit: query.limit,
				orderBy: desc(schema.posts.id),
				where: query.before
					? and(
							isNull(schema.posts.parentId),
							lt(schema.posts.id, query.before),
						)
					: isNull(schema.posts.parentId),
				extras: {
					replies: replySql,
				},
			});

			return {
				posts: result.map((post) => ({
					id: post.id,
					name: post.name,
					content: post.content,
					likes: post.likes,
					replies: post.replies,
					createdAt: post.createdAt,
				})),
			};
		});
	}

	async getPost({
		params,
	}: {
		params: apiSchema.GetPostParams;
	}): Promise<apiSchema.GetPostResponse> {
		return this.db.transaction(async (tx) => {
			const postResult = await tx.query.posts.findFirst({
				where: eq(schema.posts.id, params.id),
				extras: {
					replies: replySql,
				},
			});
			if (!postResult) {
				tx.rollback();
				throw new HTTPException(404, { message: "投稿が存在しません" });
			}

			const replyResults = await tx.query.posts.findMany({
				where: eq(schema.posts.parentId, params.id),
				orderBy: desc(schema.posts.id),
				extras: {
					replies: replySql,
				},
			});

			const post: apiSchema.Post = {
				id: postResult.id,
				name: postResult.name,
				content: postResult.content,
				likes: postResult.likes,
				replies: postResult.replies,
				createdAt: postResult.createdAt,
			};

			const replies: apiSchema.Post[] = replyResults.map((reply) => ({
				id: reply.id,
				name: reply.name,
				content: reply.content,
				likes: reply.likes,
				replies: reply.replies,
				createdAt: reply.createdAt,
			}));

			return {
				post,
				replies,
			};
		});
	}
}

export default app;
