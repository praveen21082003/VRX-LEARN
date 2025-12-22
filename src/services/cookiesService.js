export function areCookiesEnabled() {
  try {
    document.cookie = "cookie_test=1; SameSite=Lax; path=/";
    const enabled = document.cookie.includes("cookie_test=");
    document.cookie = "cookie_test=; Max-Age=0; path=/";
    return enabled;
  } catch {
    return false;
  }
}
