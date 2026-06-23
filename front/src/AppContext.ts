import { createContext, useContext } from "react";
import type { Data, Screen } from "./types";

export const AppContext = createContext<{
	navigate: (screen: Screen) => void;
	sendData: (data: Data) => void;
} | null>(null);

export function useAppContext() {
	const ctx = useContext(AppContext);

	if (!ctx) throw Error("Context should be used in provider");

	return ctx;
}
