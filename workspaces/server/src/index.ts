import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import * as routes from "./routes";

type Bindings = {
	DB: D1Database;
};

const app = new OpenAPIHono<{ Bindings: Bindings }>();

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

export default app;
