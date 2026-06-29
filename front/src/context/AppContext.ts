import { createContext, useContext } from "react";
import type { Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "../types";

export const AppContext = createContext<{
	socketRef: React.RefObject<
		Socket<ServerToClientEvents, ClientToServerEvents>
	>;
	username: string;
	setUsername: React.Dispatch<React.SetStateAction<string>>;
	setSnackbarMessage: React.Dispatch<React.SetStateAction<string>>;
} | null>(null);

export function useAppContext() {
	const ctx = useContext(AppContext);

	if (!ctx) throw Error("Context should be used in provider");

	return ctx;
}
