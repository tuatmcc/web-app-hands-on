import type { AppType } from "@mcc/server";
import { hc } from "hono/client";

export const fetchClient = hc<AppType>("http://localhost:8787/");
