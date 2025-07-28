import { likePostResponse, type Post as PostType } from "@mcc/schema/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { LuHeart, LuMessageCircle } from "react-icons/lu";

interface Props {
	post: PostType;
}

export function Post({ post }: Props): ReactNode {
	const query = useQueryClient();
	const mutation = useMutation({
		mutationFn: async () => {
			const response = await fetch(`http://localhost:8787/api/posts/${post.id}/like`, {
				method: "POST",
			})

			if (!response.ok) {
				throw new Error("Failed to like post");
			}

			const json = await response.json();
			const data = likePostResponse.parse(json);
			return data;
		},
		onSuccess: () => {
			query.invalidateQueries({ queryKey: ["posts"] });
		},
	})

	const handleLikeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		mutation.mutate();
	}

	return (
		<article className="flex flex-col gap-2 rounded-lg bg-white p-4 shadow-md">
			<div className="flex items-center gap-2">
				<span className="size-8 rounded-full bg-slate-300" />
				<span>{post.name ?? "名無しさん"}</span>
			</div>

			<p className="whitespace-pre-wrap">{post.content}</p>

			<div className="flex gap-4 text-slate-500">
				<form onSubmit={handleLikeSubmit} className="flex items-center gap-1">
					<button type="submit">
						<LuHeart className="size-6" title="いいね" />
					</button>
					<span>{post.likes}</span>
				</form>
				<div className="flex items-center gap-1">
					<button type="button">
						<LuMessageCircle className="size-6" title="返信" />
					</button>
					<span>{post.replies}</span>
				</div>
			</div>
		</article>
	);
}
