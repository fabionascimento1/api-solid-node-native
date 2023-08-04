import http from "node:http";
import { env } from "./env";
import { Pool, Client } from "pg";

import appRoutes from "./http/routes";
import { createTable } from "./db/schema";
export const app = http.createServer(appRoutes);

// open connection BD PostGres
export const credentials = {
  user: env.USER_DATABASE,
  host: env.HOST,
  database: env.DATABASE,
  password: env.PASSWORD,
  port: env.PORT_DATABASE,
};

async function poolDemo() {
  const pool = new Pool(credentials);
  const now = await pool.query("SELECT NOW()");
  try {
    const createResult = await pool.query(createTable);
    console.log({ createResult });
  } catch (error) {}
  await pool.end();
  return now;
}

async function clientDemo() {
  const client = new Client(credentials);
  await client.connect();
  const now = await client.query("SELECT NOW()");
  await client.end();

  return now;
}

(async () => {
  const poolResult = await poolDemo();
  console.log("Time with pool: " + poolResult.rows[0]["now"]);

  const clientResult = await clientDemo();
  console.log("Time with client: " + clientResult.rows[0]["now"]);
})();
