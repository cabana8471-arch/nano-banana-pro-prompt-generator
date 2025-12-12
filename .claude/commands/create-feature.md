---
description: Create a new feature with requirements and implementation plan
---

# Create Feature Specification

Transform the conversation above into a structured feature specification in `/specs`.

## Instructions

### 1. Determine Feature Name

- Extract the feature name from the conversation
- Convert to **kebab-case** for the folder name
  - Example: "User Authentication" → `user-authentication`
  - Example: "Payment Integration" → `payment-integration`

### 2. Check for Existing Specs

Before creating, check if a similar feature folder already exists in `/specs`:

```bash
ls -la specs/
```

If a similar spec exists, ask the user:
- **Update** the existing spec?
- **Create new version** (e.g., `feature-name-v2`)?
- **Cancel**?

### 3. Create Folder Structure

Create `/specs/{feature-name}/` with these files:
- `requirements.md`
- `implementation-plan.md`
- `action-required.md`

---

## Templates

### requirements.md

```markdown
# {Feature Name} - Requirements

## Overview

{2-3 sentence description of what this feature does and why it's needed}

## User Decisions

Key decisions made during the planning conversation:
- {Scope decisions}
- {Technology/library choices}
- {Integration points}
- {Explicit exclusions requested by user}

## Requirements

### {Category 1 - e.g., "Core Functionality"}

1. {Requirement with details}
2. {Requirement with details}

### {Category 2 - e.g., "UI/UX"} (if applicable)

1. {Requirement with details}

### {Category 3 - e.g., "Data/Storage"} (if applicable)

1. {Requirement with details}

## Out of Scope

- {Explicitly NOT included in this feature}
- {Deferred to future work}
```

### implementation-plan.md

```markdown
# {Feature Name} - Implementation Plan

## Summary

| Phase | Focus | Est. Files |
|-------|-------|------------|
| 1 | {Phase 1 focus} | ~X |
| 2 | {Phase 2 focus} | ~X |
| ... | ... | ... |

**Complexity:** {S/M/L} ({N} phases)

---

## Phase 1: {Phase Name}

{Brief description of this phase's goal}

### {Category - e.g., "Database"}

- [ ] Task description - `path/to/file.ts`
  - Implementation details if needed
- [ ] Task description - `path/to/file.ts`
- [ ] Complex task description [complex] - `path/to/file.ts`
  - [ ] Sub-task 1
  - [ ] Sub-task 2

### {Category - e.g., "API"} (if applicable)

- [ ] Task description - `path/to/file.ts`

### Technical Details

{Capture ALL technical specifics from planning conversation relevant to this phase:}

- **CLI commands:** Package installations, migrations, code generation
- **Database schemas:** Table definitions, column types, relations
- **Code snippets:** Key implementation patterns, type definitions
- **API endpoints:** Routes, methods, request/response shapes
- **Third-party integration:** SDK usage, webhook formats, auth flows

---

## Phase 2: {Phase Name}

{Brief description}

### {Category}

- [ ] Task description (depends on Phase 1) - `path/to/file.ts`
- [ ] Task description - `path/to/file.ts`

### Technical Details

{Technical details for Phase 2 tasks}

---

## Implementation Order

Execute phases sequentially. Each phase must be completed before starting the next.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VAR_NAME` | Description | Yes/No |
```

**Note:** Tasks marked with `[complex]` or containing nested sub-tasks will be created as separate GitHub issues when published (linked to their parent phase issue).

### action-required.md

```markdown
# Action Required: {Feature Name}

Manual steps that must be completed by a human. These cannot be automated.

## Before Implementation

- [ ] **{Action}** - {Brief reason why this is needed}

## During Implementation

- [ ] **{Action}** - {Brief reason}

## After Implementation

- [ ] **{Action}** - {Brief reason}

---

> **Note:** These tasks are also listed in context within `implementation-plan.md`
```

#### When No Manual Steps Exist

If the feature has no manual steps, create the file with:

```markdown
# Action Required: {Feature Name}

No manual steps required for this feature.

All tasks can be implemented automatically.
```

---

## Guidelines

### Complexity Levels

- **S (Small):** 1-3 phases, ~10 files or less
- **M (Medium):** 4-6 phases, ~20 files
- **L (Large):** 7+ phases, 30+ files

### Task Format

Each task should:
- Start with a checkbox `[ ]`
- Include a brief description
- Reference the file path in backticks
- Add sub-bullets for implementation details if complex
- Mark with `[complex]` suffix when applicable

### When to Use `[complex]`

Mark a task with `[complex]` when it:
- Has multiple sub-tasks that need individual tracking
- Requires significant architectural decisions
- Spans multiple files or systems
- Would benefit from its own GitHub issue for comments/review

Most tasks should NOT be marked complex - reserve this for genuinely substantial work items.

### Exclusions

- **Exclude** unit and e2e testing UNLESS the user explicitly requests it
- **Exclude** deployment/CI configuration unless requested

### Capturing Technical Details

**CRITICAL**: The implementation plan must capture ALL technical details discussed during planning. The plan is the single source of truth - anything not captured here is lost.

Review the conversation before finalizing to ensure nothing is missed:
- CLI commands
- Database schemas
- Code snippets
- File paths
- Environment variables
- API endpoints
- Third-party integration details

These details flow through to GitHub issues via `/publish-to-github`, making them available to any agent (or human) implementing the tasks.

### Common Manual Tasks (for action-required.md)

- Account creation (third-party services)
- API key generation
- Environment variables setup
- OAuth app configuration
- DNS/domain setup
- Billing/subscription setup
- Third-party service registration

---

## After Creation

Display this summary to the user:

```
Feature spec created at /specs/{feature-name}/

Files:
- requirements.md - Feature requirements, decisions, and scope
- implementation-plan.md - {N} phases, complexity: {S/M/L}
- action-required.md - {N} manual tasks (or "None required")

Next steps:
1. Review `action-required.md` for tasks you need to complete manually
2. Review the requirements and implementation plan
3. Run `/publish-to-github` to create GitHub issues and project
4. Use `/continue-feature` to start implementing
```

---

## If No Conversation Exists

If no feature discussion exists in the conversation, ask the user:

1. **What feature do you want to build?** (brief description)
2. **What's the core functionality?** (main user actions)
3. **Any specific technologies or integrations?**
4. **What should be explicitly out of scope?**

Then proceed to create the spec based on their answers.

---

## Notes

- Keep tasks atomic - each should be implementable in a single session
- Tasks should produce working, testable code when complete
- Use clear, descriptive task names that explain what will be done
- Note dependencies explicitly when tasks must be done in order
- **Don't lose planning details**: If technical specifics were discussed during planning, they MUST appear in the `### Technical Details` section of the relevant phase
