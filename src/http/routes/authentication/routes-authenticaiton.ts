import { IncomingMessage, ServerResponse } from "node:http";

export const authenticationRoutes = () => ({
  "/signin:post": async (
    request: IncomingMessage,
    response: ServerResponse
  ) => {
    response.write(
      JSON.stringify({
        results: { id: 1 },
      })
    );
    return response.end();
  },
});
