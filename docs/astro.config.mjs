// @ts-check

import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import mermaid from "astro-mermaid";

// https://astro.build/config
export default defineConfig({
	integrations: [
		mermaid({ theme: "forest", autoTheme: true }),
		starlight({
			title: "MCC Webアプリ講習会資料",
			locales: {
				root: {
					lang: "ja",
					label: "日本語",
				},
			},
		}),
	],
});
