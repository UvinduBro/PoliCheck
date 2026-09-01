import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";
import type { Timestamp } from "firebase/firestore";

export function toDate(value: string | Timestamp | Date | undefined | null): Date | null {
  if (!value) return null;
  if (value instanceof Date) return isValid(value) ? value : null;
  if (typeof value === "string") {
    const parsed = parseISO(value);
    return isValid(parsed) ? parsed : null;
  }
  if (typeof (value as Timestamp).toDate === "function") {
    return (value as Timestamp).toDate();
  }
  return null;
}

export function formatDate(
  value: string | Timestamp | Date | undefined | null,
  pattern = "d MMMM yyyy",
): string {
  const date = toDate(value);
  return date ? format(date, pattern) : "Unknown date";
}

export function formatRelative(value: string | Timestamp | Date | undefined | null): string {
  const date = toDate(value);
  return date ? formatDistanceToNow(date, { addSuffix: true }) : "unknown";
}

/** Which of two dated items is more recent — used to resolve conflicting-source presentation per spec section 13. */
export function isMoreRecent(
  a: string | Timestamp | Date | undefined | null,
  b: string | Timestamp | Date | undefined | null,
): boolean {
  const dateA = toDate(a);
  const dateB = toDate(b);
  if (!dateA) return false;
  if (!dateB) return true;
  return dateA.getTime() > dateB.getTime();
}
