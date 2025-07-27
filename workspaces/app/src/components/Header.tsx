import { Link } from "@tanstack/react-router";
import { clsx } from "clsx";
import type { ReactNode } from "react";
import Logo from "../assets/logo.png";

interface Props {
	className?: string;
}

export function Header({ className }: Props): ReactNode {
	return (
		<header
			className={clsx(
				"flex h-16 w-full items-center justify-between bg-white p-4 shadow-md",
				className,
			)}
		>
			<Link to="/" className="h-full">
				<img src={Logo} alt="Logo" className="h-full" />
			</Link>
		</header>
	);
}
