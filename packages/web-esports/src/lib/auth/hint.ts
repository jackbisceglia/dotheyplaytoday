const key = "dtpt.authenticated";

export const hint = {
  key,
  set: () => {
    try {
      localStorage.setItem(key, "1");
    } catch {
      return;
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(key);
    } catch {
      return;
    }
  },
} as const;
