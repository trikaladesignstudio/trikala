import { syncLocationSnapshot } from "../src/lib/locationSnapshot";

syncLocationSnapshot().catch((error) => {
  console.error("[locations] Snapshot sync failed:", error);
  process.exit(1);
});
