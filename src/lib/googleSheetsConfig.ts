function getRequiredEnv(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getGoogleSheetId() {
  return getRequiredEnv("GOOGLE_SHEET_ID", process.env.SHEET_ID);
}

export function getGoogleSheetUrl() {
  const sheetId = getGoogleSheetId();
  return (
    process.env.GOOGLE_SHEET_URL ??
    `https://docs.google.com/spreadsheets/d/${sheetId}/edit`
  );
}

export function getBlockedSheetTabs() {
  const raw = process.env.GOOGLE_SHEET_BLOCKED_TABS ?? "Sheet";
  return raw
    .split(",")
    .map((tab) => tab.trim())
    .filter(Boolean);
}

export function getGoogleServiceAccountCredentials() {
  const privateKey = (
    process.env.GOOGLE_PRIVATE_KEY ?? process.env.private_google_key
  )?.replace(/\\n/g, "\n");

  if (!privateKey) {
    throw new Error(
      "Missing GOOGLE_PRIVATE_KEY (or legacy private_google_key)"
    );
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
