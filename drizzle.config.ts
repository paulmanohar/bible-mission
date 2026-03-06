import 'dotenv/config'; 
import { defineConfig } from "drizzle-kit";

const host = process.env.RDS_HOST;
const port = process.env.RDS_PORT || "3306";
const user = process.env.RDS_USER;
const password = process.env.RDS_PASSWORD;
const database = process.env.RDS_DATABASE;

if (!host || !user || !password || !database) {
  throw new Error("RDS_HOST, RDS_USER, RDS_PASSWORD, and RDS_DATABASE environment variables are required");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    host,
    port: Number(port),
    user,
    password,
    database,
  },
});
