import { type CreatePostBody, createPostResponse } from "@mcc/schema/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

export function PostForm(): ReactNode {
	const [name, setName] = useState("");
	const [content, setContent] = useState("");

	const query = useQueryClient();

	const mutation = useMutation({
		mutationFn: async () => {
			const body: CreatePostBody = {
				name: name || undefined,
				content,
			};

			const response = await fetch("http://localhost:8787/api/posts", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				throw new Error("Failed to create post");
			}

			const json = await response.json();
			const data = createPostResponse.parse(json);

			return data;
		},
		onSuccess: () => {
			query.invalidateQueries({ queryKey: ["posts"] });
			setContent("");
		},
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		mutation.mutate();
	};

	return (
		<form
			className="flex flex-col items-end gap-2 rounded-lg bg-white p-4 shadow-md"
			onSubmit={handleSubmit}
		>
			<label className="flex w-full flex-col gap-1">
				<span>名前</span>
				<input
					type="text"
					className="w-full rounded-md border border-slate-400 bg-white p-2 outline-sky-400 outline-offset-4 disabled:bg-slate-100 disabled:text-slate-400"
					value={name}
					onChange={(e) => setName(e.target.value)}
					disabled={mutation.isPending}
				/>
			</label>
			<label className="flex w-full flex-col gap-1">
				<span>内容</span>
				<textarea
					className="w-full resize-none rounded-md border border-slate-400 bg-white p-2 outline-sky-400 outline-offset-4 disabled:bg-slate-100 disabled:text-slate-400"
					rows={5}
					value={content}
					onChange={(e) => setContent(e.target.value)}
					disabled={mutation.isPending}
				/>
			</label>
			<button
				type="submit"
				className="rounded-full bg-sky-400 px-4 py-1 text-white disabled:bg-sky-300"
				disabled={mutation.isPending}
			>
				投稿する
			</button>
		</form>
	);
}
