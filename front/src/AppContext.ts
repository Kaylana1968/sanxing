import { createContext, useContext } from "react";
import type { Data } from "./types";

export const AppContext = createContext<{
	socketRef: React.RefObject<WebSocket | null>;
	sendData: (data: Data) => void;
} | null>(null);

export function useAppContext() {
	const ctx = useContext(AppContext);

	if (!ctx) throw Error("Context should be used in provider");

	return ctx;
}
