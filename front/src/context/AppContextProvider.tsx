import { useCallback, useRef, useState } from "react";
import Snackbar from "./Snackbar";
import type { Data } from "../types";
import { AppContext } from "./AppContext";
import { localUsernameKey } from "../utils";

export function AppContextProvider({
	children
}: {
	children: React.ReactNode;
}) {
	const socketRef = useRef<WebSocket>(null);
	const [username, setUsername] = useState(
		localStorage.getItem(localUsernameKey) ?? ""
	);
	const [snackbarMessage, setSnackbarMessage] = useState("");

	const sendData = useCallback(
		(data: Data) => {
			if (!socketRef.current) {
				setSnackbarMessage("Vous n'êtes pas connecté au serveur.");
				return;
			}

			if (socketRef.current.readyState !== WebSocket.OPEN) {
				setSnackbarMessage("Votre connexion au serveur est fermée.");
				return;
			}

			socketRef.current.send(JSON.stringify(data));
		},
		[setSnackbarMessage]
	);

	return (
		<AppContext.Provider
			value={{ socketRef, username, setUsername, sendData, setSnackbarMessage }}
		>
			{children}

			<Snackbar message={snackbarMessage} />
		</AppContext.Provider>
	);
}
