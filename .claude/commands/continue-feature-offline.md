---
description: Continue implementing the next task for a feature
---

# Continue Feature Implementation

Finds and implements the next unchecked task from a feature's implementation plan.

## Prerequisites

- Feature folder must be attached to conversation OR specify which feature to continue
- Feature folder should contain `implementation-plan.md`

## Instructions

### 1. Locate the Feature

Look for the feature folder attached to the conversation at `/specs/{feature-name}/`.

Required files:
- `implementation-plan.md` - Task breakdown with checkboxes
- `requirements.md` - Feature requirements and acceptance criteria

If no folder is attached, ask:
> "Which feature do you want to continue? Drag the feature folder into the conversation or tell me the feature name."

### 2. Read Current Progress

Parse `implementation-plan.md` and identify:
- Total phases and tasks
- Completed tasks `[x]`
- Remaining tasks `[ ]`
- Current phase (first phase with unchecked tasks)

### 3. Display Progress Summary

Before starting, show:

```
📊 Feature: {feature-name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Progress: {completed}/{total} tasks ({percentage}%)
{progress_bar}

Current Phase: {N} - {Phase Name}
Phase Progress: {phase_completed}/{phase_total} tasks

📋 Next Task:
{task description}
```

**Progress bar format:**
- Use `█` for completed portions
- Use `░` for remaining portions
- Total width: 16 characters
- Example: `████████░░░░░░░░ 50%`

### 4. Implement the Task

Before implementing:
1. **Read `requirements.md`** - Required for understanding acceptance criteria and feature context
2. Review relevant parts of the codebase based on the task
3. Identify files that will need modification

Implementation guidelines:
- Follow existing code patterns
- Use project conventions (imports, naming, etc.)
- Run `pnpm lint && pnpm typecheck` after changes
- Fix any errors before proceeding

### 5. Update Implementation Plan

After successful implementation, update `implementation-plan.md`:
- Change `- [ ] {task}` to `- [x] {task}`

### 5a. Handle Implementation Failures

If implementation fails or needs to be reverted:

1. **Revert uncommitted changes:**
   ```bash
   git checkout -- .
   ```

2. **If already committed but not pushed:**
   ```bash
   git reset --soft HEAD~1
   ```

3. **Document the blocker** - Add a note about what's blocking the task and ask user for guidance

4. **Do NOT mark the task as complete** - Leave it unchecked `[ ]` for retry

5. **Report the issue:**
   ```
   ⚠️ Task blocked: {task description}

   Blocker: {description of what's preventing completion}

   Options:
   - Fix the blocker and retry
   - Skip this task and continue with next
   - Get user guidance
   ```

### 6. Commit and Push

```bash
git add .
git commit -m "feat({feature-name}): {brief task description}"

# Push with upstream tracking (handles new branches automatically)
git push -u origin HEAD
```

Commit message format:
- `feat(feature): description` - for new functionality
- `fix(feature): description` - for bug fixes
- `refactor(feature): description` - for refactoring

### 7. Report Completion

After completing:

```
✅ Task complete!

{task description}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Progress: {completed}/{total} tasks ({percentage}%)
Phase {N}: {phase_completed}/{phase_total} tasks
{progress_bar}

Files Changed:
- **Modified**: {list of modified files}
- **Added**: {list of new files, if any}
- **Deleted**: {list of removed files, if any}

Summary:
{2-3 sentence description of what was implemented and why}

Commit: {short-hash} - {commit message}
Pushed to: origin/{branch}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Continue with next task? (say "continue" or drop folder again)
```

### 8. Phase Completion

When all tasks in a phase are complete:

```
🎉 Phase {N} complete: {Phase Name}

Moving to Phase {N+1}: {Next Phase Name}
{Display next task}
```

### 9. Feature Completion

When all tasks are complete:

```
🎉 Feature "{feature-name}" complete!

Summary:
- {N} phases completed
- {total} tasks implemented
- {X} commits made

The feature is ready for review/testing.
```

## Edge Cases

### No implementation-plan.md

```
❌ No implementation-plan.md found in /specs/{feature-name}/

Run `/create-feature` first to create the feature specification.
```

### All tasks complete

```
🎉 All tasks for "{feature-name}" are already complete!

Nothing left to implement.
```

### Lint/typecheck fails

```
⚠️ Lint/type errors found:

{error output}

Fix these before I can commit. Want me to attempt fixes?
```

### Task is unclear

```
❓ Task needs clarification: {task description}

Questions:
- {specific question about the task}
- {another question if needed}

Please clarify so I can proceed with implementation.
```

### Required files missing

```
⚠️ Cannot implement task - missing dependencies:

Missing files:
- {file that should exist but doesn't}

This task depends on previous work. Either:
1. Implement the missing files first
2. Adjust the task to not require them
3. Skip this task
```

### Conflict with existing code

```
⚠️ Implementation conflict detected:

The task requires changes that conflict with existing code:
- {description of conflict}

Options:
1. {proposed solution A}
2. {proposed solution B}
3. Ask user for guidance

Which approach would you prefer?
```

## Notes

- Implement ONE task per invocation unless user asks for more
- Always run lint and typecheck before committing
- If task is unclear, ask for clarification
- Keep commits atomic - one task per commit
