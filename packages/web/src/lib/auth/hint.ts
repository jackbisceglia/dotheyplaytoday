export const AuthHintKey = "dtpt.authenticated";

export function setAuthHint() {
  try {
    localStorage.setItem(AuthHintKey, "1");
  } catch {
    // Storage availability must not affect authentication.
  }
}

export function clearAuthHint() {
  try {
    localStorage.removeItem(AuthHintKey);
  } catch {
    // Storage availability must not affect authentication.
  }
}
