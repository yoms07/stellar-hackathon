# Agent lessons: working this repo with AI assistants

Distilled from a real 2026-07-16 session where an AI assistant made three avoidable mistakes while porting the /start onboarding flow into the prototype. The outcome was fine (PR #4), but these lessons are about catching the mistakes earlier.

## Lesson 1: the prototype lives ONLY in `prototype/` in this repo

Stale local copies of the prototype exist on contributors' machines from before it was merged into the repo (around July 14). An agent burned a full implementation cycle building a feature against one of those stale copies (old logo, old styles) and presented an outdated design as current.

Rule: before any prototype work, run `git log -3 -- prototype/` and open the deployed site (komunify-prototype.pages.dev) to anchor on current state. If a local folder disagrees with the repo, the repo wins. Never edit prototype files outside this repo.

## Lesson 2: an agent report that describes process is not a result

A delegated agent "kicked off" its work in a background process, terminated itself, and reported it would "wait for completion." Nothing was ever written.

Rule: only accept agent reports containing evidence (file diffs, command output you can re-run). On a process-only report, check the working tree immediately (`git status`, does the file exist) and re-dispatch.

## Lesson 3: verify absence with two independent mechanisms before accusing

Right after a fresh file write, `ls`, `find`, and a local HTTP request all said the file was missing. But `git status` and a direct `os.path.exists` check proved it existed (cloud-synced folders and shell wrappers can lag on fresh writes). The agent wrongly reported the work as undelivered in between.

Rule: before declaring a file or change missing, corroborate with at least two mechanisms (for example, `git status` plus a direct stat). Retry once after a couple of seconds on synced folders.

## Pre-work checklist (agents, run this before touching prototype/)

1. `git log --oneline -3 -- prototype/` (anchor on the latest state)
2. Open the deployed prototype and compare
3. Confirm you are editing files under this repo's `prototype/`, nowhere else
4. Ship via a feature branch and PR, never direct to main
