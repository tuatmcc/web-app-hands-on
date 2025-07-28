import type { ReactNode } from "react";
import { useState } from "react";

interface Props {
	onSubmit: (name: string | undefined, content: string) => void;
	isLoading: boolean;
}

export function PostForm({ onSubmit, isLoading }: Props): ReactNode {
	const [name, setName] = useState("");
	const [content, setContent] = useState("");

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSubmit(name || undefined, content);
		setContent("");
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
					disabled={isLoading}
				/>
			</label>
			<label className="flex w-full flex-col gap-1">
				<span>内容</span>
				<textarea
					className="w-full resize-none rounded-md border border-slate-400 bg-white p-2 outline-sky-400 outline-offset-4 disabled:bg-slate-100 disabled:text-slate-400"
					rows={5}
					value={content}
					onChange={(e) => setContent(e.target.value)}
					disabled={isLoading}
				/>
			</label>
			<button
				type="submit"
				className="rounded-full bg-sky-400 px-4 py-1 text-white disabled:bg-sky-300"
				disabled={isLoading}
			>
				投稿する
			</button>
		</form>
	);
}
