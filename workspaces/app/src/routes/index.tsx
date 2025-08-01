import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Page,
});

function Page() {
	return (
		<div className="flex flex-col gap-4">
			<h1>Hello, World!</h1>
		</div>
	);
}
