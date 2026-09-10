/** Vitest configuration stays minimal because the UI behavior helpers are framework-independent. */
import { defineConfig } from "vitest/config";
export default defineConfig({ test: { include: ["tests/**/*.test.ts"] } });
