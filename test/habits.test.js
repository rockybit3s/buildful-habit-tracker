import test from "node:test";
import assert from "node:assert/strict";
import {
  todayKey,
  addHabit,
  deleteHabit,
  toggleToday,
  isCompletedToday,
  completedTodayCount,
} from "../habits.js";

test("todayKey formats the local date as YYYY-MM-DD", () => {
  assert.equal(todayKey(new Date(2026, 1, 3)), "2026-02-03");
  assert.equal(todayKey(new Date(2026, 11, 31)), "2026-12-31");
});

test("addHabit trims the name and appends", () => {
  const habits = addHabit([], "  Read  ");
  assert.equal(habits.length, 1);
  assert.equal(habits[0].name, "Read");
  assert.ok(habits[0].id);
  assert.equal(habits[0].lastCompleted, null);
});

test("addHabit ignores empty and whitespace-only names", () => {
  assert.equal(addHabit([], "").length, 0);
  assert.equal(addHabit([], "   ").length, 0);
});

test("addHabit rejects duplicate names, case-insensitively", () => {
  let habits = addHabit([], "Read");
  habits = addHabit(habits, "read");
  assert.equal(habits.length, 1);
});

test("deleteHabit removes only the matching habit", () => {
  let habits = addHabit([], "Read");
  habits = addHabit(habits, "Run");
  const id = habits[0].id;
  habits = deleteHabit(habits, id);
  assert.equal(habits.length, 1);
  assert.equal(habits[0].name, "Run");
});

test("deleteHabit with unknown id leaves the list unchanged", () => {
  const habits = addHabit([], "Read");
  assert.equal(deleteHabit(habits, "nope").length, 1);
});

test("toggleToday marks a habit completed for today", () => {
  let habits = addHabit([], "Read");
  habits = toggleToday(habits, habits[0].id);
  assert.ok(isCompletedToday(habits[0]));
});

test("toggleToday unmarks when toggled twice", () => {
  let habits = addHabit([], "Read");
  habits = toggleToday(habits, habits[0].id);
  habits = toggleToday(habits, habits[0].id);
  assert.equal(isCompletedToday(habits[0]), false);
});

test("yesterday's completion does not count for today", () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  let habits = [{ id: "h1", name: "Read", lastCompleted: todayKey(yesterday) }];
  assert.equal(isCompletedToday(habits[0]), false);
  assert.equal(completedTodayCount(habits), 0);
  habits = toggleToday(habits, "h1");
  assert.ok(isCompletedToday(habits[0]));
  assert.equal(completedTodayCount(habits), 1);
});

test("toggleToday only affects the target habit", () => {
  let habits = addHabit([], "Read");
  habits = addHabit(habits, "Run");
  habits = toggleToday(habits, habits[0].id);
  assert.equal(isCompletedToday(habits[1]), false);
});

test("toggleToday does not mutate the input list", () => {
  const habits = addHabit([], "Read");
  const updated = toggleToday(habits, habits[0].id);
  assert.notEqual(habits, updated);
  assert.equal(habits[0].lastCompleted, null);
});

test("completedTodayCount counts only today's completions", () => {
  const key = todayKey();
  const habits = [
    { id: "1", name: "A", lastCompleted: key },
    { id: "2", name: "B", lastCompleted: null },
    { id: "3", name: "C", lastCompleted: "2000-01-01" },
  ];
  assert.equal(completedTodayCount(habits), 1);
  assert.equal(completedTodayCount([]), 0);
});
