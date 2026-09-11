const key = "dtpt.authenticated";

export const authHint = {
  key,
  set: () => {
    try {
      localStorage.setItem(key, "1");
    } catch {
      // Storage availability must not affect authentication.
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Storage availability must not affect authentication.
    }
  },
} as const;
