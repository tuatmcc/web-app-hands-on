import { swaggerUI } from "@hono/swagger-ui";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

type Bindings = {};

const app = new OpenAPIHono<{ Bindings: Bindings }>();

const helloWorldQuerySchema = z.object({
	name: z.string().optional(),
});
const helloWorldResponseSchema = z.string();
const helloWorldRoute = createRoute({
	method: "get",
	path: "/",
	request: {
		query: helloWorldQuerySchema,
	},
	responses: {
		200: {
			description: "Successful response",
			content: {
				"text/plain": {
					schema: helloWorldResponseSchema,
				},
			},
		},
	},
});

app.openapi(helloWorldRoute, (c) => {
	const { name } = c.req.valid("query");
	return c.text(`Hello, ${name ?? "World"}!`);
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
