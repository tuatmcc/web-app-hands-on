import { createFileRoute } from "@tanstack/react-router";
import { Post } from "../components/Post";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<div>
			<Post
				post={{
					id: "xxxx",
					name: "しゅん",
					content:
						"あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。\nあのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。\nあのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。",
					likes: 10,
					replies: 3,
					createdAt: 1722163200,
				}}
			/>
		</div>
	);
}
