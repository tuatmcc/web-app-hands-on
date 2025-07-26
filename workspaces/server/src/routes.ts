import { createRoute } from "@hono/zod-openapi";
import * as schema from "@mcc/schema/api";

export const helloWorldRoute = createRoute({
	method: "get",
	path: "/",
	description: "挨拶を返す",
	request: {
		query: schema.helloWorldQuery,
	},
	responses: {
		200: {
			description: "リクエスト成功",
			content: {
				"text/plain": {
					schema: schema.helloWorldResponse,
				},
			},
		},
	},
});

export const createPostRoute = createRoute({
	method: "post",
	path: "/api/posts",
	tags: ["posts"],
	description: "投稿を作成する",
	request: {
		body: {
			content: {
				"application/json": {
					schema: schema.createPostBody,
				},
			},
		},
	},
	responses: {
		200: {
			description: "リクエスト成功",
			content: {
				"application/json": {
					schema: schema.createPostResponse,
				},
			},
		},
	},
});

export const likePostRoute = createRoute({
	method: "post",
	path: "/api/posts/{id}/like",
	tags: ["posts"],
	description: "投稿にいいねする",
	request: {
		params: schema.likePostParams,
	},
	responses: {
		200: {
			description: "リクエスト成功",
			content: {
				"application/json": {
					schema: schema.likePostResponse,
				},
			},
		},
	},
});

export const createReplyRoute = createRoute({
	method: "post",
	path: "/api/posts/{id}/reply",
	tags: ["posts"],
	description: "返信を作成する",
	request: {
		params: schema.createReplyParams,
		body: {
			content: {
				"application/json": {
					schema: schema.createReplyBody,
				},
			},
		},
	},
	responses: {
		200: {
			description: "リクエスト成功",
			content: {
				"application/json": {
					schema: schema.createReplyResponse,
				},
			},
		},
	},
});

export const listPostsRoute = createRoute({
	method: "get",
	path: "/api/posts",
	tags: ["posts"],
	description: "投稿一覧を取得する",
	request: {
		query: schema.listPostsQuery,
	},
	responses: {
		200: {
			description: "リクエスト成功",
			content: {
				"application/json": {
					schema: schema.listPostsResponse,
				},
			},
		},
	},
});

export const getPostRoute = createRoute({
	method: "get",
	path: "/api/posts/{id}",
	tags: ["posts"],
	description: "個別の投稿と返信一覧を取得する",
	request: {
		params: schema.getPostParams,
	},
	responses: {
		200: {
			description: "リクエスト成功",
			content: {
				"application/json": {
					schema: schema.getPostResponse,
				},
			},
		},
	},
});
