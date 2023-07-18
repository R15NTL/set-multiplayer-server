import { IOContext } from "../../types/context";

export const handleSocketEventError = (context: IOContext, error: unknown) => {
  const { socket } = context;

  if (error instanceof Error)
    return socket.emit("error", { message: error.message });

  socket.emit("error", { message: "An unknown error occurred" });
};
