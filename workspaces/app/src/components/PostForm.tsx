import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import { fetchClient } from "../libs/fetch-client";

export function PostForm(): ReactNode {
	const [name, setName] = useState("");
	const [content, setContent] = useState("");

	const query = useQueryClient();

	const mutation = useMutation({
		mutationFn: async () => {
			const response = await fetchClient.api.posts.$post({
				json: {
					name: name || undefined,
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
