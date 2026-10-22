// Pure habit-tracker logic. No DOM or storage code here, so it can be
// unit-tested directly (see test/habits.test.js) and reused by app.js.

/** Return the local date as "YYYY-MM-DD" for a given Date (defaults to now). */
export function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Generate a unique id, with a fallback for non-secure contexts
 * (crypto.randomUUID is only available over HTTPS or on localhost).
 */
function newId() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `h-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}

/** Create a habit object with a unique id. */
export function createHabit(name, id = newId()) {
  return { id, name: name.trim(), lastCompleted: null };
}

/** Add a habit to a list. Ignores empty names and duplicate names. */
export function addHabit(habits, name) {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return habits;
  if (habits.some((h) => h.name.toLowerCase() === trimmed.toLowerCase())) {
    return habits;
  }
  return [...habits, createHabit(trimmed)];
}

/** Remove the habit with the given id. */
export function deleteHabit(habits, id) {
  return habits.filter((h) => h.id !== id);
}

/**
 * Toggle whether the habit was completed today.
 * Returns a new list; never mutates the input.
 */
export function toggleToday(habits, id, date = new Date()) {
  const key = todayKey(date);
  return habits.map((h) =>
    h.id === id
      ? { ...h, lastCompleted: h.lastCompleted === key ? null : key }
      : h
  );
}

/** Whether the habit is marked as completed for today. */
export function isCompletedToday(habit, date = new Date()) {
  return habit.lastCompleted === todayKey(date);
}

/** How many habits are completed today. */
export function completedTodayCount(habits, date = new Date()) {
  return habits.filter((h) => isCompletedToday(h, date)).length;
}
