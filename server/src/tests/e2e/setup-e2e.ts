import {
    PostgreSqlContainer,
    StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { execSync } from "node:child_process";

let container: StartedPostgreSqlContainer | null = null;

export async function startTestDatabase() {
  const startedContainer = await new PostgreSqlContainer("postgres:15")
    .withDatabase("eventhub_test")
    .withUsername("test")
    .withPassword("test")
    .start();

  container = startedContainer;
  process.env.DATABASE_URL = startedContainer.getConnectionUri();

  execSync("npx prisma db push --skip-generate", {
    stdio: "inherit",
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL,
    },
  });
}

export async function stopTestDatabase() {
  if (container) {
    await container.stop();
    container = null;
  }
}