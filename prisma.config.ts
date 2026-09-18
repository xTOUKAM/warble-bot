import "dotenv/config";

import {
    defineConfig,
    env,
} from "prisma/config";

export default defineConfig({
    schema: "apps/prisma/schema.prisma",

    migrations: { path: "prisma/migrations" },
    datasource: { url: env("DATABASE_URL") },
});