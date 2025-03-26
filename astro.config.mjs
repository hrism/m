import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  integrations: [react()],
  site: process.env.ASSET_BASE_URL || "http://localhost:4321",
});
