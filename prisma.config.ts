/**
 * Prisma Configuration (Prisma 7+)
 * ==================================
 *
 * This file configures how Prisma CLI tools connect to your database.
 * The database URL is read from environment variables.
 *
 * For migrations: Uses DATABASE_URL from .env
 * For client: Connection is configured via adapter in database.js
 *
 * Pattern ported from Vetify — explicit migrations path and seed command.
 */

import dotenv from "dotenv";
import path from "node:path";
import { defineConfig } from "prisma/config";

// Load environment variables
dotenv.config();

export default defineConfig({
    // Path to schema file
    schema: path.join(import.meta.dirname, "prisma", "schema.prisma"),

    // Migrations configuration (ported from Vetify)
    migrations: {
        path: path.join(import.meta.dirname, "prisma", "migrations"),
        seed: "node prisma/seed.js",
    },

    // Database connection for Prisma CLI (migrations, introspection)
    datasource: {
        url: process.env.DATABASE_URL!,
    },
});

