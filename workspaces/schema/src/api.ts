import { z } from "@hono/zod-openapi";

export const helloWorldQuery = z.object({
	name: z.string().optional().openapi({
		description: "挨拶する名前",
		example: "shun",
	}),
});
export const helloWorldResponse = z.string().openapi({
	description: "挨拶の返答",
	example: "Hello, shun!",
});

export const post = z.object({
	id: z.ulid().openapi({
		description: "投稿のID",
		example: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
	}),
	name: z.string().optional().openapi({
		description: "投稿者の名前",
		example: "しゅん",
	}),
	content: z.string().openapi({
		description: "投稿の内容",
		example: "こんにちは",
	}),
	likes: z.number().openapi({
		description: "いいねの数",
		example: 10,
	}),
	replies: z.number().openapi({
		description: "返信の数",
		example: 3,
	}),
	createdAt: z.number().openapi({
		description: "投稿日時(Unixエポックミリ秒)",
		example: 1753523241148,
	}),
});

export const createPostBody = z.object({
	name: z.string().optional().openapi({
		description: "投稿者の名前",
		example: "しゅん",
	}),
	content: z.string().openapi({
		description: "投稿の内容",
		example: "こんにちは",
	}),
	parentId: z.ulid().optional().openapi({
		description: "親投稿のID(返信の場合)",
		example: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
	}),
});
export const createPostResponse = post;

export const likePostParams = z.object({
	id: z.ulid().openapi({
		description: "投稿のID",
		example: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
	}),
});
export const likePostResponse = post;

export const listPostsQuery = z.object({
	limit: z.number().min(1).max(100).default(50).openapi({
		description: "取得する投稿の最大数",
		example: 50,
	}),
	before: z.ulid().optional().openapi({
		description: "取得する投稿のID(このIDより前の投稿を取得)",
		example: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
	}),
});
export const listPostsResponse = z.object({
	posts: z.array(post).openapi({
		description: "投稿の一覧",
	}),
});

export const getPostParams = z.object({
	id: z.ulid().openapi({
		description: "投稿のID",
		example: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
	}),
});
export const getPostResponse = z.object({
	post: post,
	replies: z.array(post).openapi({
		description: "返信の一覧",
	}),
});
