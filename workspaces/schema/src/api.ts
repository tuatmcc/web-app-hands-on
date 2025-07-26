import { z } from "zod";

export const helloWorldQuery = z.object({
	name: z.string().optional(),
});
export const helloWorldResponse = z.string();
