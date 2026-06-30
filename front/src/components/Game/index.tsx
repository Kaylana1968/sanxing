import { useEffect, useRef } from "react";
import type { GameState } from "../../types";

export default function Game({ gameState }: { gameState: GameState }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const img = new Image();
		img.src = "/images/cards/back.webp";

		const resizeAndDraw = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			if (img.complete) {
				ctx.drawImage(img, 0, 0, 182, 256);
			}
		};

		img.onload = resizeAndDraw;

		resizeAndDraw();

		window.addEventListener("resize", resizeAndDraw);

		return () => {
			window.removeEventListener("resize", resizeAndDraw);
		};
	}, []);

	console.log(gameState);

	return (
		<canvas
			ref={canvasRef}
			className="block w-screen h-screen fixed top-0 left-0 bg-red-500"
		/>
	);
}
