import { DurableObject } from "cloudflare:workers";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import * as schema from "@mcc/schema/database";
import type { DrizzleSqliteDODatabase } from "drizzle-orm/durable-sqlite";
import { drizzle } from "drizzle-orm/durable-sqlite";
import { migrate } from "drizzle-orm/durable-sqlite/migrator";
import migrations from "../drizzle/migrations";
import * as routes from "./routes";

const app = new OpenAPIHono<{ Bindings: Env }>();

app.openapi(routes.helloWorldRoute, (c) => {
	const { name } = c.req.valid("query");
	return c.text(`Hello, ${name ?? "World"}!`);
});

app.openapi(routes.createPostRoute, () => {
	throw new Error("Not implemented");
});

app.openapi(routes.likePostRoute, () => {
	throw new Error("Not implemented");
});

app.openapi(routes.listPostsRoute, () => {
	throw new Error("Not implemented");
});

app.openapi(routes.getPostRoute, () => {
	throw new Error("Not implemented");
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
}

export default app;
