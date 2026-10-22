import {
  addHabit,
  deleteHabit,
  toggleToday,
  isCompletedToday,
  completedTodayCount,
} from "./habits.js";

const STORAGE_KEY = "habits";
const MAX_HABITS = 50;

const form = document.getElementById("add-habit-form");
const input = document.getElementById("habit-name");
const statusEl = document.getElementById("form-status");
const progressEl = document.getElementById("progress");
const listEl = document.getElementById("habit-list");
const emptyEl = document.getElementById("empty-state");

/** Load habits from localStorage; fall back to [] on parse errors or first visit. */
function loadHabits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHabits(habits) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

let habits = loadHabits();

let statusTimer;

/** Show a transient message under the form (e.g. rejected input). */
function showStatus(message) {
  statusEl.textContent = message;
  statusEl.hidden = false;
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => {
    statusEl.hidden = true;
  }, 2500);
}

/** Render the whole UI from the current `habits` state. */
function render() {
  listEl.textContent = "";
  for (const habit of habits) {
    const done = isCompletedToday(habit);
    const card = document.createElement("article");
    card.className = "habit-card" + (done ? " done" : "");
    card.dataset.id = habit.id;

    const name = document.createElement("span");
    name.className = "habit-name";
    name.textContent = habit.name;

    const completeBtn = document.createElement("button");
    completeBtn.type = "button";
    completeBtn.className = "btn btn-complete";
    completeBtn.textContent = done ? "Completed ✓" : "Mark done";
    completeBtn.setAttribute("aria-pressed", String(done));
    completeBtn.setAttribute("aria-label", `Mark "${habit.name}" as done today`);
    completeBtn.addEventListener("click", () => {
      habits = toggleToday(habits, habit.id);
      saveHabits(habits);
      render();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn btn-delete";
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("aria-label", `Delete habit "${habit.name}"`);
    deleteBtn.addEventListener("click", () => {
      habits = deleteHabit(habits, habit.id);
      saveHabits(habits);
      render();
    });

    card.append(name, completeBtn, deleteBtn);
    listEl.append(card);
  }

  emptyEl.hidden = habits.length > 0;
  progressEl.hidden = habits.length === 0;
  if (habits.length > 0) {
    progressEl.textContent = "";
    const count = document.createElement("span");
    count.className = "progress-count";
    count.textContent = `${completedTodayCount(habits)} of ${habits.length}`;
    progressEl.append(count, " habits completed today.");
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (habits.length >= MAX_HABITS) {
    showStatus(`You can track up to ${MAX_HABITS} habits.`);
    return;
  }
  const next = addHabit(habits, input.value);
  if (next === habits) {
    showStatus(
      input.value.trim()
        ? "That habit is already on your list."
        : "Please enter a habit name."
    );
    return;
  }
  habits = next;
  input.value = "";
  input.focus();
  statusEl.hidden = true;
  saveHabits(habits);
  render();
});

render();
