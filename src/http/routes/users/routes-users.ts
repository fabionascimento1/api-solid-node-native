import { IncomingMessage, ServerResponse } from "node:http";
import { z } from "zod";

export const userRoutes = () => ({
  "/users:get": async (request: IncomingMessage, response: ServerResponse) => {
    response.write(
      JSON.stringify({
        results: { id: 1 },
      })
    );
    return response.end();
  },
  "/users:post": register,
});

async function register(request: IncomingMessage, response: ServerResponse) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });
  let body = "";
  request.on("data", (data) => {
    body += data;
  });
  request.on("end", () => {
    body = JSON.parse(body);
    const { name, email, password } = body;
    console.log(name);
  });
  response.write(
    JSON.stringify({
      results: { id: 2 },
    })
  );
  return response.end();
}
