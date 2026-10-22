# buildful-habit-tracker

A simple, mobile-friendly habit tracker built to test AI-powered coding, functionality, and automated testing.

## Features

- Add habits by name (duplicates and empty names are rejected)
- Habit cards with "Mark done" / "Completed ✓" toggle for today
- Delete habits
- Progress counter, e.g. "2 of 5 habits completed today"
- Empty state when no habits exist
- Habits persist in `localStorage` across refreshes
- Simple, modern, responsive UI with light/dark support

## Run it

```sh
npm start
```

Then open http://localhost:3000. (No build step or dependencies — plain HTML/CSS/JS.)

## Test it

```sh
npm test
```

Runs unit tests for the pure habit logic (`habits.js`) with Node's built-in test runner.
