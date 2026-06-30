import { useRef, useState } from "react";
import Snackbar from "./Snackbar";
import { AppContext } from "./AppContext";
import { localUsernameKey } from "../utils";
import { io } from "socket.io-client";

const URL = "http://10.127.5.67:8000";

export function AppContextProvider({
	children
}: {
	children: React.ReactNode;
}) {
	const socketRef = useRef(
		io(URL, {
			autoConnect: true,
			reconnection: true,
			reconnectionAttempts: 10,
			reconnectionDelay: 1000
		})
	);
	const [username, setUsername] = useState(
		localStorage.getItem(localUsernameKey) ?? ""
	);
	const [snackbarMessage, setSnackbarMessage] = useState("");

	return (
		<AppContext.Provider
			value={{ socketRef, username, setUsername, setSnackbarMessage }}
		>
			{children}

			<Snackbar message={snackbarMessage} />
		</AppContext.Provider>
	);
}
