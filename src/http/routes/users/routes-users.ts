import { credentials } from "@/app";
import { IncomingMessage, ServerResponse } from "node:http";
import { Pool } from "pg";
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
  const { statusCode } = response;
  let body = "";
  let row: [] = [];
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  request
    .on("data", (data) => {
      body += data;
    })
    .on("end", () => {
      body = JSON.parse(body);
      const { name, email, password } = body;
      const pool = new Pool(credentials);
      pool.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
        [name, email, password],
        (error, results) => {
          if (error) {
            throw error;
          }
          if (statusCode === 200) response.write(JSON.stringify(row));
        }
      );
    });

  return response.end();
}
