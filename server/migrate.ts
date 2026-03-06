import 'dotenv/config'; 
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.RDS_HOST,
  port: Number(process.env.RDS_PORT) || 3306,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE,
});

const db = drizzle(pool);

async function main() {
  console.log("Running migrations against AWS RDS MySQL...");
  console.log(`Host: ${process.env.RDS_HOST}`);
  console.log(`Database: ${process.env.RDS_DATABASE}`);

  await migrate(db, { migrationsFolder: "./migrations" });

  console.log("Migrations completed successfully!");
  await pool.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
