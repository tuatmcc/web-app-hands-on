import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: async ({
			name,
			content,
		}: {
			name: string | undefined;
			content: string;
		}) => {
			const response = await fetchClient.api.posts[":id"].reply.$post({
				param: {
					id,
				},
				json: {
					name,
					content,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to create post");
			}

			const data = await response.json();
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts", id] });
		},
	});

	const handlePostSubmit = (name: string | undefined, content: string) => {
		mutation.mutate({ name, content });
	};

	return (
		<div className="flex flex-col gap-4">
			{query.data?.post && <Post post={query.data.post} />}
			<PostForm onSubmit={handlePostSubmit} isLoading={mutation.isPending} />
			<div className="flex flex-col gap-4">
				{query.data?.replies.map((reply) => (
					<Post key={reply.id} post={reply} />
				))}
			</div>
		</div>
	);
}
