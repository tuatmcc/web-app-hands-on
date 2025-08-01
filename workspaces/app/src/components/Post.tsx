import type { ReactNode } from "react";
import { LuHeart, LuMessageCircle } from "react-icons/lu";

export function Post(): ReactNode {
	return (
		<article className="card flex flex-col gap-2">
			<div className="flex items-center gap-2">
				<span className="size-8 rounded-full bg-slate-300" />
				<span>太郎</span>
			</div>

			<p className="whitespace-pre-wrap">こんにちは！</p>

			<div className="flex gap-4 text-slate-500">
				<div className="flex items-center gap-1">
					<button type="button">
						<LuHeart className="size-6" title="いいね" />
					</button>
					<span>10</span>
				</div>
				<div className="flex items-center gap-1">
					<div>
						<LuMessageCircle className="size-6" title="返信" />
					</div>
					<span>3</span>
				</div>
			</div>
		</article>
	);
}
