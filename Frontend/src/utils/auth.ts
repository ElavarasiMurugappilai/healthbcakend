export function saveToken(raw: unknown): void {
  if (!raw) return;
  let tokenValue: unknown = raw;
  if (typeof tokenValue === "object" && tokenValue !== null) {
    const maybe = tokenValue as Record<string, unknown>;
    tokenValue = (maybe.token as string) || (maybe.accessToken as string) || JSON.stringify(maybe);
  }
  let text = String(tokenValue);
  // strip accidental surrounding quotes
  text = text.replace(/^"(.*)"$/, "$1");
  // basic sanity: expect JWT 3 parts
  if (text.split(".").length !== 3) {
    // still store to allow debugging, but warn
    // eslint-disable-next-line no-console
    console.warn("saveToken: unexpected token format");
  }
  localStorage.setItem("token", text);
}

export function loadSanitizedToken(): string | null {
  let raw = localStorage.getItem("token");
  if (!raw || raw === "undefined" || raw === "null") {
    localStorage.removeItem("token");
    return null;
  }
  raw = raw.replace(/^"(.*)"$/, "$1");
  return raw;
}

