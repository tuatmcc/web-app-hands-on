import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Post } from "../../components/Post";
import { PostForm } from "../../components/PostForm";
import { fetchClient } from "../../libs/fetch-client";

export const Route = createFileRoute("/posts/$id")({
	component: Page,
});

function Page() {
	const { id } = Route.useParams();
	const query = useQuery({
		queryKey: ["posts", id],
		queryFn: async () => {
			const response = await fetchClient.api.posts[":id"].$get({
				param: {
					id,
				},
			});
			if (!response.ok) {
				throw new Error("Failed to fetch post");
			}
			const data = await response.json();
			return data;
		},
	});

	return (
		<div className="flex flex-col gap-4">
			{query.data?.post && <Post post={query.data.post} />}
			<PostForm />
			<div className="flex flex-col gap-4">
				{query.data?.replies.map((reply) => (
					<Post key={reply.id} post={reply} />
				))}
			</div>
		</div>
	);
}
