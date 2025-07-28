import { listPostsResponse } from "@mcc/schema/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Post } from "../components/Post";
import { PostForm } from "../components/PostForm";

export const Route = createFileRoute("/")({
	component: Page,
});

function Page() {
	const query = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			const response = await fetch("http://localhost:8787/api/posts");
			if (!response.ok) {
				throw new Error("Failed to fetch posts");
			}
			const json = await response.json();
			const data = listPostsResponse.parse(json);
			return data;
		},
	});

	return (
		<div className="flex flex-col gap-4">
			<PostForm />
			<div className="flex flex-col gap-4">
				{query.data?.posts.map((post) => (
					<Post key={post.id} post={post} />
				))}
			</div>
		</div>
	);
}
