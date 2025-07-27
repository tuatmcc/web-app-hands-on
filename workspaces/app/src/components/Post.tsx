import type { Post as PostType } from "@mcc/schema/api";
import type { ReactNode } from "react";
import { LuHeart, LuMessageCircle } from "react-icons/lu";

interface Props {
	post: PostType;
}

export function Post({ post }: Props): ReactNode {
	return (
		<article className="flex min-w-0 flex-col gap-2 rounded-lg bg-white p-4 shadow-md">
			<div className="flex items-center gap-2">
				<span className="size-10 rounded-full bg-slate-300" />
				<span>{post.name ?? "名無しさん"}</span>
			</div>

			<p className="whitespace-pre-wrap">{post.content}</p>

			<div className="flex gap-4 text-slate-500">
				<div className="flex items-center gap-1">
					<button type="button">
						<LuHeart className="size-6" />
					</button>
					<span>{post.likes}</span>
				</div>
				<div className="flex items-center gap-1">
					<button type="button">
						<LuMessageCircle className="size-6" />
					</button>
					<span>{post.replies}</span>
				</div>
			</div>
		</article>
	);
}
