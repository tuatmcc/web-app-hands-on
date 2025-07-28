import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Post } from "../components/Post";
import { PostForm } from "../components/PostForm";
import { fetchClient } from "../libs/fetch-client";

export const Route = createFileRoute("/")({
	component: Page,
});

function Page() {
	const query = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			const response = await fetchClient.api.posts.$get({
				query: {},
			});
			if (!response.ok) {
				throw new Error("Failed to fetch posts");
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
			const response = await fetchClient.api.posts.$post({
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
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	const handlePostSubmit = (name: string | undefined, content: string) => {
		mutation.mutate({ name, content });
	};

	return (
		<div className="flex flex-col gap-4">
			<PostForm onSubmit={handlePostSubmit} isLoading={mutation.isPending} />
			<div className="flex flex-col gap-4">
				{query.data?.posts.map((post) => (
					<Post key={post.id} post={post} />
				))}
			</div>
		</div>
	);
}
