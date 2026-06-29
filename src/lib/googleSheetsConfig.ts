function getRequiredEnv(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getGoogleSheetId() {
  return getRequiredEnv("GOOGLE_SHEET_ID");
}

export function getGoogleSheetUrl() {
  return `https://docs.google.com/spreadsheets/d/${getGoogleSheetId()}/edit`;
}

export function getBlockedSheetTabs() {
  const raw = process.env.GOOGLE_SHEET_BLOCKED_TABS ?? "Sheet";
  return raw
    .split(",")
    .map((tab) => tab.trim())
    .filter(Boolean);
}

export function getGoogleServiceAccountCredentials() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!privateKey) {
    throw new Error("Missing GOOGLE_PRIVATE_KEY");
  }

  return {
    type: "service_account" as const,
    project_id: getRequiredEnv("GOOGLE_SERVICE_ACCOUNT_PROJECT_ID"),
    private_key_id: getRequiredEnv("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID"),
    private_key: privateKey,
    client_email: getRequiredEnv("GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL"),
    client_id: getRequiredEnv("GOOGLE_SERVICE_ACCOUNT_CLIENT_ID"),
    universe_domain: "googleapis.com",
  };
}
