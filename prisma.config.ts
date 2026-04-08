import path from "node:path"
import { defineConfig } from "prisma/config"
import { config as dotenvConfig } from "dotenv"

// Load .env.local for Prisma CLI commands
dotenvConfig({ path: ".env.local" })

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL!,
  },
})
