const GUEST_FLAG_KEY = "fitness-tracker.guest";
const GUEST_NAME_KEY = "fitness-tracker.guestName";

export function setGuest(name?: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GUEST_FLAG_KEY, "true");
  if (name != null && name.trim()) {
    window.localStorage.setItem(GUEST_NAME_KEY, name.trim());
  } else {
    window.localStorage.removeItem(GUEST_NAME_KEY);
  }
}

export function clearGuest(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(GUEST_FLAG_KEY);
  window.localStorage.removeItem(GUEST_NAME_KEY);
}

export function isGuest(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(GUEST_FLAG_KEY) === "true";
}

export function getGuestName(): string | null {
  if (typeof window === "undefined") return null;
  const name = window.localStorage.getItem(GUEST_NAME_KEY);
  return name && name.trim() ? name.trim() : null;
}
