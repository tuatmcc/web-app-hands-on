import { createRequire } from "node:module";

import { defineConfig } from "drizzle-kit";

const require = createRequire(import.meta.url);

export default defineConfig({
	dialect: "sqlite",
	schema: require.resolve("@mcc/schema/database"),
	out: "./migrations",
});
