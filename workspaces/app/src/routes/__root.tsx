import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/Header";

export const Route = createRootRoute({
	component: () => (
		<>
			<div className="grid min-h-dvh grid-rows-[auto_1fr]">
				<Header className="sticky top-0 z-10" />
				<div className="mx-auto w-full max-w-lg p-4">
					<Outlet />
				</div>
			</div>
		</>
	),
});
