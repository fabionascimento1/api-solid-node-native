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

async function register(req: IncomingMessage, res: ServerResponse) {
  const { statusCode } = res;
  let body = "";
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  req.on("data", async (data) => {
    body += data.toString();
  });
  req.on("end", async () => {
    try {
      const { name, email, password } = JSON.parse(body);
      const pool = new Pool(credentials);
      const result = await pool.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
        [name, email, password]
      );
      res.write(JSON.stringify(result.rows));
      return res.end();
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ error: "Erro ao inserir usuário no banco de dados" })
      );
    }
  });
}
