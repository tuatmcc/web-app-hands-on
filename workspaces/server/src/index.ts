import { swaggerUI } from "@hono/swagger-ui";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { helloWorldQuery, helloWorldResponse } from "@mcc/schema/api";

type Bindings = {};

const app = new OpenAPIHono<{ Bindings: Bindings }>();

app.openapi(
	createRoute({
		method: "get",
		path: "/",
		request: {
			query: helloWorldQuery,
		},
		responses: {
			200: {
				description: "Successful response",
				content: {
					"text/plain": {
						schema: helloWorldResponse,
					},
				},
			},
		},
	}),
	(c) => {
		const { name } = c.req.valid("query");
		return c.text(`Hello, ${name ?? "World"}!`);
	},
);

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
