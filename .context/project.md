# dotheyplaytoday: Project Context

This is the living "what should I know when I open this repo" document.

## What This Project Is

dotheyplaytoday is a notification service for recurring events. The goal is to deliver reliable notifications relative to a recurring schedule.

The initial plan is to notify for Boston Celtics games, but it will extend to other recurring schedules.

Celtics example:
If the Celtics are playing today, send me an email at 9:00 AM telling me so, and who they are playing. If not, send nothing.

## How It Works (User View)

- Choose a schedule to follow (e.g., Celtics games).
- Choose a recurrence style (day of, day before, or event-relative like 30 minutes before).
- Choose a delivery time for daily-style notifications (e.g., morning).
- The system runs regularly, checks the schedule, and only sends when your rule matches.

Note: MVP starts with daily notifications and a simple recurrence; details live in `.context/prd-recurring-notifications.md`.

## How To Update This File

Update this file whenever the project's purpose, constraints, or major decisions change. It should remain the fastest way to understand the project at a glance.
