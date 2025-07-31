// @ts-check

import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: "MCC Webアプリ講習会資料",
			locales: {
				root: {
					lang: "ja",
					label: "日本語",
				},
			},
			// sidebar: [
			// 	{
			// 		label: "はじめに",
			// 		slug: "",
			// 	},
			// 	{
			// 		label: "Guides",
			// 		items: [
			// 			// Each item here is one entry in the navigation menu.
			// 			{ label: "Example Guide", slug: "guides/example" },
			// 		],
			// 	},
			// 	{
			// 		label: "Reference",
			// 		autogenerate: { directory: "reference" },
			// 	},
			// ],
		}),
	],
});
